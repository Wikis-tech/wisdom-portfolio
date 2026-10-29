"use server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {z} from "zod";
import {requireCmsUser} from "@/lib/auth/require-cms-user";
import {createClient} from "@/lib/supabase/server";

const brandImages=["image/png","image/jpeg","image/webp","image/avif"];
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
 logoUrl:optionalHttps,
 faviconUrl:optionalHttps,
 resumeUrl:optionalHttps,
 copyrightText:z.string().trim().max(160),
 footerTagline:z.string().trim().min(1).max(120),
 defaultCtaLabel:z.string().trim().min(1).max(80),
 defaultCtaUrl:z.string().trim().min(1).max(500),
 availabilityEnabled:z.boolean(),
});
const socialSchema=z.object({
 platform:z.string().trim().min(1).max(50),
 label:z.string().trim().min(1).max(80),
 url:z.string().url().refine(v=>v.startsWith("https://")),
 username:z.string().trim().max(100),
 sortOrder:z.coerce.number().int().min(-10000).max(10000),
 enabled:z.boolean()
});

function refreshSite(){
 for(const path of ["/","/work","/about","/archive","/lab","/services","/pricing","/contact","/quote","/sitemap.xml","/robots.txt","/admin/settings"])revalidatePath(path);
}
function errorUrl(message:string){return `/admin/settings?error=${encodeURIComponent(message)}`}

export async function saveSiteSettings(fd:FormData){
 const user=await requireCmsUser();
 const p=siteSchema.safeParse({
  professionalName:fd.get("professionalName"),
  brandName:fd.get("brandName"),
  navBrandName:fd.get("navBrandName"),
  tagline:String(fd.get("tagline")??""),
  location:String(fd.get("location")??""),
  availabilityMessage:String(fd.get("availabilityMessage")??""),
  siteUrl:fd.get("siteUrl"),
  contactEmail:String(fd.get("contactEmail")??""),
  whatsapp:String(fd.get("whatsapp")??""),
  logoUrl:String(fd.get("logoUrl")??""),
  faviconUrl:String(fd.get("faviconUrl")??""),
  resumeUrl:String(fd.get("resumeUrl")??""),
  copyrightText:String(fd.get("copyrightText")??""),
  footerTagline:fd.get("footerTagline"),
  defaultCtaLabel:fd.get("defaultCtaLabel"),
  defaultCtaUrl:fd.get("defaultCtaUrl"),
  availabilityEnabled:fd.get("availabilityEnabled")==="on",
 });
 if(!p.success)redirect(errorUrl(p.error.issues[0]?.message||"Please review the website details."));
 const v=p.data;
 const externalCta=v.defaultCtaUrl.startsWith("http");
 if(externalCta&&!v.defaultCtaUrl.startsWith("https://"))redirect(errorUrl("External button links must use HTTPS."));
 if(!externalCta&&!v.defaultCtaUrl.startsWith("/"))redirect(errorUrl("Internal button links must start with /."));

 const s=await createClient();
 const {data,error}=await s.from("site_settings").update({
  professional_name:v.professionalName,brand_name:v.brandName,nav_brand_name:v.navBrandName,tagline:v.tagline||null,location:v.location||null,
  availability_enabled:v.availabilityEnabled,availability_message:v.availabilityMessage||null,site_url:v.siteUrl,contact_email:v.contactEmail||null,whatsapp:v.whatsapp||null,
  logo_url:v.logoUrl||null,favicon_url:v.faviconUrl||null,resume_url:v.resumeUrl||null,copyright_text:v.copyrightText||null,footer_tagline:v.footerTagline,
  default_cta_label:v.defaultCtaLabel,default_cta_url:v.defaultCtaUrl,updated_at:new Date().toISOString()
 }).eq("singleton_key","default").select("singleton_key").maybeSingle();
 if(error||!data)redirect(errorUrl("Could not save Site Settings. Please try again."));
 await s.from("activity_logs").insert({user_id:user.id,action:"Global site settings updated",entity_type:"site_settings"});
 refreshSite();
 redirect("/admin/settings?saved=1");
}

function parseSocial(fd:FormData){
 return socialSchema.safeParse({
  platform:fd.get("platform"),label:fd.get("label"),url:fd.get("url"),
  username:String(fd.get("username")??""),sortOrder:Number(fd.get("sortOrder")||0),enabled:fd.get("enabled")==="on"
 });
}

export async function createSocial(fd:FormData){
 const user=await requireCmsUser();
 const parsed=parseSocial(fd);
 if(!parsed.success)redirect(errorUrl(parsed.error.issues[0]?.message||"Please review the social link."));
 const s=await createClient(),v=parsed.data;
 const {error}=await s.from("social_links").insert({platform:v.platform,label:v.label,url:v.url,username:v.username||null,enabled:v.enabled,sort_order:v.sortOrder,created_by:user.id,updated_by:user.id});
 if(error)redirect(errorUrl(error.code==="23505"?"That social link already exists.":"Could not add the social link."));
 await s.from("activity_logs").insert({user_id:user.id,action:"Social link created",entity_type:"social"});
 refreshSite();
 redirect("/admin/settings?saved=1");
}

export async function saveSocial(fd:FormData){
 const user=await requireCmsUser();
 const parsed=parseSocial(fd);
 if(!parsed.success)redirect(errorUrl(parsed.error.issues[0]?.message||"Please review the social link."));
 const id=String(fd.get("id")??"");
 const s=await createClient(),v=parsed.data;
 const {data,error}=await s.from("social_links").update({platform:v.platform,label:v.label,url:v.url,username:v.username||null,enabled:v.enabled,sort_order:v.sortOrder,updated_by:user.id,updated_at:new Date().toISOString()}).eq("id",id).select("id").maybeSingle();
 if(error||!data)redirect(errorUrl("Could not save the social link."));
 await s.from("activity_logs").insert({user_id:user.id,action:"Social link updated",entity_type:"social",entity_id:id});
 refreshSite();
 redirect("/admin/settings?saved=1");
}

export async function deleteSocial(fd:FormData){
 const user=await requireCmsUser();
 const id=String(fd.get("id")??"");
 const s=await createClient();
 const {error}=await s.from("social_links").delete().eq("id",id);
 if(error)redirect(errorUrl("Could not delete the social link."));
 await s.from("activity_logs").insert({user_id:user.id,action:"Social link deleted",entity_type:"social",entity_id:id});
 refreshSite();
 redirect("/admin/settings?saved=1");
}

export async function saveAnalytics(fd:FormData){
 const user=await requireCmsUser();
 const provider=String(fd.get("provider")??"none");
 if(!["none","google_analytics"].includes(provider))redirect(errorUrl("Unsupported analytics provider."));
 const enabled=fd.get("enabled")==="on";
 const measurement=String(fd.get("measurementId")??"").trim().toUpperCase();
 if(provider==="google_analytics"&&enabled&&!/^G-[A-Z0-9]+$/.test(measurement))redirect(errorUrl("Enter a valid Google Analytics measurement ID (G-...)."));
 const s=await createClient();
 const {error}=await s.from("analytics_settings").update({
  enabled,provider,measurement_id:provider==="none"?null:(measurement||null),
  external_click_tracking:fd.get("externalClicks")==="on",conversion_tracking:fd.get("conversions")==="on",updated_at:new Date().toISOString()
 }).eq("singleton_key","default");
 if(error)redirect(errorUrl("Could not save analytics settings."));
 await s.from("activity_logs").insert({user_id:user.id,action:"Analytics configuration updated",entity_type:"analytics",metadata:{enabled,provider}});
 refreshSite();
 redirect("/admin/settings?saved=1");
}

export async function finalizeBrandAssetUpload(fd:FormData){
 const user=await requireCmsUser();
 const kind=String(fd.get("kind")??"");
 const path=String(fd.get("path")??"");
 const mimeType=String(fd.get("mimeType")??"");
 const byteSize=Number(fd.get("byteSize")||0);
 if(!["logo","favicon"].includes(kind))return {ok:false,message:"Unknown brand image type."};
 if(!brandImages.includes(mimeType))return {ok:false,message:"Use PNG, JPG, WebP or AVIF."};
 const max=kind==="favicon"?1024*1024:3*1024*1024;
 if(!Number.isFinite(byteSize)||byteSize<=0||byteSize>max)return {ok:false,message:kind==="favicon"?"Favicon must be 1 MB or smaller.":"Logo must be 3 MB or smaller."};
 const prefix=`brand/${kind}/${user.id}/`;
 if(!path.startsWith(prefix))return {ok:false,message:"That upload path is not valid for this admin session."};

 const s=await createClient();
 const folder=path.slice(0,path.lastIndexOf("/"));
 const filename=path.slice(path.lastIndexOf("/")+1);
 const {data:objects,error:listError}=await s.storage.from("portfolio-public").list(folder,{search:filename,limit:5});
 if(listError||!objects?.some(x=>x.name===filename))return {ok:false,message:"Uploaded image could not be verified."};

 const publicUrl=s.storage.from("portfolio-public").getPublicUrl(path).data.publicUrl;
 const column=kind==="logo"?"logo_url":"favicon_url";
 const {data:updated,error:updateError}=await s.from("site_settings").update({[column]:publicUrl,updated_at:new Date().toISOString()}).eq("singleton_key","default").select("singleton_key").maybeSingle();
 if(updateError||!updated)return {ok:false,message:"The image uploaded, but Site Settings could not be updated."};

 await s.from("activity_logs").insert({user_id:user.id,action:kind==="logo"?"Site logo updated":"Site favicon updated",entity_type:"site_settings",metadata:{kind,path}});
 refreshSite();
 return {ok:true,url:publicUrl};
}
