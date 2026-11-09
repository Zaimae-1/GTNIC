begin;

create extension if not exists btree_gist with schema extensions;

create table public.saji_reservation_staff (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create table public.saji_reservations (
  tracking_hash bytea primary key,
  id text not null unique check (id ~ '^RSV-[A-F0-9]{8}$'),
  name text not null check (char_length(btrim(name)) between 1 and 80),
  phone text not null check (phone ~ '^(\+62|62|0)8[0-9]{7,12}$'),
  date date not null,
  time time not null check (time between time '10:00' and time '20:00' and extract(minute from time) in (0, 30) and extract(second from time) = 0),
  guests integer not null check (guests between 1 and 30),
  area text not null check (area in ('Ruang keluarga', 'Teras taman', 'Ruang privat', 'Lesehan')),
  "table" text not null default '' check (
    "table" = '' or case area
      when 'Ruang keluarga' then "table" ~ '^[1-8]$' and guests <= 4
      when 'Teras taman' then "table" ~ '^(9|1[0-6])$' and guests <= 6
      when 'Ruang privat' then "table" ~ '^(1[7-9]|2[0-4])$' and guests <= 8
      when 'Lesehan' then "table" ~ '^(2[5-9]|3[0-2])$' and guests <= 6
    end
  ),
  occasion text not null check (occasion in ('Makan bersama', 'Ulang tahun', 'Arisan', 'Pertemuan', 'Lainnya')),
  note text not null default '' check (char_length(note) <= 400),
  status text not null default 'Menunggu konfirmasi' check (status in ('Menunggu konfirmasi', 'Dikonfirmasi', 'Selesai', 'Ditolak', 'Dibatalkan')),
  created_at timestamptz not null default now(),
  exclude using gist (
    "table" extensions.gist_text_ops with =,
    tsrange(date + time, date + time + interval '90 minutes') with &&
  ) where ("table" <> '' and status in ('Menunggu konfirmasi', 'Dikonfirmasi'))
);

alter table public.saji_reservation_staff enable row level security;
alter table public.saji_reservations enable row level security;
revoke all on public.saji_reservation_staff, public.saji_reservations from public, anon, authenticated;
grant select (user_id) on public.saji_reservation_staff to authenticated;
grant select (id, name, phone, date, time, guests, area, "table", occasion, note, status, created_at)
  on public.saji_reservations to authenticated;
grant update (status) on public.saji_reservations to authenticated;

create policy "Staff can check their own membership" on public.saji_reservation_staff
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Staff can read reservations" on public.saji_reservations
  for select to authenticated using (exists (select 1 from public.saji_reservation_staff where user_id = (select auth.uid())));

create policy "Staff can update reservation status" on public.saji_reservations
  for update to authenticated
  using (exists (select 1 from public.saji_reservation_staff where user_id = (select auth.uid())))
  with check (exists (select 1 from public.saji_reservation_staff where user_id = (select auth.uid())));

create function public.saji_submit_reservation(
  p_token uuid, p_id text, p_name text, p_phone text, p_date date, p_time time,
  p_guests integer, p_area text, p_table text, p_occasion text, p_note text
) returns text
language plpgsql security definer set search_path = ''
as $$
declare
  token_hash bytea := sha256(convert_to(p_token::text, 'UTF8'));
  reservation_id text;
begin
  -- Serialize retries of the same submission before checking the requested slot.
  perform pg_advisory_xact_lock(hashtextextended(p_token::text, 0));
  select id into reservation_id from public.saji_reservations where tracking_hash = token_hash;
  if found then return reservation_id; end if;
  if p_date + p_time <= now() at time zone 'Asia/Jakarta' then
    raise exception using errcode = '22023', message = 'Reservation time has passed';
  end if;
  insert into public.saji_reservations (tracking_hash, id, name, phone, date, time, guests, area, "table", occasion, note)
    values (token_hash, p_id, btrim(p_name), p_phone, p_date, p_time, p_guests, p_area, p_table, p_occasion, btrim(p_note));
  return p_id;
end;
$$;

create function public.saji_reservation_status(p_token uuid, p_cancel boolean default false)
returns text language plpgsql security definer set search_path = ''
as $$
declare
  token_hash bytea := sha256(convert_to(p_token::text, 'UTF8'));
  reservation_status text;
begin
  if p_cancel then
    update public.saji_reservations set status = 'Dibatalkan'
      where tracking_hash = token_hash and status = 'Menunggu konfirmasi';
  end if;
  select status into reservation_status from public.saji_reservations where tracking_hash = token_hash;
  return reservation_status;
end;
$$;

revoke all on function public.saji_submit_reservation(uuid, text, text, text, date, time, integer, text, text, text, text) from public, anon, authenticated;
revoke all on function public.saji_reservation_status(uuid, boolean) from public, anon, authenticated;
grant execute on function public.saji_submit_reservation(uuid, text, text, text, date, time, integer, text, text, text, text) to anon, authenticated;
grant execute on function public.saji_reservation_status(uuid, boolean) to anon, authenticated;

commit;
