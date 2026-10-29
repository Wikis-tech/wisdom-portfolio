"use server";
import {redirect} from "next/navigation";import {revalidatePath} from "next/cache";import {requireCmsUser} from "@/lib/auth/require-cms-user";import {createClient} from "@/lib/supabase/server";
const t=(v:FormDataEntryValue|null)=>{const s=String(v??"").trim();return s||null};
export async function createDesign(fd:FormData){
 const u=await requireCmsUser(),s=await createClient();
 const title=String(fd.get("title")??"").trim();
 if(!title)throw new Error("Enter a title for the design.");
 const file=fd.get("file");
 let imageUrl=String(fd.get("imageUrl")??"").trim();
 let path:string|null=null;
 if(file instanceof File && file.size>0){
  if(!["image/jpeg","image/png","image/webp","image/avif"].includes(file.type))throw new Error("Upload a JPG, PNG, WebP or AVIF image.");
  if(file.size>8*1024*1024)throw new Error("Design images must be 8 MB or smaller.");
  const ext=file.type==="image/jpeg"?"jpg":file.type.split("/")[1];
  path=`designs/${u.id}/${crypto.randomUUID()}.${ext}`;
  const {error:uploadError}=await s.storage.from("portfolio-public").upload(path,file,{contentType:file.type,upsert:false});
  if(uploadError)throw new Error("Image upload failed: "+uploadError.message);
  imageUrl=s.storage.from("portfolio-public").getPublicUrl(path).data.publicUrl;
 }
 if(!imageUrl)throw new Error("Choose an image or provide an image URL.");
 const {data,error}=await s.from("designs").insert({
  title,client:t(fd.get("client")),year:fd.get("year")?Number(fd.get("year")):null,
  category_id:t(fd.get("categoryId")),description:t(fd.get("description")),image_url:imageUrl,
  tags:String(fd.get("tags")??"").split(",").map(x=>x.trim()).filter(Boolean),
  featured:fd.get("featured")==="on",visibility:String(fd.get("visibility")??"public"),
  sort_order:Number(fd.get("sortOrder")||0),created_by:u.id,updated_by:u.id
 }).select("id").single();
 if(error){
  if(path)await s.storage.from("portfolio-public").remove([path]);
  throw new Error("Could not save design: "+error.message);
 }
 if(path)await s.from("media_library").insert({
  storage_bucket:"portfolio-public",storage_path:path,original_name:file instanceof File?file.name:title,
  display_name:title,mime_type:file instanceof File?file.type:"image/png",
  byte_size:file instanceof File?file.size:0,alt_text:title,category:"Design",visibility:"public",created_by:u.id
 });
 await s.from("activity_logs").insert({user_id:u.id,action:"Design created",entity_type:"design",entity_id:data.id});
 revalidatePath("/archive");revalidatePath("/work");revalidatePath("/");
 redirect(`/admin/designs/${data.id}`);
}
export async function saveDesign(fd:FormData){const u=await requireCmsUser(),s=await createClient(),id=String(fd.get("id"));await s.from("designs").update({title:String(fd.get("title")??"").trim(),client:t(fd.get("client")),year:fd.get("year")?Number(fd.get("year")):null,category_id:t(fd.get("categoryId")),description:t(fd.get("description")),image_url:String(fd.get("imageUrl")??"").trim(),tags:String(fd.get("tags")??"").split(",").map(x=>x.trim()).filter(Boolean),featured:fd.get("featured")==="on",visibility:String(fd.get("visibility")??"public"),sort_order:Number(fd.get("sortOrder")||0),updated_by:u.id,updated_at:new Date().toISOString()}).eq("id",id);await s.from("activity_logs").insert({user_id:u.id,action:"Design updated",entity_type:"design",entity_id:id});revalidatePath("/archive");revalidatePath("/");revalidatePath(`/admin/designs/${id}`);revalidatePath("/admin/designs")}
export async function addDesignMedia(fd:FormData){await requireCmsUser();const s=await createClient(),id=String(fd.get("designId"));await s.from("design_media").insert({design_id:id,image_url:String(fd.get("imageUrl")??"").trim(),caption:t(fd.get("caption")),alt_text:t(fd.get("altText")),sort_order:Number(fd.get("sortOrder")||0)});revalidatePath("/archive");revalidatePath(`/admin/designs/${id}`)}
export async function deleteDesignMedia(fd:FormData){await requireCmsUser();const s=await createClient(),designId=String(fd.get("designId"));await s.from("design_media").delete().eq("id",String(fd.get("id")));revalidatePath("/archive");revalidatePath(`/admin/designs/${designId}`)}
export async function trashDesign(fd:FormData){
 const u=await requireCmsUser(),s=await createClient(),id=String(fd.get("id")??"");
 if(!/^[0-9a-f-]{36}$/i.test(id))throw new Error("Invalid design reference.");
 const {data,error}=await s.from("designs").update({deleted_at:new Date().toISOString(),updated_by:u.id,updated_at:new Date().toISOString()}).eq("id",id).is("deleted_at",null).select("id").maybeSingle();
 if(error)throw new Error("Could not move the design to Trash. Your access may need review.");
 if(!data)throw new Error("Design was not found, or you do not have permission to move it.");
 const {error:logError}=await s.from("activity_logs").insert({user_id:u.id,action:"Design moved to Trash",entity_type:"design",entity_id:id});
 if(logError)console.error("Design trash activity log failed",logError.code);
 revalidatePath("/");revalidatePath("/work");revalidatePath("/archive");revalidatePath("/admin/designs");revalidatePath("/admin/trash");
 redirect("/admin/designs");
}
export async function createDesignCategory(fd:FormData){await requireCmsUser();const s=await createClient();await s.from("design_categories").insert({name:String(fd.get("name")??"").trim(),slug:String(fd.get("slug")??"").trim(),sort_order:Number(fd.get("sortOrder")||0)});revalidatePath("/admin/designs")}