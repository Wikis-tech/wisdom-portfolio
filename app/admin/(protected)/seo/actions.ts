"use server";
import {revalidatePath} from "next/cache";
import {z} from "zod";
import {requireCmsUser} from "@/lib/auth/require-cms-user";
import {createClient} from "@/lib/supabase/server";

const url=z.union([z.literal(""),z.string().url().refine(x=>x.startsWith("https://"),"HTTPS required")]);
const schema=z.object({title:z.string().trim().min(2).max(80),description:z.string().trim().min(20).max(320),ogImage:url,canonical:url,noindex:z.boolean()});
export async function saveSeo(fd:FormData){
 const user=await requireCmsUser(),s=await createClient(),id=String(fd.get("id"));
 const p=schema.safeParse({title:fd.get("title"),description:fd.get("description"),ogImage:String(fd.get("ogImage")??""),canonical:String(fd.get("canonical")??""),noindex:fd.get("noindex")==="on"});
 if(!p.success)throw new Error("SEO details are invalid.");
 const v=p.data;const {error}=await s.from("seo_settings").update({title:v.title,description:v.description,og_image_url:v.ogImage||null,canonical_url:v.canonical||null,noindex:v.noindex,updated_by:user.id,updated_at:new Date().toISOString()}).eq("id",id);
 if(error)throw new Error("Could not save SEO settings.");
 await s.from("activity_logs").insert({user_id:user.id,action:"SEO settings updated",entity_type:"seo",entity_id:id});
 revalidatePath("/");revalidatePath("/work");revalidatePath("/about");revalidatePath("/archive");revalidatePath("/lab");revalidatePath("/services");revalidatePath("/pricing");revalidatePath("/contact");revalidatePath("/quote");revalidatePath("/sitemap.xml");revalidatePath("/robots.txt");revalidatePath("/admin/seo");
}
