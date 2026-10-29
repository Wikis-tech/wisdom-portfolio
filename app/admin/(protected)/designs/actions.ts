"use server";
import {redirect} from "next/navigation";import {revalidatePath} from "next/cache";import {requireCmsUser} from "@/lib/auth/require-cms-user";import {createClient} from "@/lib/supabase/server";
const text=(v:FormDataEntryValue|null)=>String(v??"").trim();
function url(id?:string,error?:string,saved?:boolean){const base=id?"/admin/designs/"+id:"/admin/designs";if(error)return base+"?error="+encodeURIComponent(error);return saved?base+"?saved=1":base}
function validImageUrl(v:string){try{const u=new URL(v);return u.protocol==="https:"}catch{return false}}
function refresh(id?:string){revalidatePath("/");revalidatePath("/archive");revalidatePath("/work");revalidatePath("/admin/designs");if(id)revalidatePath("/admin/designs/"+id)}
export async function createDesign(fd:FormData){
 const u=await requireCmsUser(),title=text(fd.get("title")),imageUrl=text(fd.get("imageUrl")),storagePath=text(fd.get("storagePath"));
 if(title.length<2)return {ok:false as const,message:"Enter a title for the design."};
 if(!imageUrl||!validImageUrl(imageUrl))return {ok:false as const,message:"Upload an image or provide a valid HTTPS image URL."};
 const s=await createClient();
 if(storagePath){
  const prefix="uploads/"+u.id+"/";
  if(!storagePath.startsWith(prefix))return {ok:false as const,message:"That uploaded file is not owned by this admin session."};
  const folder=storagePath.slice(0,storagePath.lastIndexOf("/")),filename=storagePath.slice(storagePath.lastIndexOf("/")+1);
  const {data:objects,error:listError}=await s.storage.from("portfolio-public").list(folder,{search:filename,limit:5});
  if(listError||!objects?.some(x=>x.name===filename))return {ok:false as const,message:"The uploaded artwork could not be verified."};
 }
 const {data,error}=await s.from("designs").insert({title,client:text(fd.get("client"))||null,year:fd.get("year")?Number(fd.get("year")):null,category_id:text(fd.get("categoryId"))||null,description:text(fd.get("description"))||null,image_url:imageUrl,tags:text(fd.get("tags")).split(",").map(x=>x.trim()).filter(Boolean).slice(0,30),featured:fd.get("featured")==="on",visibility:String(fd.get("visibility")??"public"),sort_order:Number(fd.get("sortOrder")||0),created_by:u.id,updated_by:u.id}).select("id").single();
 if(error||!data)return {ok:false as const,message:"The image uploaded, but the design record could not be saved."};
 if(storagePath){
  const mimeType=text(fd.get("mimeType")),byteSize=Number(fd.get("byteSize")||0),originalName=text(fd.get("originalName"))||title;
  await s.from("media_library").insert({storage_bucket:"portfolio-public",storage_path:storagePath,original_name:originalName,display_name:title,mime_type:mimeType||"image/png",byte_size:Number.isFinite(byteSize)?byteSize:0,alt_text:title,category:"Design",visibility:"public",created_by:u.id});
 }
 await s.from("activity_logs").insert({user_id:u.id,action:"Design created",entity_type:"design",entity_id:data.id});refresh(data.id);
 return {ok:true as const,id:data.id};
}
export async function saveDesign(fd:FormData){const u=await requireCmsUser(),s=await createClient(),id=text(fd.get("id")),title=text(fd.get("title")),imageUrl=text(fd.get("imageUrl"));if(title.length<2)redirect(url(id,"Enter a title for the design."));if(!imageUrl||!validImageUrl(imageUrl))redirect(url(id,"A valid HTTPS image URL is required."));const {data,error}=await s.from("designs").update({title,client:text(fd.get("client"))||null,year:fd.get("year")?Number(fd.get("year")):null,category_id:text(fd.get("categoryId"))||null,description:text(fd.get("description"))||null,image_url:imageUrl,tags:text(fd.get("tags")).split(",").map(x=>x.trim()).filter(Boolean).slice(0,30),featured:fd.get("featured")==="on",visibility:String(fd.get("visibility")??"public"),sort_order:Number(fd.get("sortOrder")||0),updated_by:u.id,updated_at:new Date().toISOString()}).eq("id",id).select("id").maybeSingle();if(error||!data)redirect(url(id,"Could not save this design."));await s.from("activity_logs").insert({user_id:u.id,action:"Design updated",entity_type:"design",entity_id:id});refresh(id);redirect(url(id,undefined,true))}
export async function addDesignMedia(fd:FormData){await requireCmsUser();const s=await createClient(),id=text(fd.get("designId")),imageUrl=text(fd.get("imageUrl"));if(!validImageUrl(imageUrl))redirect(url(id,"Use a valid HTTPS image URL."));const {error}=await s.from("design_media").insert({design_id:id,image_url:imageUrl,caption:text(fd.get("caption"))||null,alt_text:text(fd.get("altText"))||null,sort_order:Number(fd.get("sortOrder")||0)});if(error)redirect(url(id,"Could not add supporting design media."));refresh(id);redirect(url(id,undefined,true))}
export async function deleteDesignMedia(fd:FormData){await requireCmsUser();const s=await createClient(),designId=text(fd.get("designId"));const {error}=await s.from("design_media").delete().eq("id",text(fd.get("id")));if(error)redirect(url(designId,"Could not remove supporting design media."));refresh(designId);redirect(url(designId,undefined,true))}
export async function trashDesign(fd:FormData){const u=await requireCmsUser(),s=await createClient(),id=text(fd.get("id"));if(!/^[0-9a-f-]{36}$/i.test(id))redirect(url(undefined,"Invalid design reference."));const {data,error}=await s.from("designs").update({deleted_at:new Date().toISOString(),updated_by:u.id,updated_at:new Date().toISOString()}).eq("id",id).is("deleted_at",null).select("id").maybeSingle();if(error||!data)redirect(url(id,"Could not move the design to Trash."));await s.from("activity_logs").insert({user_id:u.id,action:"Design moved to Trash",entity_type:"design",entity_id:id});refresh();revalidatePath("/admin/trash");redirect("/admin/designs?trashed=1")}
export async function createDesignCategory(fd:FormData){await requireCmsUser();const name=text(fd.get("name")),slug=text(fd.get("slug")).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");if(!name||!slug)redirect(url(undefined,"Enter a category name."));const s=await createClient();const {error}=await s.from("design_categories").insert({name,slug,sort_order:Number(fd.get("sortOrder")||0)});if(error)redirect(url(undefined,error.code==="23505"?"That category already exists.":"Could not add the category."));revalidatePath("/admin/designs");redirect(url(undefined,undefined,true))}
