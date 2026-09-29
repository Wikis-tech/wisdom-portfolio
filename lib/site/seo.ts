import type {Metadata} from "next";
import {createClient} from "@/lib/supabase/server";
import {getSiteSettings,siteOrigin} from "@/lib/site/content";

type Fallback={title:string;description:string;path:string;image?:string|null;noindex?:boolean};

export async function getPageMetadata(pageKey:string,fallback:Fallback):Promise<Metadata>{
 const s=await createClient();
 const [{data:seo},site]=await Promise.all([
  s.from("seo_settings").select("title,description,og_image_url,canonical_url,noindex,route_path").eq("page_key",pageKey).maybeSingle(),
  getSiteSettings()
 ]);
 const title=seo?.title||fallback.title;
 const description=seo?.description||fallback.description;
 const origin=siteOrigin(site);
 const path=seo?.route_path||fallback.path;
 const canonical=seo?.canonical_url||`${origin}${path.startsWith("/")?path:`/${path}`}`;
 const image=seo?.og_image_url||fallback.image||undefined;
 const noindex=seo?.noindex??fallback.noindex??false;
 return {
  title,description,
  alternates:{canonical},
  robots:{index:!noindex,follow:!noindex},
  openGraph:{type:"website",url:canonical,title,description,siteName:site.brand_name,images:image?[{url:image}]:undefined},
  twitter:{card:image?"summary_large_image":"summary",title,description,images:image?[image]:undefined},
 };
}

export function entityMetadata(args:{title:string;description:string;path:string;image?:string|null;noindex?:boolean;siteName?:string;origin:string}):Metadata{
 const canonical=`${args.origin.replace(/\/$/,"")}${args.path}`;
 return {
  title:args.title,description:args.description,
  alternates:{canonical},
  robots:{index:!args.noindex,follow:!args.noindex},
  openGraph:{type:"article",url:canonical,title:args.title,description:args.description,siteName:args.siteName,images:args.image?[{url:args.image}]:undefined},
  twitter:{card:args.image?"summary_large_image":"summary",title:args.title,description:args.description,images:args.image?[args.image]:undefined},
 };
}
