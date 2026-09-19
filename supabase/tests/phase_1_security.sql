select relname, relrowsecurity from pg_class where relname in ('profiles','site_settings');
select grantee, table_name, privilege_type from information_schema.role_table_grants where table_schema='public' and table_name in ('profiles','site_settings') order by table_name, grantee, privilege_type;
