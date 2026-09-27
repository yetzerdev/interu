-- =====================================================================
-- LECTURA DEL NOMBRE REAL PARA EL SALUDO DEL HOME
-- =====================================================================
-- Las tres funciones private_* de 0001 solo escriben. El nombre real se
-- guardaba pero no habia forma de volver a leerlo: el schema `private` no es
-- alcanzable por PostgREST ni siquiera con service_role, que es exactamente
-- lo que el aislamiento de 0001 pretendia.
--
-- Esta es la puerta de lectura, con el mismo aislamiento que las otras tres:
-- SECURITY DEFINER, search_path fijo, execute solo para service_role. La usa
-- el home para escribir "Buenos dias, <nombre>" a la persona yalogueada.
--
-- OJO: legal_name es el nombre del documento de identidad, no un nombre que
-- el usuario elige mostrar. No debe usarse para renderizar nada que otra
-- persona pueda ver, ni exportarse.
-- =====================================================================

create or replace function public.private_get_legal_name(
  p_user_id uuid
) returns text
language plpgsql
security definer
set search_path = public, private
as $$
begin
  return (
    select legal_name
    from private.real_identities
    where user_id = p_user_id
  );
end;
$$;

revoke all on function public.private_get_legal_name(uuid) from public;
revoke all on function public.private_get_legal_name(uuid) from anon;
revoke all on function public.private_get_legal_name(uuid) from authenticated;
grant execute on function public.private_get_legal_name(uuid) to service_role;
