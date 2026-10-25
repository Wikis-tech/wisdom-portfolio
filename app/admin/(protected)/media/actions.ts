"use server";
import {revalidatePath} from "next/cache";
import {z} from "zod";
import {requireCmsUser} from "@/lib/auth/require-cms-user";
import {createClient} from "@/lib/supabase/server";

const schema=z.object({
 bucket:z.enum(["portfolio-public","portfolio-private"]),
 path:z.string().min(10).max(500),
 originalName:z.string().min(1).max(255),
 mimeType:z.enum(["image/jpeg","image/png","image/webp","image/avif","application/pdf"]),
 byteSize:z.coerce.number().int().positive().max(15*1024*1024),
 category:z.enum(["Projects","Design","Branding","Profile","Blog","Documents","Other"]),
 visibility:z.enum(["public","private"]),
 altText:z.string().trim().max(240).optional()
});

export async function finalizeMediaUpload(fd:FormData){
 const user=await requireCmsUser();
 const parsed=schema.safeParse({
  bucket:fd.get("bucket"),path:fd.get("path"),originalName:fd.get("originalName"),mimeType:fd.get("mimeType"),
  byteSize:fd.get("byteSize"),category:fd.get("category"),visibility:fd.get("visibility"),altText:fd.get("altText")||undefined
 });
 if(!parsed.success)throw new Error("Upload metadata is invalid.");
 const v=parsed.data;
 const expectedBucket=v.visibility==="private"?"portfolio-private":"portfolio-public";
 if(v.bucket!==expectedBucket)throw new Error("Upload visibility does not match the storage bucket.");
 const prefix=`uploads/${user.id}/`;
 if(!v.path.startsWith(prefix))throw new Error("Upload path is not valid for this admin user.");
 const max=(v.visibility==="private"?10:15)*1024*1024;
 if(v.byteSize>max)throw new Error("File exceeds the allowed size.");

 const supabase=await createClient();
 const folder=v.path.slice(0,v.path.lastIndexOf("/"));
 const filename=v.path.slice(v.path.lastIndexOf("/")+1);
 const {data:objects,error:listError}=await supabase.storage.from(v.bucket).list(folder,{search:filename,limit:5});
 if(listError||!objects?.some(x=>x.name===filename))throw new Error("Uploaded file could not be verified.");

 const {data:row,error:db}=await supabase.from("media_library").insert({
  storage_bucket:v.bucket,storage_path:v.path,original_name:v.originalName,display_name:v.originalName,mime_type:v.mimeType,
  byte_size:v.byteSize,alt_text:v.altText??null,category:v.category,visibility:v.visibility,created_by:user.id
 }).select("id").single();
 if(db)throw new Error("The file uploaded, but the media record could not be saved.");

 await supabase.from("activity_logs").insert({
  user_id:user.id,action:"Media uploaded",entity_type:"media",entity_id:row.id,metadata:{category:v.category,visibility:v.visibility}
 });
 revalidatePath("/admin");
 revalidatePath("/admin/media");
}
