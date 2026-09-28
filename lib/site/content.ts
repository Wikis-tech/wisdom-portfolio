import {createClient} from "@/lib/supabase/server";

export type NavigationItem={
 id:string;label:string;href:string;location:"header"|"footer";style:"link"|"cta";
 is_external:boolean;enabled:boolean;sort_order:number;
};
export type SocialLink={id:string;platform:string;label:string;url:string;username:string|null;enabled:boolean;sort_order:number};
export type SiteSettings={
 professional_name:string;brand_name:string;nav_brand_name:string;tagline:string|null;location:string|null;
 availability_enabled:boolean;availability_message:string|null;site_url:string|null;contact_email:string|null;whatsapp:string|null;
 logo_url:string|null;favicon_url:string|null;resume_url:string|null;copyright_text:string|null;footer_tagline:string;
 default_cta_label:string;default_cta_url:string;
};
export type AnalyticsSettings={
 enabled:boolean;provider:"none"|"google_analytics";measurement_id:string|null;
 external_click_tracking:boolean;conversion_tracking:boolean;
};

const fallbackSite:SiteSettings={
 professional_name:"Okoh Wisdom",
 brand_name:"Wikis Tech Corporation",
 nav_brand_name:"WIKIS TECH",
 tagline:"Software Developer · Digital Product Builder · Creative Technologist",
 location:"Lagos, NG",
 availability_enabled:true,
 availability_message:"Available for selected freelance & collaboration opportunities",
 site_url:process.env.NEXT_PUBLIC_SITE_URL||"https://wisdom-portfolio-five.vercel.app",
 contact_email:null,whatsapp:null,logo_url:null,favicon_url:null,resume_url:null,
 copyright_text:"© Okoh Wisdom / Wikis Tech",
 footer_tagline:"CODE × DESIGN × AI × STRATEGY",
 default_cta_label:"Let's Work Together",
 default_cta_url:"/contact"
};

const fallbackHeader:NavigationItem[]=[
 {id:"work",label:"Work",href:"/work",location:"header",style:"link",is_external:false,enabled:true,sort_order:10},
 {id:"about",label:"About",href:"/about",location:"header",style:"link",is_external:false,enabled:true,sort_order:20},
 {id:"lab",label:"Lab",href:"/lab",location:"header",style:"link",is_external:false,enabled:true,sort_order:30},
 {id:"services",label:"Services",href:"/services",location:"header",style:"link",is_external:false,enabled:true,sort_order:40},
 {id:"pricing",label:"Pricing",href:"/pricing",location:"header",style:"link",is_external:false,enabled:true,sort_order:50},
 {id:"contact",label:"Let's Talk",href:"/contact",location:"header",style:"cta",is_external:false,enabled:true,sort_order:60},
];

export async function getSiteSettings():Promise<SiteSettings>{
 const s=await createClient();
 const {data,error}=await s.from("site_settings").select("*").eq("singleton_key","default").maybeSingle();
 if(error||!data)return fallbackSite;
 return {...fallbackSite,...data} as SiteSettings;
}

export async function getNavigation(location:"header"|"footer"):Promise<NavigationItem[]>{
 const s=await createClient();
 const {data,error}=await s.from("navigation_items").select("id,label,href,location,style,is_external,enabled,sort_order").eq("location",location).eq("enabled",true).order("sort_order");
 if(error||!data?.length){
  if(location==="header")return fallbackHeader;
  return fallbackHeader.filter(x=>x.style==="link").slice(0,3).map((x,i)=>({...x,id:`footer-${x.id}`,location:"footer" as const,sort_order:(i+1)*10}));
 }
 return data as NavigationItem[];
}

export async function getSocialLinks():Promise<SocialLink[]>{
 const s=await createClient();
 const {data,error}=await s.from("social_links").select("id,platform,label,url,username,enabled,sort_order").eq("enabled",true).order("sort_order");
 if(error)return [];
 return (data??[]) as SocialLink[];
}

export async function getAnalyticsSettings():Promise<AnalyticsSettings>{
 const s=await createClient();
 const {data,error}=await s.from("analytics_settings").select("enabled,provider,measurement_id,external_click_tracking,conversion_tracking").eq("singleton_key","default").maybeSingle();
 if(error||!data)return {enabled:false,provider:"none",measurement_id:null,external_click_tracking:true,conversion_tracking:true};
 return data as AnalyticsSettings;
}

export function siteOrigin(site:Pick<SiteSettings,"site_url">){
 return (site.site_url||process.env.NEXT_PUBLIC_SITE_URL||"https://wisdom-portfolio-five.vercel.app").replace(/\/$/,"");
}
