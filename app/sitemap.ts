import type {MetadataRoute} from "next";
import {createClient} from "@/lib/supabase/server";
import {getSiteSettings,siteOrigin} from "@/lib/site/content";

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const s=await createClient();
 const [site,{data:pages},{data:projects},{data:experiments}]=await Promise.all([
  getSiteSettings(),
  s.from("seo_settings").select("route_path,noindex,updated_at").eq("noindex",false),
  s.from("project_publications").select("slug,updated_at"),
  s.from("experiments").select("slug,updated_at").eq("visibility","public").is("deleted_at",null)
 ]);
 const origin=siteOrigin(site);
 const staticRows:MetadataRoute.Sitemap=(pages??[]).map(x=>({
  url:`${origin}${x.route_path}`,
  lastModified:x.updated_at?new Date(x.updated_at):new Date(),
  changeFrequency:x.route_path==="home"?"weekly":"monthly",
  priority:x.route_path==="/"?.9:.7,
 }));
 const projectRows:MetadataRoute.Sitemap=(projects??[]).map(x=>({
  url:`${origin}/work/${x.slug}`,
  lastModified:x.updated_at?new Date(x.updated_at):new Date(),
  changeFrequency:"monthly",
  priority:.8,
 }));
 const experimentRows:MetadataRoute.Sitemap=(experiments??[]).map(x=>({
  url:`${origin}/lab/${x.slug}`,
  lastModified:x.updated_at?new Date(x.updated_at):new Date(),
  changeFrequency:"monthly",
  priority:.6,
 }));
 return [...staticRows,...projectRows,...experimentRows];
}
