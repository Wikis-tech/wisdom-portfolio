"use server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {z} from "zod";
import {requireCmsUser} from "@/lib/auth/require-cms-user";
import {createClient} from "@/lib/supabase/server";

const optionalUrl=z.union([z.literal(""),z.string().url()]);
const schema=z.object({
 company:z.string().trim().min(2).max(140),position:z.string().trim().min(2).max(140),employmentType:z.string().trim().max(80),location:z.string().trim().max(120),
 startDate:z.union([z.literal(""),z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]),endDate:z.union([z.literal(""),z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]),
 description:z.string().trim().max(2500),responsibilities:z.string().trim().max(5000),logoUrl:optionalUrl,websiteUrl:optionalUrl,sortOrder:z.coerce.number().int().min(-10000).max(10000)
});
function parse(fd:FormData){return schema.safeParse({company:fd.get("company"),position:fd.get("position"),employmentType:String(fd.get("employmentType")??""),location:String(fd.get("location")??""),startDate:String(fd.get("startDate")??""),endDate:String(fd.get("endDate")??""),description:String(fd.get("description")??""),responsibilities:String(fd.get("responsibilities")??""),logoUrl:String(fd.get("logoUrl")??""),websiteUrl:String(fd.get("websiteUrl")??""),sortOrder:Number(fd.get("sortOrder")||0)})}
function url(message?:string,saved?:boolean){if(message)return "/admin/experience?error="+encodeURIComponent(message);if(saved)return "/admin/experience?saved=1";return "/admin/experience"}
function refresh(){revalidatePath("/");revalidatePath("/about");revalidatePath("/admin/experience")}

export async function createExperience(fd:FormData){
 const user=await requireCmsUser();const parsed=parse(fd);if(!parsed.success)redirect(url(parsed.error.issues[0]?.message||"Please review the experience details."));
 const v=parsed.data,s=await createClient();
 const {data:last}=await s.from("experiences").select("sort_order").order("sort_order",{ascending:false}).limit(1).maybeSingle();
 const {data,error}=await s.from("experiences").insert({company:v.company,position:v.position,employment_type:v.employmentType||null,location:v.location||null,start_date:v.startDate||null,end_date:v.endDate||null,current_position:fd.get("current")==="on",description:v.description||null,responsibilities:v.responsibilities||null,logo_url:v.logoUrl||null,website_url:v.websiteUrl||null,sort_order:v.sortOrder||((last?.sort_order??0)+10),is_visible:true,created_by:user.id,updated_by:user.id}).select("id").single();
 if(error||!data)redirect(url("Could not add this experience. Please try again."));
 await s.from("activity_logs").insert({user_id:user.id,action:"Experience created",entity_type:"experience",entity_id:data.id});refresh();redirect(url(undefined,true));
}
export async function saveExperience(fd:FormData){
 const user=await requireCmsUser();const id=String(fd.get("id")??"");const parsed=parse(fd);if(!parsed.success)redirect(url(parsed.error.issues[0]?.message||"Please review the experience details."));
 const v=parsed.data,s=await createClient();const {data,error}=await s.from("experiences").update({company:v.company,position:v.position,employment_type:v.employmentType||null,location:v.location||null,start_date:v.startDate||null,end_date:v.endDate||null,current_position:fd.get("current")==="on",description:v.description||null,responsibilities:v.responsibilities||null,logo_url:v.logoUrl||null,website_url:v.websiteUrl||null,sort_order:v.sortOrder,is_visible:fd.get("visible")==="on",updated_by:user.id,updated_at:new Date().toISOString()}).eq("id",id).select("id").maybeSingle();
 if(error||!data)redirect(url("Could not save this experience."));await s.from("activity_logs").insert({user_id:user.id,action:"Experience updated",entity_type:"experience",entity_id:id});refresh();redirect(url(undefined,true));
}
export async function deleteExperience(fd:FormData){
 const user=await requireCmsUser();const id=String(fd.get("id")??"");const s=await createClient();const {error}=await s.from("experiences").delete().eq("id",id);if(error)redirect(url("Could not delete this experience."));await s.from("activity_logs").insert({user_id:user.id,action:"Experience deleted",entity_type:"experience",entity_id:id});refresh();redirect(url(undefined,true));
}
