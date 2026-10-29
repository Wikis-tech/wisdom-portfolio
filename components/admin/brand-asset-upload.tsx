"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";
import {finalizeBrandAssetUpload} from "@/app/admin/(protected)/settings/actions";

const allowed=["image/png","image/jpeg","image/webp","image/avif"];

function safeName(name:string){
 const parts=name.toLowerCase().split(".");
 const ext=parts.length>1?parts.pop()!.replace(/[^a-z0-9]/g,""):"png";
 const base=parts.join(".").replace(/[^a-z0-9-_]+/g,"-").replace(/^-+|-+$/g,"").slice(0,70)||"asset";
 return `${base}.${ext}`;
}

export function BrandAssetUpload({kind,currentUrl}:{kind:"logo"|"favicon";currentUrl?:string|null}){
 const router=useRouter();
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState<string|null>(null);
 const label=kind==="logo"?"Logo":"Favicon";
 async function submit(fd:FormData){
  setMessage(null);
  const file=fd.get("file");
  if(!(file instanceof File)||file.size<=0){setMessage("Choose an image first.");return}
  if(!allowed.includes(file.type)){setMessage("Use PNG, JPG, WebP or AVIF.");return}
  const max=(kind==="favicon"?1:3)*1024*1024;
  if(file.size>max){setMessage(`${label} must be ${kind==="favicon"?"1":"3"} MB or smaller.`);return}
  setBusy(true);
  let path:string|null=null;
  try{
   const s=createClient();
   const {data:{user},error:authError}=await s.auth.getUser();
   if(authError||!user)throw new Error("Your admin session expired. Sign in again.");
   path=`brand/${kind}/${user.id}/${crypto.randomUUID()}-${safeName(file.name)}`;
   const {error:uploadError}=await s.storage.from("portfolio-public").upload(path,file,{contentType:file.type,upsert:false});
   if(uploadError)throw new Error(uploadError.message||"Upload failed.");
   const payload=new FormData();
   payload.set("kind",kind);payload.set("path",path);payload.set("mimeType",file.type);payload.set("byteSize",String(file.size));
   await finalizeBrandAssetUpload(payload);
   setMessage(`${label} updated.`);
   router.refresh();
  }catch(error){
   if(path)await createClient().storage.from("portfolio-public").remove([path]);
   setMessage(error instanceof Error?error.message:`Could not update ${label.toLowerCase()}.`);
  }finally{setBusy(false)}
 }
 return <form action={submit} className="rounded-2xl border border-white/[.08] bg-black/20 p-4">
  <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[.02]">
   {currentUrl?<div role="img" aria-label={`Current ${label}`} className={kind==="logo"?"h-16 w-40 bg-contain bg-center bg-no-repeat":"h-16 w-16 rounded-2xl bg-contain bg-center bg-no-repeat"} style={{backgroundImage:`url("${currentUrl}")`}}/>:<div className="text-center"><p className="text-sm font-medium text-white/60">{label}</p><p className="mt-1 text-xs text-white/28">No {label.toLowerCase()} uploaded yet</p></div>}
  </div>
  <input name="file" type="file" accept={allowed.join(",")} required className="mt-4 block w-full text-xs text-white/45 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold file:text-black"/>
  {message&&<p role="status" className="mt-3 text-xs text-white/55">{message}</p>}
  <button disabled={busy} className="mt-4 w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-60">{busy?"Uploading…":`Update ${label.toLowerCase()}`}</button>
 </form>;
}
