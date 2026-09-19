"use server";
import {revalidatePath} from "next/cache";
import {z} from "zod";
import {requireCmsUser} from "@/lib/auth/require-cms-user";
import {createClient} from "@/lib/supabase/server";

const heroSchema=z.object({
 eyebrow:z.string().trim().min(1).max(140),line1:z.string().trim().min(1).max(80),line2:z.string().trim().min(1).max(80),
 supporting:z.string().trim().min(1).max(600),availabilityMessage:z.string().trim().max(240),
 primaryLabel:z.string().trim().min(1).max(80),primaryUrl:z.string().trim().min(1).max(300),
 secondaryLabel:z.string().trim().min(1).max(80),secondaryUrl:z.string().trim().min(1).max(300),
 words:z.array(z.string().trim().min(1).max(30)).min(1).max(12),interval:z.number().int().min(800).max(10000),
 heroMediaUrl:z.union([z.string().url(),z.literal("")])
});
export async function saveHome(fd:FormData){
 const user=await requireCmsUser();const words=String(fd.get("rotatingWords")??"").split("\n").map(x=>x.trim()).filter(Boolean);
 const parsed=heroSchema.safeParse({eyebrow:fd.get("eyebrow"),line1:fd.get("line1"),line2:fd.get("line2"),supporting:fd.get("supporting"),availabilityMessage:fd.get("availabilityMessage"),primaryLabel:fd.get("primaryLabel"),primaryUrl:fd.get("primaryUrl"),secondaryLabel:fd.get("secondaryLabel"),secondaryUrl:fd.get("secondaryUrl"),words,interval:Number(fd.get("interval")||2200),heroMediaUrl:String(fd.get("heroMediaUrl")??"")});
 if(!parsed.success)throw new Error("Home settings are invalid.");
 const s=await createClient(),v=parsed.data;
 await s.from("hero_settings").update({eyebrow:v.eyebrow,headline_line_1:v.line1,headline_line_2:v.line2,supporting_text:v.supporting,availability_enabled:fd.get("availabilityEnabled")==="on",availability_message:v.availabilityMessage,primary_cta_label:v.primaryLabel,primary_cta_url:v.primaryUrl,secondary_cta_label:v.secondaryLabel,secondary_cta_url:v.secondaryUrl,rotating_words:v.words,rotation_enabled:fd.get("rotationEnabled")==="on",rotation_interval_ms:v.interval,hero_media_url:v.heroMediaUrl||null,updated_by:user.id,updated_at:new Date().toISOString()}).eq("singleton_key","default");
 const ids=fd.getAll("sectionId").map(String);
 for(const id of ids){const order=Number(fd.get(`order:${id}`)||0);const enabled=fd.get(`enabled:${id}`)==="on";await s.from("page_sections").update({sort_order:order,enabled,updated_by:user.id,updated_at:new Date().toISOString()}).eq("id",id)}
 await s.from("activity_logs").insert({user_id:user.id,action:"Homepage updated",entity_type:"home"});
 revalidatePath("/");revalidatePath("/admin/pages/home");
}