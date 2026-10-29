# Admin Stability Test Checklist

Use this checklist on the latest Admin stability deployment before merging into Phase 9B.

## 1. Authentication and access
- [ ] Signed-out visit to /admin redirects to /admin/login.
- [ ] Correct admin credentials open the Dashboard.
- [ ] Refreshing /admin keeps the session.
- [ ] Sign out returns to /admin/login.
- [ ] Incognito visit to any /admin/* protected route is denied.

## 2. Dashboard and navigation
- [ ] Dashboard loads without a recovery screen.
- [ ] Everyday navigation is visible: Dashboard, Websites & Apps, Graphic Designs, Edit Homepage, About Me, Work Experience, Services, Messages, Media Library, Site Settings.
- [ ] More Tools expands and contains Lab, Pricing, Now, Skills, Technologies, Testimonials, Navigation, SEO, Quote Requests and Trash.
- [ ] Mobile Menu opens, closes and navigates correctly.

## 3. Websites & Apps
- [ ] Add Website/App asks only for project name, optional live link and short description.
- [ ] Invalid URL shows a readable inline error instead of the recovery page.
- [ ] Creating a project creates a Private draft.
- [ ] Project editor opens with Basics visible and optional Case Study/Advanced sections collapsed.
- [ ] Save draft returns a visible success message.
- [ ] Preview works.
- [ ] Upload a preview image larger than 1 MB but smaller than 8 MB; upload must succeed.
- [ ] Upload a hero image; upload must succeed.
- [ ] Set Visibility = Public and click Save & Publish.
- [ ] Project appears on /work.
- [ ] If Featured is enabled, project is prioritized on the homepage.
- [ ] Change a published project without republishing; public snapshot should remain unchanged.
- [ ] Set Visibility = Private and Save & Publish; project must disappear from public listings.
- [ ] Move to Trash asks for confirmation and removes it from public listings.

## 4. Graphic Designs
- [ ] Create a design with an image from the computer.
- [ ] Upload image larger than 1 MB; it should upload directly to Supabase Storage.
- [ ] Required-field errors appear in the form, not as a full recovery page.
- [ ] Public design appears in the Design Archive.
- [ ] Delete/Trash behavior works as expected.

## 5. Media Library
- [ ] Upload JPG/PNG/WebP/AVIF larger than 1 MB within the configured limit.
- [ ] Media appears after upload.
- [ ] Invalid type/oversized file gives a friendly inline error.
- [ ] Public assets can render publicly.
- [ ] Private assets are not anonymously accessible.

## 6. Homepage
- [ ] Homepage editor loads.
- [ ] Change supporting copy and save.
- [ ] Public homepage reflects the saved change after refresh.
- [ ] Invalid input returns a readable admin message instead of a recovery screen.

## 7. About / Experience
- [ ] About page loads in Admin.
- [ ] Save headline/introduction/biography.
- [ ] Public About page reflects saved data.
- [ ] Experience list loads and can be edited without recovery errors.

## 8. Services
- [ ] Add Service asks only for name, short description and optional NGN starting price.
- [ ] Duplicate/invalid service data shows an inline error.
- [ ] New service appears in the Admin list.
- [ ] Edit Service keeps advanced fields collapsed.
- [ ] Toggle public visibility and save.
- [ ] Public /services reflects enabled services.
- [ ] Move to Trash asks for confirmation.

## 9. Site Settings
- [ ] Logo upload succeeds without pasting a URL.
- [ ] Favicon upload succeeds.
- [ ] Basic information saves.
- [ ] Public navigation/logo/footer reflect the changes.
- [ ] Social Profiles and Analytics remain optional/collapsed.
- [ ] Invalid URL/email shows a readable message on the same screen.

## 10. Security checks
- [ ] No service-role/secret key appears in browser source or NEXT_PUBLIC variables.
- [ ] Signed-out users cannot access protected Admin content.
- [ ] Private projects do not appear in project_publications.
- [ ] Trashed projects do not appear in project_publications.
- [ ] Public project preview/hero images contain no confidential content.
- [ ] Confidential documents use the private Media bucket.
- [ ] Supabase Security Advisor is reviewed before launch.

## 11. Public regression smoke test
Check desktop and mobile:
- [ ] /
- [ ] /work
- [ ] /about
- [ ] /lab
- [ ] /services
- [ ] /pricing
- [ ] /contact
- [ ] /quote
- [ ] navigation
- [ ] theme toggle
- [ ] loading UI
- [ ] footer

No page should show a recovery screen, invisible content, horizontal overflow or broken loading state.
