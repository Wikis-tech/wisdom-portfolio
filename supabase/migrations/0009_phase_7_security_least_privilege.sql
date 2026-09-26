-- Phase 1-7 hardening: least-privilege table grants.

revoke insert, update, delete, truncate, references, trigger
on all tables in schema public from anon;

revoke truncate, references, trigger
on all tables in schema public from authenticated;

alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;
