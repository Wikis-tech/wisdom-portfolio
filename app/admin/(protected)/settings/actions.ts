"use server";
import {revalidatePath} from "next/cache";
import {z} from "zod";
import {requireCmsUser} from "@/lib/auth/require-cms-user";
import {createClient} from "@/lib/supabase/server";

const brandImages=["image/png","image/jpeg","image/webp","image/avif"];
function safeAssetName(name:string){const parts=name.toLowerCase().split(".");const ext=parts.length>1?parts.pop()!.replace(/[^a-z0-9]/g,""):"png";const base=parts.join(".").replace(/[^a-z0-9-_]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"brand";return `${base}.${ext}`}
async function uploadBrandAsset(fd:FormData,kind:"logo"|"favicon"){
 const user=await requireCmsUser();
 const file=fd.get("file");
 if(!(file instanceof File)||file.size<=0)throw new Error("Choose an image to upload.");
 if(!brandImages.includes(file.type))throw new Error("Use PNG, JPG, WebP or AVIF.");
 const max=kind==="favicon"?1024*1024:3*1024*1024;
 if(file.size>max)throw new Error(kind==="favicon"?"Favicon must be 1 MB or smaller.":"Logo must be 3 MB or smaller.");
 const s=await createClient();
 const path=`brand/${kind}/${user.id}/${crypto.randomUUID()}-${safeAssetName(file.name)}`;
 const {error:uploadError}=await s.storage.from("portfolio-public").upload(path,file,{contentType:file.type,upsert:false});
 if(uploadError)throw new Error("Could not upload the image.");
 const publicUrl=s.storage.from("portfolio-public").getPublicUrl(path).data.publicUrl;
 const column=kind==="logo"?"logo_url":"favicon_url";
 const {error:updateError}=await s.from("site_settings").update({[column]:publicUrl,updated_at:new Date().toISOString()}).eq("singleton_key","default");
 if(updateError){await s.storage.from("portfolio-public").remove([path]);throw new Error("The image uploaded, but site settings could not be updated.");}
 await s.from("activity_logs").insert({user_id:user.id,action:kind==="logo"?"Site logo updated":"Site favicon updated",entity_type:"site_settings",metadata:{kind}});
 refreshSite();
 return publicUrl;
}


const optionalHttps=z.union([z.literal(""),z.string().url().refine(v=>v.startsWith("https://"),"HTTPS required")]);
const siteSchema=z.object({
 professionalName:z.string().trim().min(2).max(120),
 brandName:z.string().trim().min(2).max(120),
 navBrandName:z.string().trim().min(1).max(40),
 tagline:z.string().trim().max(220),
 location:z.string().trim().max(120),
 availabilityMessage:z.string().trim().max(220),
 siteUrl:z.string().url().refine(v=>v.startsWith("https://")),
 contactEmail:z.union([z.literal(""),z.string().email().max(254)]),
 whatsapp:z.string().trim().max(40),
 logoUrl:optionalHttps,faviconUrl:optionalHttps,resumeUrl:optionalHttps,
 copyrightText:z.string().trim().max(160),
 footerTagline:z.string().trim().min(1).max(120),
 defaultCtaLabel:z.string().trim().min(1).max(80),
 defaultCtaUrl:z.string().trim().min(1).max(500),
 availabilityEnabled:z.boolean(),
});
const socialSchema=z.object({platform:z.string().trim().min(1).max(50),label:z.string().trim().min(1).max(80),url:z.string().url().refine(v=>v.startsWith("https://")),username:z.string().trim().max(100),sortOrder:z.coerce.number().int().min(-10000).max(10000),enabled:z.boolean()});

function refreshSite(){
 for(const path of ["/","/work","/about","/archive","/lab","/services","/pricing","/contact","/quote","/sitemap.xml","/robots.txt","/admin/settings"])revalidatePath(path);
}
export async function saveSiteSettings(fd:FormData){
 const user=await requireCmsUser(),s=await createClient();
 const p=siteSchema.safeParse({
  professionalName:fd.get("professionalName"),brandName:fd.get("brandName"),navBrandName:fd.get("navBrandName"),tagline:String(fd.get("tagline")??""),location:String(fd.get("location")??""),
  availabilityMessage:String(fd.get("availabilityMessage")??""),siteUrl:fd.get("siteUrl"),contactEmail:String(fd.get("contactEmail")??""),whatsapp:String(fd.get("whatsapp")??""),
  logoUrl:String(fd.get("logoUrl")??""),faviconUrl:String(fd.get("faviconUrl")??""),resumeUrl:String(fd.get("resumeUrl")??""),copyrightText:String(fd.get("copyrightText")??""),
  footerTagline:fd.get("footerTagline"),defaultCtaLabel:fd.get("defaultCtaLabel"),defaultCtaUrl:fd.get("defaultCtaUrl"),availabilityEnabled:fd.get("availabilityEnabled")==="on",
 });
 if(!p.success)throw new Error("Site settings are invalid.");
 const v=p.data;
 const externalCta=v.defaultCtaUrl.startsWith("http");
 if(externalCta&&!v.defaultCtaUrl.startsWith("https://"))throw new Error("External CTA URLs must use HTTPS.");
 if(!externalCta&&!v.defaultCtaUrl.startsWith("/"))throw new Error("Internal CTA URLs must start with /.");
 const {error}=await s.from("site_settings").update({
  professional_name:v.professionalName,brand_name:v.brandName,nav_brand_name:v.navBrandName,tagline:v.tagline||null,location:v.location||null,
  availability_enabled:v.availabilityEnabled,availability_message:v.availabilityMessage||null,site_url:v.siteUrl,contact_email:v.contactEmail||null,whatsapp:v.whatsapp||null,
  logo_url:v.logoUrl||null,favicon_url:v.faviconUrl||null,resume_url:v.resumeUrl||null,copyright_text:v.copyrightText||null,footer_tagline:v.footerTagline,
  default_cta_label:v.defaultCtaLabel,default_cta_url:v.defaultCtaUrl,updated_at:new Date().toISOString()
 }).eq("singleton_key","default");
 if(error)throw new Error("Could not save site settings.");
 await s.from("activity_logs").insert({user_id:user.id,action:"Global site settings updated",entity_type:"site_settings"});
 refreshSite();
}
function parseSocial(fd:FormData){
 const p=socialSchema.safeParse({platform:fd.get("platform"),label:fd.get("label"),url:fd.get("url"),username:String(fd.get("username")??""),sortOrder:Number(fd.get("sortOrder")||0),enabled:fd.get("enabled")==="on"});
 if(!p.success)throw new Error("Social link is invalid.");return p.data;
}
export async function createSocial(fd:FormData){
 const user=await requireCmsUser(),s=await createClient(),v=parseSocial(fd);
 const {error}=await s.from("social_links").insert({platform:v.platform,label:v.label,url:v.url,username:v.username||null,enabled:v.enabled,sort_order:v.sortOrder,created_by:user.id,updated_by:user.id});
 if(error)throw new Error(error.code==="23505"?"That social link already exists.":"Could not add social link.");
 await s.from("activity_logs").insert({user_id:user.id,action:"Social link created",entity_type:"social"});
 refreshSite();
}
export async function saveSocial(fd:FormData){
 const user=await requireCmsUser(),s=await createClient(),v=parseSocial(fd),id=String(fd.get("id"));
 const {error}=await s.from("social_links").update({platform:v.platform,label:v.label,url:v.url,username:v.username||null,enabled:v.enabled,sort_order:v.sortOrder,updated_by:user.id,updated_at:new Date().toISOString()}).eq("id",id);
 if(error)throw new Error("Could not save social link.");
 await s.from("activity_logs").insert({user_id:user.id,action:"Social link updated",entity_type:"social",entity_id:id});
 refreshSite();
}
export async function deleteSocial(fd:FormData){
 const user=await requireCmsUser(),s=await createClient(),id=String(fd.get("id"));
 const {error}=await s.from("social_links").delete().eq("id",id);if(error)throw new Error("Could not delete social link.");
 await s.from("activity_logs").insert({user_id:user.id,action:"Social link deleted",entity_type:"social",entity_id:id});refreshSite();
}
export async function saveAnalytics(fd:FormData){
 const user=await requireCmsUser(),s=await createClient();
 const provider=String(fd.get("provider")??"none");
 if(!["none","google_analytics"].includes(provider))throw new Error("Unsupported analytics provider.");
 const enabled=fd.get("enabled")==="on";
 const measurement=String(fd.get("measurementId")??"").trim().toUpperCase();
 if(provider==="google_analytics"&&enabled&&!/^G-[A-Z0-9]+$/.test(measurement))throw new Error("Enter a valid Google Analytics measurement ID (G-...).");
 const {error}=await s.from("analytics_settings").update({enabled,provider,measurement_id:provider==="none"?null:(measurement||null),external_click_tracking:fd.get("externalClicks")==="on",conversion_tracking:fd.get("conversions")==="on",updated_at:new Date().toISOString()}).eq("singleton_key","default");
 if(error)throw new Error("Could not save analytics settings.");
 await s.from("activity_logs").insert({user_id:user.id,action:"Analytics configuration updated",entity_type:"analytics",metadata:{enabled,provider}});
 refreshSite();
}


export async function uploadLogo(fd:FormData){
 await uploadBrandAsset(fd,"logo");
}
export async function uploadFavicon(fd:FormData){
 await uploadBrandAsset(fd,"favicon");
}
