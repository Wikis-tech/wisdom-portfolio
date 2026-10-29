"use server";
import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {requireCmsUser} from "@/lib/auth/require-cms-user";
import {createClient} from "@/lib/supabase/server";
import {blockSchema,projectSchema} from "@/features/projects/validation";

const checked=(fd:FormData,key:string)=>fd.get(key)==="on";
const text=(v:FormDataEntryValue|null)=>{const s=String(v??"").trim();return s||null};
const projectImages=["image/jpeg","image/png","image/webp","image/avif"];

function projectError(id:string|null,message:string){
 const base=id?`/admin/projects/${id}`:"/admin/projects/new";
 return `${base}?error=${encodeURIComponent(message)}`;
}

function parsedProject(fd:FormData){
 return projectSchema.safeParse({
  title:fd.get("title"),
  slug:fd.get("slug"),
  shortDescription:text(fd.get("shortDescription"))??undefined,
  problem:text(fd.get("problem"))??undefined,
  solution:text(fd.get("solution"))??undefined,
  whyItMattered:text(fd.get("whyItMattered"))??undefined,
  outcome:text(fd.get("outcome"))??undefined,
  year:fd.get("year")?fd.get("year"):undefined,
  client:text(fd.get("client"))??undefined,
  role:text(fd.get("role"))??undefined,
  status:fd.get("status"),
  visibility:fd.get("visibility"),
  featured:checked(fd,"featured"),
  confidential:checked(fd,"confidential"),
  liveUrl:String(fd.get("liveUrl")??""),
  githubUrl:String(fd.get("githubUrl")??""),
  seoTitle:text(fd.get("seoTitle"))??undefined,
  seoDescription:text(fd.get("seoDescription"))??undefined,
  seoImageUrl:String(fd.get("seoImageUrl")??""),
  seoNoindex:checked(fd,"seoNoindex")
 });
}

function projectPayload(v:ReturnType<typeof projectSchema.parse>){
 return {
  title:v.title,slug:v.slug,short_description:v.shortDescription??null,
  problem:v.problem??null,solution:v.solution??null,why_it_mattered:v.whyItMattered??null,outcome:v.outcome??null,
  year:v.year??null,client:v.client??null,role:v.role??null,status:v.status,visibility:v.visibility,
  featured:v.featured,confidential:v.confidential,live_url:v.liveUrl||null,github_url:v.githubUrl||null,
  seo_title:v.seoTitle??null,seo_description:v.seoDescription??null,seo_image_url:v.seoImageUrl||null,seo_noindex:v.seoNoindex
 };
}

async function persistProject(fd:FormData,userId:string,supabase:Awaited<ReturnType<typeof createClient>>){
 const id=String(fd.get("id")??"");
 const parsed=parsedProject(fd);
 if(!parsed.success)return {ok:false as const,id,message:parsed.error.issues[0]?.message||"Please review the project details."};
 const v=parsed.data;
 const {data,error}=await supabase.from("projects").update({...projectPayload(v),updated_by:userId,updated_at:new Date().toISOString()}).eq("id",id).select("id").maybeSingle();
 if(error||!data)return {ok:false as const,id,message:error?.code==="23505"?"Another project already uses that slug.":"Could not save this project."};

 const categories=fd.getAll("categories").map(String).filter(Boolean).slice(0,30);
 const {error:deleteError}=await supabase.from("project_category_links").delete().eq("project_id",id);
 if(deleteError)return {ok:false as const,id,message:"Project details saved, but categories could not be refreshed."};
 if(categories.length){
  const {error:categoryError}=await supabase.from("project_category_links").insert(categories.map(category_id=>({project_id:id,category_id})));
  if(categoryError)return {ok:false as const,id,message:"Project details saved, but categories could not be updated."};
 }
 return {ok:true as const,id,v};
}

export async function createProject(fd:FormData){
 const user=await requireCmsUser();
 const parsed=parsedProject(fd);
 if(!parsed.success)redirect(projectError(null,parsed.error.issues[0]?.message||"Please review the project details."));
 const supabase=await createClient(),v=parsed.data;
 const {data,error}=await supabase.from("projects").insert({...projectPayload(v),created_by:user.id,updated_by:user.id}).select("id").single();
 if(error)redirect(projectError(null,error.code==="23505"?"That project slug already exists.":"Could not create the project."));
 const categories=fd.getAll("categories").map(String).filter(Boolean).slice(0,30);
 if(categories.length)await supabase.from("project_category_links").insert(categories.map(category_id=>({project_id:data.id,category_id})));
 await supabase.from("activity_logs").insert({user_id:user.id,action:"Project created",entity_type:"project",entity_id:data.id,metadata:{title:v.title}});
 redirect(`/admin/projects/${data.id}?saved=created`);
}

export async function createQuickProject(fd:FormData){
 const user=await requireCmsUser();
 const title=String(fd.get("title")??"").trim();
 const url=String(fd.get("liveUrl")??"").trim();
 const description=String(fd.get("shortDescription")??"").trim();
 if(title.length<2||title.length>120)redirect(projectError(null,"Enter a project name between 2 and 120 characters."));
 if(description.length>500)redirect(projectError(null,"Description cannot exceed 500 characters."));
 if(url){try{const u=new URL(url);if(!["http:","https:"].includes(u.protocol))throw new Error("protocol");}catch{redirect(projectError(null,"Enter a valid website link."));}}
 const baseSlug=title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
 if(!baseSlug)redirect(projectError(null,"The project name must include letters or numbers."));

 const s=await createClient();
 const {data:existing,error:slugError}=await s.from("projects").select("slug").like("slug",baseSlug+"%").limit(100);
 if(slugError)redirect(projectError(null,"Could not prepare a unique project link. Please try again."));
 const used=new Set((existing??[]).map(x=>x.slug));
 let slug=baseSlug;
 for(let suffix=2;used.has(slug)&&suffix<=101;suffix++)slug=`${baseSlug}-${suffix}`;
 if(used.has(slug))redirect(projectError(null,"Too many projects have the same name."));

 const {data:project,error}=await s.from("projects").insert({
  title,slug,short_description:description||null,live_url:url||null,status:url?"live":"in_development",
  visibility:"private",featured:false,confidential:false,content_state:"draft",created_by:user.id,updated_by:user.id
 }).select("id").single();
 if(error)redirect(projectError(null,"Could not create the project. Please try again."));

 const {data:category}=await s.from("project_categories").select("id").eq("slug","software").maybeSingle();
 if(category)await s.from("project_category_links").insert({project_id:project.id,category_id:category.id});
 await s.from("activity_logs").insert({user_id:user.id,action:"Project created",entity_type:"project",entity_id:project.id,metadata:{title}});
 redirect(`/admin/projects/${project.id}?saved=created`);
}

export async function updateProject(fd:FormData){
 const user=await requireCmsUser();
 const id=String(fd.get("id")??"");
 const supabase=await createClient();
 const result=await persistProject(fd,user.id,supabase);
 if(!result.ok)redirect(projectError(id,result.message));
 await supabase.from("activity_logs").insert({user_id:user.id,action:"Project draft saved",entity_type:"project",entity_id:id});
 revalidatePath(`/admin/projects/${id}`);revalidatePath("/admin/projects");
 redirect(`/admin/projects/${id}?saved=draft`);
}

export async function publishProject(fd:FormData){
 const user=await requireCmsUser();
 const supabase=await createClient();
 let id=String(fd.get("id")??"");
 if(fd.has("title")){
  const saved=await persistProject(fd,user.id,supabase);
  if(!saved.ok)redirect(projectError(id,saved.message));
  id=saved.id;
 }

 const [{data:project,error:projectReadError},{data:blocks,error:blockError},{data:links,error:linkError}]=await Promise.all([
  supabase.from("projects").select("*").eq("id",id).is("deleted_at",null).maybeSingle(),
  supabase.from("project_blocks").select("id,block_type,sort_order,data,is_visible").eq("project_id",id).order("sort_order"),
  supabase.from("project_category_links").select("category_id,project_categories(name,slug)").eq("project_id",id)
 ]);
 if(projectReadError||!project)redirect(projectError(id,"Project could not be loaded for publishing."));
 if(blockError||linkError)redirect(projectError(id,"Supporting project data could not be loaded."));

 if(project.visibility==="public"&&!String(project.short_description??"").trim()&&!project.live_url&&!String(project.solution??"").trim()){
  redirect(projectError(id,"Add a short description or website link before publishing publicly."));
 }

 let cardMediaUrl:string|null=null,heroMediaUrl:string|null=null;
 if(project.card_media_id||project.hero_media_id){
  const ids=[project.card_media_id,project.hero_media_id].filter(Boolean);
  const {data:mediaRows}=await supabase.from("media_library").select("id,storage_bucket,storage_path").in("id",ids);
  const urlFor=(mediaId:string|null)=>{const row=mediaRows?.find(m=>m.id===mediaId);return row?supabase.storage.from(row.storage_bucket).getPublicUrl(row.storage_path).data.publicUrl:null};
  cardMediaUrl=urlFor(project.card_media_id);heroMediaUrl=urlFor(project.hero_media_id);
 }

 const snapshot={
  title:project.title,slug:project.slug,short_description:project.short_description,problem:project.problem,solution:project.solution,
  why_it_mattered:project.why_it_mattered,outcome:project.outcome,year:project.year,client:project.client,role:project.role,status:project.status,
  confidential:project.confidential,live_url:project.confidential?null:project.live_url,github_url:project.confidential?null:project.github_url,
  card_media_url:cardMediaUrl,hero_media_url:heroMediaUrl,seo_title:project.seo_title,seo_description:project.seo_description,
  seo_image_url:project.seo_image_url,seo_noindex:project.seo_noindex,categories:links??[],blocks:(blocks??[]).filter(x=>x.is_visible)
 };
 const now=new Date().toISOString();
 const {data:updated,error:updateError}=await supabase.from("projects").update({
  content_state:"published",published_snapshot:snapshot,published_at:now,updated_by:user.id,updated_at:now
 }).eq("id",id).select("id").maybeSingle();
 if(updateError||!updated)redirect(projectError(id,"Could not publish this project."));

 if(project.visibility==="public"){
  const {error:publicationError}=await supabase.from("project_publications").upsert({
   project_id:id,slug:project.slug,title:project.title,short_description:project.short_description,status:project.status,
   featured:project.featured,sort_order:project.sort_order,confidential:project.confidential,snapshot,published_at:now,updated_at:now
  },{onConflict:"project_id"});
  if(publicationError)redirect(projectError(id,"Project saved, but the public listing could not be updated."));
 }else{
  const {error:removeError}=await supabase.from("project_publications").delete().eq("project_id",id);
  if(removeError)redirect(projectError(id,"Project saved, but its old public listing could not be removed."));
 }

 await supabase.from("activity_logs").insert({user_id:user.id,action:"Project published",entity_type:"project",entity_id:id,metadata:{featured:project.featured,visibility:project.visibility}});
 revalidatePath("/");revalidatePath("/work");revalidatePath(`/work/${project.slug}`);revalidatePath(`/admin/projects/${id}`);
 redirect(`/admin/projects/${id}?saved=published`);
}

export async function addBlock(fd:FormData){
 await requireCmsUser();
 const projectId=String(fd.get("projectId")??"");
 const parsed=blockSchema.safeParse({blockType:fd.get("blockType"),content:String(fd.get("content")??"")});
 if(!parsed.success)redirect(projectError(projectId,"That content block is invalid."));
 const supabase=await createClient();
 const {data:last}=await supabase.from("project_blocks").select("sort_order").eq("project_id",projectId).order("sort_order",{ascending:false}).limit(1).maybeSingle();
 const {error}=await supabase.from("project_blocks").insert({project_id:projectId,block_type:parsed.data.blockType,sort_order:(last?.sort_order??-1)+1,data:parsed.data.blockType==="spacer"?{}:{content:parsed.data.content}});
 if(error)redirect(projectError(projectId,"Could not add the content block."));
 revalidatePath(`/admin/projects/${projectId}`);
 redirect(`/admin/projects/${projectId}?saved=block`);
}

export async function deleteBlock(fd:FormData){
 await requireCmsUser();
 const projectId=String(fd.get("projectId")??"");
 const supabase=await createClient();
 const {error}=await supabase.from("project_blocks").delete().eq("id",String(fd.get("blockId")??""));
 if(error)redirect(projectError(projectId,"Could not remove the content block."));
 revalidatePath(`/admin/projects/${projectId}`);
 redirect(`/admin/projects/${projectId}?saved=block`);
}

export async function moveProjectToTrash(fd:FormData){
 const user=await requireCmsUser();
 const id=String(fd.get("id")??"");
 const supabase=await createClient();
 const {data,error}=await supabase.from("projects").update({deleted_at:new Date().toISOString(),updated_by:user.id,updated_at:new Date().toISOString()}).eq("id",id).select("id").maybeSingle();
 if(error||!data)redirect(projectError(id,"Could not move this project to Trash."));
 await supabase.from("project_publications").delete().eq("project_id",id);
 await supabase.from("activity_logs").insert({user_id:user.id,action:"Project moved to Trash",entity_type:"project",entity_id:id});
 revalidatePath("/");revalidatePath("/work");revalidatePath("/admin/projects");revalidatePath("/admin/trash");
 redirect("/admin/projects?trashed=1");
}

export async function finalizeProjectMediaUpload(fd:FormData){
 const user=await requireCmsUser();
 const projectId=String(fd.get("projectId")??"");
 const kind=String(fd.get("kind")??"");
 const path=String(fd.get("path")??"");
 const originalName=String(fd.get("originalName")??"").slice(0,255);
 const mimeType=String(fd.get("mimeType")??"");
 const byteSize=Number(fd.get("byteSize")||0);
 if(!/^[0-9a-f-]{36}$/i.test(projectId))return {ok:false,message:"Invalid project."};
 if(!["card","hero"].includes(kind))return {ok:false,message:"Unknown project image type."};
 if(!projectImages.includes(mimeType))return {ok:false,message:"Use PNG, JPG, WebP or AVIF."};
 if(!Number.isFinite(byteSize)||byteSize<=0||byteSize>8*1024*1024)return {ok:false,message:"Project images must be 8 MB or smaller."};
 const prefix=`projects/${projectId}/${kind}/${user.id}/`;
 if(!path.startsWith(prefix))return {ok:false,message:"That upload path is not valid for this project/admin session."};

 const s=await createClient();
 const {data:project,error:projectError}=await s.from("projects").select("id").eq("id",projectId).is("deleted_at",null).maybeSingle();
 if(projectError||!project)return {ok:false,message:"Project not found or access denied."};
 const folder=path.slice(0,path.lastIndexOf("/"));
 const filename=path.slice(path.lastIndexOf("/")+1);
 const {data:objects,error:listError}=await s.storage.from("portfolio-public").list(folder,{search:filename,limit:5});
 if(listError||!objects?.some(x=>x.name===filename))return {ok:false,message:"Uploaded image could not be verified."};

 const {data:media,error:mediaError}=await s.from("media_library").insert({
  storage_bucket:"portfolio-public",storage_path:path,original_name:originalName||filename,display_name:originalName||filename,mime_type:mimeType,byte_size:byteSize,
  alt_text:kind==="card"?"Project preview image":"Project hero image",category:"Projects",visibility:"public",created_by:user.id
 }).select("id").single();
 if(mediaError)return {ok:false,message:"The image uploaded, but its media record could not be saved."};

 const column=kind==="card"?"card_media_id":"hero_media_id";
 const {data:updated,error:updateError}=await s.from("projects").update({[column]:media.id,updated_by:user.id,updated_at:new Date().toISOString()}).eq("id",projectId).select("id").maybeSingle();
 if(updateError||!updated){
  await s.from("media_library").delete().eq("id",media.id);
  return {ok:false,message:"The image uploaded, but could not be attached to the project."};
 }
 await s.from("activity_logs").insert({user_id:user.id,action:kind==="card"?"Project preview image updated":"Project hero image updated",entity_type:"project",entity_id:projectId});
 revalidatePath(`/admin/projects/${projectId}`);
 return {ok:true};
}
