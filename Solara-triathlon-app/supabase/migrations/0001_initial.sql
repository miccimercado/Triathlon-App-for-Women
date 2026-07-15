-- Solara initial schema. Run in a new Supabase project.
create extension if not exists pgcrypto;

create type public.training_sport as enum ('swim','bike','run','strength','mobility','brick','rest');
create type public.training_phase as enum ('base','build','peak','taper','race','recovery');
create type public.integration_provider as enum ('garmin','apple','strava','trainingpeaks','calendar');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  timezone text not null default 'UTC',
  preferred_units text not null default 'metric' check (preferred_units in ('metric','imperial')),
  model_training_opt_in boolean not null default false,
  sensitive_analytics_opt_in boolean not null default false,
  consent_version text,
  consented_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.athlete_profiles (
  id uuid primary key default gen_random_uuid(), user_id uuid not null unique references public.users(id) on delete cascade,
  age smallint check (age between 18 and 100), height_cm numeric, weight_kg numeric,
  country text, experience_level text, primary_goal text, current_weekly_hours numeric,
  medical_restrictions text, recent_injuries text, pregnancy_status text, postpartum_status text,
  breastfeeding_status text, perimenopause_status text, contraception_status text, irregular_cycle boolean,
  cycle_data_consent boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.onboarding_answers (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  section text not null, answers jsonb not null default '{}', version integer not null default 1, completed_at timestamptz
);

create table public.race_goals (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  race_name text not null, race_distance text not null default '70.3', race_date date not null, goal text not null,
  target_metrics jsonb not null default '{}', active boolean not null default true, created_at timestamptz not null default now()
);

create table public.availability_blocks (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  weekday smallint check (weekday between 0 and 6), starts_at time, ends_at time, location_type text,
  recurring boolean not null default true, available boolean not null default true, valid_from date, valid_to date, notes text
);

create table public.equipment (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  category text not null, name text not null, available boolean not null default true, metadata jsonb not null default '{}'
);

create table public.training_zones (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  sport public.training_sport not null, method text not null, zones jsonb not null, effective_from date not null default current_date, source text
);

create table public.threshold_tests (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  sport public.training_sport not null, protocol text not null, performed_at date, result jsonb, safety_acknowledged boolean not null default false
);

create table public.training_plans (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  race_goal_id uuid references public.race_goals(id) on delete set null, name text not null, starts_on date not null, ends_on date not null,
  methodology text not null default '80/20', rules_version text not null, status text not null default 'active', generated_from jsonb not null default '{}', created_at timestamptz not null default now()
);

create table public.plan_blocks (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  plan_id uuid not null references public.training_plans(id) on delete cascade, phase public.training_phase not null,
  starts_on date not null, ends_on date not null, objectives jsonb not null default '[]'
);

create table public.plan_weeks (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  plan_id uuid not null references public.training_plans(id) on delete cascade, block_id uuid references public.plan_blocks(id) on delete set null,
  week_index integer not null, starts_on date not null, target_minutes integer not null, is_recovery boolean not null default false,
  unique(plan_id, week_index)
);

create table public.workouts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  plan_week_id uuid references public.plan_weeks(id) on delete cascade, scheduled_on date not null, sport public.training_sport not null,
  title text not null, purpose text, duration_minutes integer not null check (duration_minutes >= 0), intensity text, zone text,
  priority smallint not null default 2 check (priority between 1 and 3), status text not null default 'planned', why_text text,
  fueling_guidance text, recovery_guidance text, modification_options jsonb not null default '{}', source_rule_ids text[] not null default '{}'
);

create table public.workout_steps (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  workout_id uuid not null references public.workouts(id) on delete cascade, step_order integer not null, label text not null,
  duration_seconds integer, target_type text, target_low numeric, target_high numeric, target_unit text, notes text,
  unique(workout_id, step_order)
);

create table public.workout_completions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  workout_id uuid not null references public.workouts(id) on delete cascade, completed_at timestamptz not null default now(),
  actual_duration_minutes integer, perceived_effort smallint check (perceived_effort between 1 and 10), completion_status text, notes text, external_activity_id text
);

create table public.adaptation_events (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  workout_id uuid references public.workouts(id) on delete set null, event_type text not null, input_snapshot jsonb not null,
  output_snapshot jsonb not null, explanation text not null, rules_version text not null, created_at timestamptz not null default now()
);

create table public.daily_checkins (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  checkin_date date not null, sleep_score smallint, stress smallint, soreness smallint, mood smallint, fatigue smallint,
  under_fueled boolean, illness_symptoms boolean, notes text, unique(user_id, checkin_date)
);

create table public.cycle_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  log_date date not null, bleeding_level text, symptoms jsonb not null default '{}', symptom_impact smallint, source text not null default 'manual'
);

create table public.migraine_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  log_date date not null, status text not null, known_triggers text[] not null default '{}', severity smallint, notes text
);

create table public.mood_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  log_date date not null, mood smallint check (mood between 1 and 5), notes text
);

create table public.recovery_metrics (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  measured_at timestamptz not null, source text not null, sleep_minutes integer, resting_hr numeric, hrv_ms numeric, payload jsonb not null default '{}'
);

create table public.nutrition_profiles (
  id uuid primary key default gen_random_uuid(), user_id uuid not null unique references public.users(id) on delete cascade,
  goal text, dietary_pattern text, cooking_skill text, weekday_cooking_minutes integer, budget_level text,
  meals_per_day integer, snacks_per_day integer, caffeine_notes text, hydration_notes text, gi_notes text,
  clinical_flags jsonb not null default '{}', updated_at timestamptz not null default now()
);

create table public.dietary_preferences (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  preference_type text not null, value text not null, severity text, notes text
);

create table public.macro_targets (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  target_date date not null, day_type text not null, energy_kcal integer, carbohydrate_g integer, protein_g integer, fat_g integer,
  rationale text, adjustable boolean not null default true, unique(user_id, target_date)
);

create table public.meal_plans (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  starts_on date not null, ends_on date not null, generated_from jsonb not null default '{}', rules_version text not null, created_at timestamptz not null default now()
);

create table public.recipes (
  id uuid primary key default gen_random_uuid(), owner_user_id uuid references public.users(id) on delete cascade,
  title text not null, description text, ingredients jsonb not null, instructions jsonb not null, nutrition jsonb not null,
  tags text[] not null default '{}', prep_minutes integer, published boolean not null default false
);

create table public.meals (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  meal_plan_id uuid not null references public.meal_plans(id) on delete cascade, recipe_id uuid references public.recipes(id) on delete set null,
  planned_at timestamptz not null, meal_type text not null, servings numeric not null default 1, substitutions jsonb not null default '{}'
);

create table public.grocery_lists (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  meal_plan_id uuid references public.meal_plans(id) on delete cascade, name text not null, items jsonb not null, checked_items jsonb not null default '[]', created_at timestamptz not null default now()
);

create table public.fueling_plans (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  workout_id uuid references public.workouts(id) on delete cascade, plan_type text not null, carbohydrate_g_per_hour numeric,
  products jsonb not null default '[]', timing jsonb not null default '{}', gut_training_notes text, rationale text
);

create table public.hydration_plans (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  plan_date date not null, baseline_liters numeric, training_ml_per_hour numeric, sodium_mg_per_hour numeric,
  conditions jsonb not null default '{}', rationale text
);

create table public.safety_flags (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  flag_type text not null, severity text not null, source_table text, source_id uuid, message text not null,
  acknowledged_at timestamptz, resolved_at timestamptz, created_at timestamptz not null default now()
);

create table public.integrations (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  provider public.integration_provider not null, status text not null default 'disconnected', permission_state jsonb not null default '{}',
  last_sync_at timestamptz, revoked_at timestamptz, unique(user_id, provider)
);

-- Contains only a pointer to backend encrypted secret storage, never a raw token.
create table public.oauth_tokens (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  integration_id uuid not null unique references public.integrations(id) on delete cascade, secret_reference text not null,
  expires_at timestamptz, scopes text[] not null default '{}', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.sync_events (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.users(id) on delete cascade,
  integration_id uuid not null references public.integrations(id) on delete cascade, direction text not null,
  entity_type text not null, status text not null, external_id text, error_code text, safe_error_message text, created_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key, user_id uuid references public.users(id) on delete set null,
  actor_id uuid, action text not null, entity_type text not null, entity_id text, metadata jsonb not null default '{}', created_at timestamptz not null default now()
);

create table public.science_references (
  id text primary key, topic text not null, citation text not null, url text not null, summary text not null,
  evidence_level text, reviewed_at date, reviewed_by uuid, active boolean not null default true
);

create table public.admin_training_rules (
  id uuid primary key default gen_random_uuid(), rule_key text not null, version integer not null, rule jsonb not null,
  reference_ids text[] not null default '{}', active boolean not null default false, created_by uuid, created_at timestamptz not null default now(), unique(rule_key, version)
);

create table public.admin_nutrition_rules (
  id uuid primary key default gen_random_uuid(), rule_key text not null, version integer not null, rule jsonb not null,
  reference_ids text[] not null default '{}', active boolean not null default false, created_by uuid, created_at timestamptz not null default now(), unique(rule_key, version)
);

create index workouts_user_date_idx on public.workouts(user_id, scheduled_on);
create index checkins_user_date_idx on public.daily_checkins(user_id, checkin_date desc);
create index recovery_user_date_idx on public.recovery_metrics(user_id, measured_at desc);
create index meals_user_plan_idx on public.meals(user_id, meal_plan_id);
create index sync_integration_date_idx on public.sync_events(integration_id, created_at desc);

-- Every user-owned table is private by default.
do $$
declare t text;
begin
  foreach t in array array[
    'athlete_profiles','onboarding_answers','race_goals','availability_blocks','equipment','training_zones','threshold_tests',
    'training_plans','plan_blocks','plan_weeks','workouts','workout_steps','workout_completions','adaptation_events','daily_checkins',
    'cycle_logs','migraine_logs','mood_logs','recovery_metrics','nutrition_profiles','dietary_preferences','macro_targets','meal_plans',
    'meals','grocery_lists','fueling_plans','hydration_plans','safety_flags','integrations','oauth_tokens','sync_events'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy %I on public.%I for select using (auth.uid() = user_id)', t || '_select_own', t);
    execute format('create policy %I on public.%I for insert with check (auth.uid() = user_id)', t || '_insert_own', t);
    execute format('create policy %I on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id)', t || '_update_own', t);
    execute format('create policy %I on public.%I for delete using (auth.uid() = user_id)', t || '_delete_own', t);
  end loop;
end $$;

alter table public.users enable row level security;
create policy users_select_own on public.users for select using (auth.uid() = id);
create policy users_insert_own on public.users for insert with check (auth.uid() = id);
create policy users_update_own on public.users for update using (auth.uid() = id) with check (auth.uid() = id);
create policy users_delete_own on public.users for delete using (auth.uid() = id);

alter table public.recipes enable row level security;
create policy recipes_read on public.recipes for select using (published or auth.uid() = owner_user_id);
create policy recipes_own_insert on public.recipes for insert with check (auth.uid() = owner_user_id);
create policy recipes_own_update on public.recipes for update using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);
create policy recipes_own_delete on public.recipes for delete using (auth.uid() = owner_user_id);

alter table public.audit_logs enable row level security;
create policy audit_read_own on public.audit_logs for select using (auth.uid() = user_id);
alter table public.science_references enable row level security;
create policy science_read_active on public.science_references for select using (active);
alter table public.admin_training_rules enable row level security;
alter table public.admin_nutrition_rules enable row level security;
create policy training_rules_read_active on public.admin_training_rules for select using (active);
create policy nutrition_rules_read_active on public.admin_nutrition_rules for select using (active);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin insert into public.users(id, display_name) values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', 'Athlete')); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- Authenticated export; service/backend can serialize this record set.
create or replace function public.export_my_profile() returns jsonb language sql stable security invoker as $$
  select jsonb_build_object(
    'user', (select to_jsonb(u) from public.users u where u.id = auth.uid()),
    'athlete_profile', (select to_jsonb(a) from public.athlete_profiles a where a.user_id = auth.uid()),
    'race_goals', coalesce((select jsonb_agg(r) from public.race_goals r where r.user_id = auth.uid()), '[]'::jsonb),
    'checkins', coalesce((select jsonb_agg(c) from public.daily_checkins c where c.user_id = auth.uid()), '[]'::jsonb)
  );
$$;
