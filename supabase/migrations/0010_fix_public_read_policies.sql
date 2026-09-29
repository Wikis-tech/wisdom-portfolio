-- Fix anonymous public-read policies that referenced private.is_cms_user().
-- Anonymous users do not have EXECUTE on private.is_cms_user(), so those policies
-- could raise permission errors and make public CMS content appear empty.
-- Authenticated CMS users continue to see drafts/private rows through the existing
-- authenticated CMS policies; these public policies now describe public visibility only.

alter policy "about_public_read" on public.about_profile
  using (is_published = true);

alter policy "design_categories_public_read" on public.design_categories
  using (is_visible = true);

alter policy "design_media_public_read" on public.design_media
  using (
    exists (
      select 1 from public.designs d
      where d.id = design_media.design_id
        and d.visibility = 'public'
        and d.deleted_at is null
    )
  );

alter policy "designs_public_read" on public.designs
  using (visibility = 'public' and deleted_at is null);

alter policy "education_public_read" on public.education
  using (is_visible = true);

alter policy "experience_public_read" on public.experiences
  using (is_visible = true);

alter policy "experiments_public_read" on public.experiments
  using (visibility = 'public' and deleted_at is null);

alter policy "journey_public_read" on public.journey_items
  using (is_visible = true);

alter policy "now_public_read" on public.now_items
  using (visible = true);

alter policy "sections_public_read" on public.page_sections
  using (enabled = true);

alter policy "pricing_packages_public_read" on public.pricing_packages
  using (visibility = true and deleted_at is null);

alter policy "categories_public_read" on public.project_categories
  using (is_visible = true);

alter policy "project_category_links_public_read" on public.project_category_links
  using (
    exists (
      select 1
      from public.projects p
      join public.project_categories c on c.id = project_category_links.category_id
      where p.id = project_category_links.project_id
        and p.content_state = 'published'
        and p.visibility = 'public'
        and p.deleted_at is null
        and p.archived_at is null
        and c.is_visible = true
    )
  );

alter policy "service_pricing_links_public_read" on public.service_pricing_links
  using (
    exists (
      select 1 from public.services s
      where s.id = service_pricing_links.service_id
        and s.enabled = true
        and s.deleted_at is null
    )
    and exists (
      select 1 from public.pricing_packages p
      where p.id = service_pricing_links.pricing_package_id
        and p.visibility = true
        and p.deleted_at is null
    )
  );

alter policy "services_public_read" on public.services
  using (enabled = true and deleted_at is null);

alter policy "skills_public_read" on public.skills
  using (is_visible = true);

alter policy "technologies_public_read" on public.technologies
  using (is_visible = true);

alter policy "testimonials_public_read" on public.testimonials
  using (visibility = true and deleted_at is null);
