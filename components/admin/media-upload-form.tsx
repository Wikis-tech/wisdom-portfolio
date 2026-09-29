"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";
import {finalizeMediaUpload} from "@/app/admin/(protected)/media/actions";

const imageTypes=["image/jpeg","image/png","image/webp","image/avif"];
const allowed=[...imageTypes,"application/pdf"];

function safeName(name:string){
 const parts=name.toLowerCase().split(".");
 const ext=parts.length>1?parts.pop()!.replace(/[^a-z0-9]/g,""):"";
 const base=parts.join(".").replace(/[^a-z0-9-_]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)||"asset";
 return ext?`${base}.${ext}`:base;
}

export function MediaUploadForm(){
 const router=useRouter();
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState<string|null>(null);

 async function submit(formData:FormData){
  setMessage(null);
  const file=formData.get("file");
  const visibility=String(formData.get("visibility")||"public");
  if(!(file instanceof File)||file.size<=0){setMessage("Choose a file first.");return}
  if(!allowed.includes(file.type)){setMessage("Use PNG, JPG, WebP, AVIF or PDF.");return}
  const limit=(visibility==="private"?10:15)*1024*1024;
  if(file.size>limit){setMessage(`This file is too large. Maximum size is ${visibility==="private"?10:15} MB.`);return}

  setBusy(true);
  try{
   const supabase=createClient();
   const {data:{user},error:userError}=await supabase.auth.getUser();
   if(userError||!user)throw new Error("Your admin session expired. Sign in again.");

   const bucket=visibility==="private"?"portfolio-private":"portfolio-public";
   const path=`uploads/${user.id}/${crypto.randomUUID()}-${safeName(file.name)}`;
   const {error:uploadError}=await supabase.storage.from(bucket).upload(path,file,{contentType:file.type,upsert:false});
   if(uploadError)throw new Error(uploadError.message||"Storage upload failed.");

   const payload=new FormData();
   payload.set("bucket",bucket);
   payload.set("path",path);
   payload.set("originalName",file.name);
   payload.set("mimeType",file.type);
   payload.set("byteSize",String(file.size));
   payload.set("category",String(formData.get("category")||"Other"));
   payload.set("visibility",visibility);
   payload.set("altText",String(formData.get("altText")||""));

   try{
    await finalizeMediaUpload(payload);
   }catch(error){
    await supabase.storage.from(bucket).remove([path]);
    throw error;
   }

   setMessage("Upload complete.");
   const form=document.getElementById("media-upload-form") as HTMLFormElement|null;
   form?.reset();
   router.refresh();
  }catch(error){
   setMessage(error instanceof Error?error.message:"Upload failed. Please try again.");
  }finally{
   setBusy(false);
  }
 }

 return <form id="media-upload-form" action={submit} className="grid gap-3 lg:grid-cols-[1.5fr_.7fr_.7fr_1fr_auto]">
  <input name="file" type="file" required accept="image/jpeg,image/png,image/webp,image/avif,application/pdf" className="min-w-0 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm"/>
  <select name="category" className="rounded-xl border border-white/10 bg-[#11141c] px-3 py-2.5"><option>Projects</option><option>Design</option><option>Branding</option><option>Profile</option><option>Blog</option><option>Documents</option><option>Other</option></select>
  <select name="visibility" className="rounded-xl border border-white/10 bg-[#11141c] px-3 py-2.5"><option value="public">Public</option><option value="private">Private</option></select>
  <input name="altText" placeholder="Alt text" maxLength={240} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5"/>
  <button disabled={busy} className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black disabled:cursor-wait disabled:opacity-60">{busy?"Uploading…":"Upload"}</button>
  {message&&<p className="lg:col-span-5 text-xs text-white/55" role="status">{message}</p>}
 </form>;
}
