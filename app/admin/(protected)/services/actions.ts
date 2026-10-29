"use server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {requireCmsUser} from "@/lib/auth/require-cms-user";
import {createClient} from "@/lib/supabase/server";
import {serviceInput} from "@/features/phase6/validation";

function serviceUrl(id:string|null,message?:string,saved?:boolean){
 const base=id?`/admin/services/${id}`:"/admin/services";
 if(message)return `${base}?error=${encodeURIComponent(message)}`;
 if(saved)return `${base}?saved=1`;
 return base;
}
function parse(fd:FormData){
 return serviceInput.safeParse({
  title:String(fd.get("title")??""),
  slug:String(fd.get("slug")??""),
  shortDescription:String(fd.get("shortDescription")??""),
  fullDescription:String(fd.get("fullDescription")??""),
  icon:String(fd.get("icon")??""),
  imageUrl:String(fd.get("imageUrl")??""),
  startingPrice:fd.get("startingPrice")?Number(fd.get("startingPrice")):null,
  currency:String(fd.get("currency")??"NGN").toUpperCase(),
  ctaLabel:String(fd.get("ctaLabel")??"Let's talk ↗"),
  ctaUrl:String(fd.get("ctaUrl")??"/contact"),
  featured:fd.get("featured")==="on",
  enabled:fd.get("enabled")==="on",
  sortOrder:Number(fd.get("sortOrder")||0)
 });
}
function refresh(){
 for(const p of ["/","/services","/pricing","/admin/services"])revalidatePath(p);
}

export async function createQuickService(fd:FormData){
 const user=await requireCmsUser();
 const title=String(fd.get("title")??"").trim();
 const description=String(fd.get("shortDescription")??"").trim();
 const priceRaw=String(fd.get("startingPrice")??"").trim();
 if(title.length<2||title.length>120)redirect(serviceUrl(null,"Enter a service name between 2 and 120 characters."));
 if(description.length<5||description.length>500)redirect(serviceUrl(null,"Add a short description between 5 and 500 characters."));
 const startingPrice=priceRaw?Number(priceRaw):null;
 if(startingPrice!==null&&(!Number.isFinite(startingPrice)||startingPrice<0))redirect(serviceUrl(null,"Starting price must be zero or more."));

 const base=title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
 if(!base)redirect(serviceUrl(null,"The service name must include letters or numbers."));
 const s=await createClient();
 const {data:existing,error:slugError}=await s.from("services").select("slug").like("slug",base+"%").limit(100);
 if(slugError)redirect(serviceUrl(null,"Could not prepare a unique service link."));
 const used=new Set((existing??[]).map(x=>x.slug));
 let slug=base;
 for(let n=2;used.has(slug)&&n<=101;n++)slug=`${base}-${n}`;
 if(used.has(slug))redirect(serviceUrl(null,"Too many services have the same name."));

 const {data:last}=await s.from("services").select("sort_order").is("deleted_at",null).order("sort_order",{ascending:false}).limit(1).maybeSingle();
 const {data,error}=await s.from("services").insert({
  title,slug,short_description:description,full_description:null,icon:null,featured_image_url:null,
  starting_price:startingPrice,currency:"NGN",cta_label:"Let's talk ↗",cta_url:"/contact",
  featured:false,enabled:true,sort_order:(last?.sort_order??0)+10,created_by:user.id,updated_by:user.id
 }).select("id").single();
 if(error)redirect(serviceUrl(null,error.code==="23505"?"That service already exists.":"Could not create the service."));
 await s.from("activity_logs").insert({user_id:user.id,action:"Service created",entity_type:"service",entity_id:data.id});
 refresh();
 redirect(serviceUrl(data.id,undefined,true));
}

export async function createService(fd:FormData){
 const user=await requireCmsUser();
 const parsed=parse(fd);
 if(!parsed.success)redirect(serviceUrl(null,parsed.error.issues[0]?.message||"Please review the service fields."));
 const v=parsed.data,s=await createClient();
 const {data,error}=await s.from("services").insert({
  title:v.title,slug:v.slug,short_description:v.shortDescription,full_description:v.fullDescription||null,icon:v.icon||null,
  featured_image_url:v.imageUrl||null,starting_price:v.startingPrice,currency:v.currency,cta_label:v.ctaLabel,cta_url:v.ctaUrl,
  featured:v.featured,enabled:v.enabled,sort_order:v.sortOrder,created_by:user.id,updated_by:user.id
 }).select("id").single();
 if(error)redirect(serviceUrl(null,error.code==="23505"?"That service URL already exists.":"Could not create the service."));
 await s.from("activity_logs").insert({user_id:user.id,action:"Service created",entity_type:"service",entity_id:data.id});
 refresh();
 redirect(serviceUrl(data.id,undefined,true));
}

export async function saveService(fd:FormData){
 const user=await requireCmsUser();
 const id=String(fd.get("id")??"");
 const parsed=parse(fd);
 if(!parsed.success)redirect(serviceUrl(id,parsed.error.issues[0]?.message||"Please review the service fields."));
 const v=parsed.data,s=await createClient();

 const {data,error}=await s.from("services").update({
  title:v.title,slug:v.slug,short_description:v.shortDescription,full_description:v.fullDescription||null,icon:v.icon||null,
  featured_image_url:v.imageUrl||null,starting_price:v.startingPrice,currency:v.currency,cta_label:v.ctaLabel,cta_url:v.ctaUrl,
  featured:v.featured,enabled:v.enabled,sort_order:v.sortOrder,updated_by:user.id,updated_at:new Date().toISOString()
 }).eq("id",id).is("deleted_at",null).select("id").maybeSingle();
 if(error||!data)redirect(serviceUrl(id,error?.code==="23505"?"Another service already uses that URL.":"Could not save this service."));

 const {error:deleteError}=await s.from("service_pricing_links").delete().eq("service_id",id);
 if(deleteError)redirect(serviceUrl(id,"Service saved, but pricing links could not be refreshed."));
 const packageIds=fd.getAll("packageIds").map(String).filter(Boolean).slice(0,50);
 if(packageIds.length){
  const {error:linkError}=await s.from("service_pricing_links").insert(packageIds.map(pricing_package_id=>({service_id:id,pricing_package_id})));
  if(linkError)redirect(serviceUrl(id,"Service saved, but pricing packages could not be linked."));
 }
 await s.from("activity_logs").insert({user_id:user.id,action:"Service updated",entity_type:"service",entity_id:id});
 refresh();revalidatePath(`/admin/services/${id}`);
 redirect(serviceUrl(id,undefined,true));
}

export async function trashService(fd:FormData){
 const user=await requireCmsUser();
 const s=await createClient(),id=String(fd.get("id")??"");
 const {data,error}=await s.from("services").update({deleted_at:new Date().toISOString(),enabled:false,updated_by:user.id,updated_at:new Date().toISOString()}).eq("id",id).select("id").maybeSingle();
 if(error||!data)redirect(serviceUrl(id,"Could not move this service to Trash."));
 await s.from("activity_logs").insert({user_id:user.id,action:"Service moved to Trash",entity_type:"service",entity_id:id});
 refresh();revalidatePath("/admin/trash");
 redirect("/admin/services?trashed=1");
}
