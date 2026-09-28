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
 const staticRows=(pages??[]).map(x=>({url:`${origin}${x.route_path}`,lastModified:x.updated_at?new Date(x.updated_at):new Date(),changeFrequency:x.route_path==="/"?"weekly":"monthly" as const,priority:x.route_path==="/"?.9:.7}));
 const projectRows=(projects??[]).map(x=>({url:`${origin}/work/${x.slug}`,lastModified:x.updated_at?new Date(x.updated_at):new Date(),changeFrequency:"monthly" as const,priority:.8}));
 const experimentRows=(experiments??[]).map(x=>({url:`${origin}/lab/${x.slug}`,lastModified:x.updated_at?new Date(x.updated_at):new Date(),changeFrequency:"monthly" as const,priority:.6}));
 return [...staticRows,...projectRows,...experimentRows];
}
