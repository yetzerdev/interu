-- =====================================================================
-- InterU Honduras — Migracion inicial (Fase 1)
--
-- Modelo de datos: IDENTIDAD ASIMETRICA + MINIMIZACION DE DATOS.
--
--   - public.profiles              -> identidad PUBLICA (solo alias, sin PII)
--   - private.real_identities      -> identidad REAL (PII, service_role ONLY)
--   - public.verification_requests -> cola de revision (estado, no PII)
--
-- ACCESO ABIERTO: el correo NO tiene que ser institucional. `registrar()`
-- crea la cuenta con correo + contrasena y `completarPerfil()` genera el
-- alias despues, sin pasar por la cola de revision. Por eso
-- `universities.email_domain` ya no condiciona el acceso: queda como
-- metadato opcional por si mas adelante se quiere marcar "estudiante
-- verificado" con insignia.
--
-- La imagen del carne vive en el bucket privado `evidence` y se PURGA
-- al aprobar; en su lugar queda un HMAC (prueba sin PII para revocacion).
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- ENUMS ----------
create type public.verification_status as enum ('pendiente', 'aprobado', 'rechazado');
-- 'email_institucional' se conserva por compatibilidad con filas historicas;
-- con acceso abierto el registro normal ya no genera solicitudes.
create type public.verification_method as enum ('email_institucional', 'carne');
create type public.profile_role as enum ('miembro', 'admin');

-- ---------- UNIVERSIDADES / CAMPUS ----------
create table public.universities (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  email_domain text,               -- metadato opcional; NO condiciona el acceso
  active boolean not null default true,
  created_at timestamz not null default now()
);

create table public.campuses (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references public.universities (id) on delete cascade,
  name text not null,
  alias_slug text not null,         -- sufijo del alias publico (@Alias_slug)
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (university_id, name),
  unique (university_id, alias_slug)
);

create index campuses_university_idx on public.campuses (university_id);

-- ---------- IDENTIDAD PUBLICA (sin PII) ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  alias text not null unique,       -- seudonimo NO adivinable (generado server-side)
  university_id uuid not null references public.universities (id),
  campus_id uuid not null references public.campuses (id),
  verification_status public.verification_status not null default 'pendiente',
  role public.profile_role not null default 'miembro',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- COLA DE VERIFICACION ----------
create table public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  university_id uuid not null references public.universities (id),
  campus_id uuid not null references public.campuses (id),
  method public.verification_method not null,
  status public.verification_status not null default 'pendiente',
  evidence_path text,               -- bucket privado; se ANULA al aprobar
  evidence_hmac text,               -- prueba sin PII (revocacion posterior)
  reviewed_by uuid references auth.users (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index verification_requests_status_idx
  on public.verification_requests (status, created_at);
create index verification_requests_user_idx
  on public.verification_requests (user_id);

-- Solo una solicitud PENDIENTE por usuario.
create unique index verification_requests_one_pending_per_user
  on public.verification_requests (user_id)
  where status = 'pendiente';

-- =====================================================================
-- IDENTIDAD REAL (PII) — SCHEMA PRIVADO
-- =====================================================================
create schema if not exists private;

create table private.real_identities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  legal_name text not null,
  national_id text,                 -- PII
  institutional_email text,         -- PII; con acceso abierto puede ir NULL
  photo_path text,                  -- bucket `evidence`; PURGADO al aprobar
  created_at timestamz not null default now(),
  updated_at timestamz not null default now()
);

create index real_identities_user_idx on private.real_identities (user_id);

-- --- AISLAMIENTO: la garantia fuerte es "sin acceso desde cliente" ---
-- Sin USAGE sobre el schema, anon/authenticated ni siquiera ven que existe.
-- service_role (usado solo en la DAL) lo bypasea.
revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;

revoke all on all tables in schema private from public;
revoke all on all tables in schema private from anon;
revoke all on all tables in schema private from authenticated;

-- RLS como defensa en profundidad (sin policies => nadie por RLS).
alter table private.real_identities enable row level security;

-- =====================================================================
-- RPCs PUENTE hacia el schema privado
--
-- El schema `private` NO esta expuesto en la API de Supabase (db-schemas),
-- asi que ni service_role lo alcanza via PostgREST. Para evitar exponer la
-- tabla PII en la superficie de la API (requisito: "el vinculo queda
-- desacoplado"), el servidor la accede unicamente via estas funciones
-- SECURITY DEFINER, ejecutables solo por service_role.
-- =====================================================================

create or replace function public.private_insert_identity(
  p_user_id uuid,
  p_legal_name text,
  p_national_id text,
  p_email text,
  p_photo_path text default null
) returns void
language plpgsql
security definer
set search_path = public, private
as $$
begin
  insert into private.real_identities (user_id, legal_name, national_id, institutional_email, photo_path)
  values (p_user_id, p_legal_name, p_national_id, p_email, p_photo_path)
  on conflict (user_id) do update
    set legal_name = excluded.legal_name,
        national_id = excluded.national_id,
        institutional_email = excluded.institutional_email,
        updated_at = now();
end;
$$;

create or replace function public.private_set_photo(
  p_user_id uuid,
  p_photo_path text
) returns void
language plpgsql
security definer
set search_path = public, private
as $$
begin
  update private.real_identities
     set photo_path = p_photo_path, updated_at = now()
   where user_id = p_user_id;
end;
$$;

create or replace function public.private_purge_photo(
  p_user_id uuid
) returns void
language plpgsql
security definer
set search_path = public, private
as $$
begin
  update private.real_identities
     set photo_path = null, updated_at = now()
   where user_id = p_user_id;
end;
$$;

-- Solo service_role puede invocar estas funciones.
revoke all on function public.private_insert_identity(uuid, text, text, text, text) from public;
revoke all on function public.private_insert_identity(uuid, text, text, text, text) from anon;
revoke all on function public.private_insert_identity(uuid, text, text, text, text) from authenticated;
grant execute on function public.private_insert_identity(uuid, text, text, text, text) to service_role;

revoke all on function public.private_set_photo(uuid, text) from public;
revoke all on function public.private_set_photo(uuid, text) from anon;
revoke all on function public.private_set_photo(uuid, text) from authenticated;
grant execute on function public.private_set_photo(uuid, text) to service_role;

revoke all on function public.private_purge_photo(uuid) from public;
revoke all on function public.private_purge_photo(uuid) from anon;
revoke all on function public.private_purge_photo(uuid) from authenticated;
grant execute on function public.private_purge_photo(uuid) to service_role;

-- =====================================================================
-- HELPERS + RLS (public)
-- =====================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger verification_requests_set_updated_at
  before update on public.verification_requests
  for each row execute function public.set_updated_at();

create trigger real_identities_set_updated_at
  before update on private.real_identities
  for each row execute function public.set_updated_at();

-- Comprueba admin leyendo el propio perfil (sin security definer).
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- --- Catalogos publicos (legibles por anon para el formulario de registro) ---
alter table public.universities enable row level security;
alter table public.campuses enable row level security;

create policy "read active universities"
  on public.universities for select to anon, authenticated using (active);
create policy "read active campuses"
  on public.campuses for select to anon, authenticated using (active);

-- --- Identidad publica ---
alter table public.profiles enable row level security;

create policy "read own profile"
  on public.profiles for select to authenticated using (id = auth.uid());
create policy "admin reads profiles"
  on public.profiles for select to authenticated using (public.is_admin());

-- SIN policies de INSERT/UPDATE en profiles a proposito: asi el cliente no
-- puede auto-aprobar su verificacion ni auto-ascender a admin.
-- Toda mutacion pasa por la DAL con service_role.

-- --- Cola de verificacion ---
alter table public.verification_requests enable row level security;

create policy "read own requests"
  on public.verification_requests for select to authenticated
  using (user_id = auth.uid());
create policy "admin reads requests"
  on public.verification_requests for select to authenticated
  using (public.is_admin());

-- SIN policies de escritura: la cola se gestiona via service_role (DAL).

-- =====================================================================
-- STORAGE: bucket privado de evidencia (carné)
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit)
values ('evidence', 'evidence', false, 5242880)  -- 5 MB
on conflict (id) do nothing;

-- Sin policies de storage para anon/authenticated: el upload y el borrado
-- los hace la DAL con service_role. El bucket es privado (public = false).

-- =====================================================================
-- SEED: catalogos (ajustar/confirmar con cada universidad)
-- =====================================================================
-- email_domain es solo metadato: el acceso es abierto y no se usa para
-- aprobar cuentas. Sirve para, mas adelante, marcar con insignia a quien
-- si escribe desde el dominio de su institucion.
insert into public.universities (code, name, email_domain) values
  ('UNAH', 'Universidad Nacional Autónoma de Honduras', 'unah.edu.hn'),
  ('UPN',  'Universidad Politécnica Nacional',                'upn.edu.hn'),
  ('TSU',  'Universidad Tecnológica de Honduras',             'ut.hn'),
  ('UASDH','Universidad Autónoma de Honduras',                 'uash.edu.hn')
on conflict (code) do nothing;

insert into public.campuses (university_id, name, alias_slug)
select u.id, c.name, c.slug
from public.universities u
join (values
  ('UNAH',  'Ciudad Universitaria',  'teg'),
  ('UNAH',  'Villanueva',             'vil'),
  ('UNAH',  'El Paraíso',            'epa'),
  ('UNAH',  'San Pedro Sula',         'sps'),
  ('UNAH',  'Comayagua',              'cma'),
  ('UPN',   'Tegucigalpa',            'teg'),
  ('TSU',   'Tegucigalpa',            'teg'),
  ('UASDH', 'Tegucigalpa',            'teg')
) as c(uni, name, slug) on c.uni = u.code
on conflict (university_id, name) do nothing;
