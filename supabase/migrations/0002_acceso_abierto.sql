-- =====================================================================
-- 0002 — Acceso abierto: el correo institucional deja de ser obligatorio.
--
-- Corre en la base YA creada (0001_init.sql solo afecta instalaciones
-- nuevas). Ejecutar en el SQL Editor de Supabase.
--
-- Con esto, `completarPerfil()` puede llamar a private_insert_identity()
-- con p_email = NULL: el alias se genera en el paso 2 y la cuenta ya
-- existe desde el paso 1, sin correo institucional de por medio.
--
-- No hace falta tocar public.universities.email_domain: ya es nullable y
-- hoy no condiciona el acceso, solo queda como metadato.
-- =====================================================================

alter table private.real_identities
  alter column institutional_email drop not null;
