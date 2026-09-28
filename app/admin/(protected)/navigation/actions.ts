"use server";
import {revalidatePath} from "next/cache";
import {z} from "zod";
import {requireCmsUser} from "@/lib/auth/require-cms-user";
import {createClient} from "@/lib/supabase/server";

const schema=z.object({
 label:z.string().trim().min(1).max(60),
 href:z.string().trim().min(1).max(500),
 location:z.enum(["header","footer"]),
 style:z.enum(["link","cta"]),
 sortOrder:z.coerce.number().int().min(-10000).max(10000),
 isExternal:z.boolean(),
 enabled:z.boolean(),
});

function parse(fd:FormData){
 const p=schema.safeParse({
  label:fd.get("label"),href:fd.get("href"),location:fd.get("location"),style:fd.get("style"),
  sortOrder:Number(fd.get("sortOrder")||0),isExternal:fd.get("isExternal")==="on",enabled:fd.get("enabled")==="on",
 });
 if(!p.success)throw new Error("Navigation item is invalid.");
 const external=p.data.isExternal||p.data.href.startsWith("http");
 if(external&&!/^https:\/\//.test(p.data.href))throw new Error("External links must use HTTPS.");
 if(!external&&!p.data.href.startsWith("/"))throw new Error("Internal links must start with /.");
 return {...p.data,isExternal:external};
}
function refresh(){revalidatePath("/");revalidatePath("/work");revalidatePath("/about");revalidatePath("/archive");revalidatePath("/lab");revalidatePath("/services");revalidatePath("/pricing");revalidatePath("/contact");revalidatePath("/quote");revalidatePath("/admin/navigation")}

export async function createNavigationItem(fd:FormData){
 const user=await requireCmsUser(),v=parse(fd),s=await createClient();
 const {error}=await s.from("navigation_items").insert({label:v.label,href:v.href,location:v.location,style:v.style,is_external:v.isExternal,enabled:v.enabled,sort_order:v.sortOrder,created_by:user.id,updated_by:user.id});
 if(error)throw new Error(error.code==="23505"?"That destination already exists in this navigation area.":"Could not add navigation item.");
 await s.from("activity_logs").insert({user_id:user.id,action:"Navigation item created",entity_type:"navigation",metadata:{label:v.label,href:v.href}});
 refresh();
}
export async function saveNavigationItem(fd:FormData){
 const user=await requireCmsUser(),v=parse(fd),s=await createClient(),id=String(fd.get("id"));
 const {error}=await s.from("navigation_items").update({label:v.label,href:v.href,location:v.location,style:v.style,is_external:v.isExternal,enabled:v.enabled,sort_order:v.sortOrder,updated_by:user.id,updated_at:new Date().toISOString()}).eq("id",id);
 if(error)throw new Error("Could not save navigation item.");
 await s.from("activity_logs").insert({user_id:user.id,action:"Navigation item updated",entity_type:"navigation",entity_id:id});
 refresh();
}
export async function deleteNavigationItem(fd:FormData){
 const user=await requireCmsUser(),s=await createClient(),id=String(fd.get("id"));
 const {error}=await s.from("navigation_items").delete().eq("id",id);
 if(error)throw new Error("Could not delete navigation item.");
 await s.from("activity_logs").insert({user_id:user.id,action:"Navigation item deleted",entity_type:"navigation",entity_id:id});
 refresh();
}
