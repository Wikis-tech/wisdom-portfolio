import type {MetadataRoute} from "next";
import {getSiteSettings,siteOrigin} from "@/lib/site/content";

export default async function robots():Promise<MetadataRoute.Robots>{
 const site=await getSiteSettings();
 const origin=siteOrigin(site);
 return {
  rules:[{userAgent:"*",allow:"/",disallow:["/admin/","/admin","/quote"]}],
  sitemap:`${origin}/sitemap.xml`,
  host:origin,
 };
}
