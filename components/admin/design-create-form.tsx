"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/client";
import {createDesign} from "@/app/admin/(protected)/designs/actions";
const input="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm";
type Cat={id:string;name:string};
export function DesignCreateForm({categories}:{categories:Cat[]}){
 const router=useRouter();const [busy,setBusy]=useState(false);const [error,setError]=useState("");
 async function submit(formData:FormData){
  setBusy(true);setError("");let uploadedPath:string|null=null;
  try{
   const file=formData.get("file");const existing=String(formData.get("imageUrl")||"").trim();
   if(file instanceof File&&file.size>0){
    if(!["image/png","image/jpeg","image/webp","image/avif"].includes(file.type))throw new Error("Choose a PNG, JPG, WebP or AVIF image.");
    if(file.size>8*1024*1024)throw new Error("The maximum image size is 8 MB.");
    const s=createClient();const {data:{user},error:authError}=await s.auth.getUser();if(authError||!user)throw new Error("Your admin session expired. Please sign in again.");
    const ext=file.type==="image/jpeg"?"jpg":file.type.split("/")[1];uploadedPath="uploads/"+user.id+"/"+crypto.randomUUID()+"."+ext;
    const {error:uploadError}=await s.storage.from("portfolio-public").upload(uploadedPath,file,{contentType:file.type,upsert:false});if(uploadError)throw new Error(uploadError.message||"Image upload failed.");
    formData.set("imageUrl",s.storage.from("portfolio-public").getPublicUrl(uploadedPath).data.publicUrl);formData.set("storagePath",uploadedPath);formData.set("originalName",file.name);formData.set("mimeType",file.type);formData.set("byteSize",String(file.size));formData.delete("file");
   }else if(!existing)throw new Error("Choose an artwork image or provide a URL.");
   const result=await createDesign(formData);if(!result.ok)throw new Error(result.message);
   router.push("/admin/designs/"+result.id+"?saved=1");router.refresh();
  }catch(e){setError(e instanceof Error?e.message:"Could not save the design.");if(uploadedPath)await createClient().storage.from("portfolio-public").remove([uploadedPath]);}finally{setBusy(false)}
 }
 return <form action={submit} className="mt-5 space-y-4">
  <label className="block text-sm text-white/70">Design title<input name="title" required placeholder="e.g. Investment Campaign" className={"mt-2 "+input}/></label>
  <label className="block text-sm text-white/70">Upload artwork <span className="text-white/30">(max 8 MB)</span><input name="file" type="file" accept="image/png,image/jpeg,image/webp,image/avif" className={"mt-2 "+input}/></label>
  <label className="block text-sm text-white/70">Client / brand <span className="text-white/30">(optional)</span><input name="client" placeholder="e.g. SCM Capital" className={"mt-2 "+input}/></label>
  <label className="block text-sm text-white/70">Category<select name="categoryId" className={"mt-2 "+input}><option value="">Uncategorised</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
  <details className="rounded-xl border border-white/[.07] p-4"><summary className="cursor-pointer text-sm text-white/55">Optional details</summary><div className="mt-4 grid gap-4 md:grid-cols-2">
   <label className="md:col-span-2 text-sm text-white/70">Or use an existing image URL<input name="imageUrl" type="url" placeholder="https://..." className={"mt-2 "+input}/></label>
   <label className="text-sm text-white/70">Year<input name="year" type="number" placeholder="2026" className={"mt-2 "+input}/></label>
   <label className="text-sm text-white/70">Visibility<select name="visibility" className={"mt-2 "+input}><option value="public">Public</option><option value="private">Private</option></select></label>
   <label className="md:col-span-2 text-sm text-white/70">Description<textarea name="description" rows={3} className={"mt-2 "+input}/></label>
   <label className="text-sm text-white/70">Tags<input name="tags" placeholder="Social design, branding" className={"mt-2 "+input}/></label>
   <label className="self-end text-sm text-white/70"><input type="checkbox" name="featured" className="mr-2"/>Feature this design</label>
  </div></details>
  <input type="hidden" name="sortOrder" value="0"/>
  {error&&<p role="alert" className="text-sm text-red-300">{error}</p>}
  <button disabled={busy} className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black disabled:cursor-wait disabled:opacity-60">{busy?"Uploading & saving...":"Upload & Save Design"}</button>
 </form>;
}
