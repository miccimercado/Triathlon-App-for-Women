-- Create the demo auth user through Supabase Dashboard or Admin API first, then replace this UUID.
-- This seed intentionally avoids hard-coding credentials in client-visible tables.
do $$
declare demo_id uuid := '00000000-0000-4000-8000-000000000001';
begin
  if exists (select 1 from auth.users where id = demo_id) then
    insert into public.users(id, display_name, timezone, consent_version, consented_at)
      values (demo_id, 'Michelle', 'America/Vancouver', '2026-07', now()) on conflict (id) do nothing;
    insert into public.athlete_profiles(user_id, age, weight_kg, experience_level, primary_goal, current_weekly_hours, cycle_data_consent)
      values (demo_id, 36, 55, 'intermediate', 'finish', 8, true) on conflict (user_id) do nothing;
    insert into public.race_goals(user_id, race_name, race_distance, race_date, goal)
      values (demo_id, 'Victoria 70.3', '70.3', current_date + 126, 'finish feeling strong');
    insert into public.integrations(user_id, provider, status, permission_state, last_sync_at)
      values (demo_id, 'garmin', 'connected', '{"mode":"mock","activities":true,"wellness":true}', now()),
             (demo_id, 'calendar', 'connected', '{"mode":"mock","read_busy":true,"write":false}', now());
  end if;
end $$;
