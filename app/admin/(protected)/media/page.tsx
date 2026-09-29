import {createClient} from "@/lib/supabase/server";
import {MediaUploadForm} from "@/components/admin/media-upload-form";

export default async function MediaPage(){
 const s=await createClient();
 const {data:media}=await s.from("media_library").select("id,display_name,mime_type,byte_size,category,visibility,storage_bucket,storage_path,alt_text,created_at").is("deleted_at",null).order("created_at",{ascending:false});
 return <main className="mx-auto max-w-[1440px]">
  <p className="text-xs font-semibold tracking-[.18em] text-[#6f8cff]">CONTENT / MEDIA</p>
  <h1 className="mt-3 text-4xl font-semibold tracking-[-.04em]">Media Library</h1>
  <p className="mt-2 text-sm text-white/45">Reusable public assets and protected private documents.</p>
  <section className="mt-8 rounded-2xl border border-white/[.08] bg-white/[.025] p-5 sm:p-6">
   <MediaUploadForm/>
   <p className="mt-3 text-xs text-white/30">Public images ≤15 MB. Private images/PDFs ≤10 MB.</p>
  </section>
  <section className="mt-8">{media?.length?<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{media.map(x=>{const url=x.visibility==="public"?s.storage.from(x.storage_bucket).getPublicUrl(x.storage_path).data.publicUrl:null;const preview=url&&x.mime_type.startsWith("image/");return <article key={x.id} className="overflow-hidden rounded-2xl border border-white/[.08] bg-white/[.025]"><div className="aspect-[16/10] overflow-hidden bg-black/30">{preview?<div role="img" aria-label={x.alt_text||x.display_name} className="h-full w-full bg-cover bg-center" style={{backgroundImage:`url("${url}")`}}/>:<div className="flex h-full items-center justify-center text-xs text-white/30">{x.mime_type==="application/pdf"?"DOCUMENT":"PRIVATE ASSET"}</div>}</div><div className="p-4"><p className="truncate text-sm font-medium">{x.display_name}</p><p className="mt-1 text-xs text-white/35">{x.category} · {(x.byte_size/1048576).toFixed(2)} MB · {x.visibility}</p></div></article>})}</div>:<div className="rounded-2xl border border-dashed border-white/10 py-16 text-center"><p className="text-sm text-white/55">No media yet.</p><p className="mt-2 text-xs text-white/30">Upload your first asset above.</p></div>}</section>
 </main>
}
