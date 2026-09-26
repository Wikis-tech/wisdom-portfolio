-- Phase 7 hardening: positioning and problem-first case-study model.

alter table public.projects
  add column if not exists problem text,
  add column if not exists solution text,
  add column if not exists why_it_mattered text,
  add column if not exists outcome text;

alter table public.projects
  drop constraint if exists projects_problem_length,
  add constraint projects_problem_length check (problem is null or char_length(problem) <= 4000),
  drop constraint if exists projects_solution_length,
  add constraint projects_solution_length check (solution is null or char_length(solution) <= 4000),
  drop constraint if exists projects_why_it_mattered_length,
  add constraint projects_why_it_mattered_length check (why_it_mattered is null or char_length(why_it_mattered) <= 4000),
  drop constraint if exists projects_outcome_length,
  add constraint projects_outcome_length check (outcome is null or char_length(outcome) <= 4000);

update public.hero_settings
set eyebrow='OKOH WISDOM / WIKIS TECH',
    headline_line_1='I BUILD WEBSITES &',
    headline_line_2='DIGITAL PRODUCTS THAT',
    supporting_text='I turn ideas and business problems into useful websites, digital products and intelligent tools — combining software, design, AI and strategy.',
    rotating_words='["WORK.","CONNECT.","CONVERT.","SCALE.","MOVE."]'::jsonb,
    primary_cta_label='View Selected Work ↓',
    primary_cta_url='#work',
    secondary_cta_label='Let''s Work Together ↗',
    secondary_cta_url='/contact',
    updated_at=now()
where singleton_key='default';
