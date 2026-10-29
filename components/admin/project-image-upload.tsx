"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";
import {finalizeProjectMediaUpload} from "@/app/admin/(protected)/projects/actions";

const allowed=["image/png","image/jpeg","image/webp","image/avif"];

function safeName(name:string){
 const parts=name.toLowerCase().split(".");
 const ext=parts.length>1?parts.pop()!.replace(/[^a-z0-9]/g,""):"jpg";
 const base=parts.join(".").replace(/[^a-z0-9-_]+/g,"-").replace(/^-+|-+$/g,"").slice(0,70)||"project";
 return `${base}.${ext}`;
}

export function ProjectImageUpload({projectId,kind,currentUrl}:{projectId:string;kind:"card"|"hero";currentUrl?:string|null}){
 const router=useRouter();
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState<string|null>(null);
 const label=kind==="card"?"Preview image":"Hero image";

 async function submit(fd:FormData){
  setMessage(null);
  const file=fd.get("file");
  if(!(file instanceof File)||file.size<=0){setMessage("Choose an image first.");return}
  if(!allowed.includes(file.type)){setMessage("Use PNG, JPG, WebP or AVIF.");return}
  if(file.size>8*1024*1024){setMessage("Use an image 8 MB or smaller.");return}
  setBusy(true);
  let path:string|null=null;
  try{
   const s=createClient();
   const {data:{user},error:authError}=await s.auth.getUser();
   if(authError||!user)throw new Error("Your admin session expired. Sign in again.");
   path=`projects/${projectId}/${kind}/${user.id}/${crypto.randomUUID()}-${safeName(file.name)}`;
   const {error:uploadError}=await s.storage.from("portfolio-public").upload(path,file,{contentType:file.type,upsert:false});
   if(uploadError)throw new Error(uploadError.message||"Image upload failed.");

   const payload=new FormData();
   payload.set("projectId",projectId);payload.set("kind",kind);payload.set("path",path);
   payload.set("originalName",file.name);payload.set("mimeType",file.type);payload.set("byteSize",String(file.size));
   await finalizeProjectMediaUpload(payload);
   setMessage(`${label} updated.`);
   router.refresh();
  }catch(error){
   if(path)await createClient().storage.from("portfolio-public").remove([path]);
   setMessage(error instanceof Error?error.message:"Could not save the project image.");
  }finally{setBusy(false)}
 }

 return <form action={submit} className="rounded-2xl border border-white/[.08] bg-black/20 p-4">
  <div className="aspect-[16/10] overflow-hidden rounded-xl border border-dashed border-white/10 bg-[#081024]">
   {currentUrl?<div role="img" aria-label={`Current ${label}`} className="h-full w-full bg-cover bg-center" style={{backgroundImage:`url("${currentUrl}")`}}/>:<div className="flex h-full items-center justify-center text-center"><div><p className="text-sm font-medium text-white/55">{label}</p><p className="mt-1 text-xs text-white/25">Add a clean screenshot or mockup</p></div></div>}
  </div>
  <input name="file" type="file" accept={allowed.join(",")} required className="mt-4 block w-full text-xs text-white/45 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold file:text-black"/>
  {message&&<p role="status" className="mt-3 text-xs text-white/55">{message}</p>}
  <button disabled={busy} className="mt-4 w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-60">{busy?"Uploading…":`Upload ${label.toLowerCase()}`}</button>
 </form>;
}
