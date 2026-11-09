begin;

create function public.saji_update_reservation_status(p_id text, p_status text)
returns text language sql security invoker set search_path = ''
as $$
  update public.saji_reservations set status = p_status where id = p_id returning id;
$$;

revoke all on function public.saji_update_reservation_status(text, text) from public, anon, authenticated;
grant execute on function public.saji_update_reservation_status(text, text) to authenticated;

commit;
