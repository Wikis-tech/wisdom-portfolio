"use server";
import {revalidatePath} from "next/cache";import {redirect} from "next/navigation";import {requireCmsUser} from "@/lib/auth/require-cms-user";import {createClient} from "@/lib/supabase/server";
type TrashTable="projects"|"designs"|"experiments"|"services"|"pricing_packages"|"testimonials";
function url(error?:string,saved?:boolean){if(error)return "/admin/trash?error="+encodeURIComponent(error);return saved?"/admin/trash?saved=1":"/admin/trash"}
async function admin(){const user=await requireCmsUser();if(user.role!=="admin")redirect(url("Admin access is required for Trash operations."));return user}
async function restore(table:TrashTable,id:string,extra:Record<string,unknown>={}){const user=await admin(),s=await createClient();const {data,error}=await s.from(table).update({deleted_at:null,updated_by:user.id,updated_at:new Date().toISOString(),...extra}).eq("id",id).select("id").maybeSingle();if(error||!data)redirect(url("Could not restore that item."));revalidatePath("/admin/trash")}
async function destroy(table:TrashTable,id:string){await admin();const s=await createClient();const {error}=await s.from(table).delete().eq("id",id);if(error)redirect(url("Could not permanently delete that item."));revalidatePath("/admin/trash")}
export async function restoreProject(fd:FormData){await restore("projects",String(fd.get("id")??""));revalidatePath("/admin/projects");redirect(url(undefined,true))}
export async function deleteProjectForever(fd:FormData){await destroy("projects",String(fd.get("id")??""));redirect(url(undefined,true))}
export async function restoreDesign(fd:FormData){await restore("designs",String(fd.get("id")??""));revalidatePath("/admin/designs");revalidatePath("/archive");redirect(url(undefined,true))}
export async function deleteDesignForever(fd:FormData){await destroy("designs",String(fd.get("id")??""));redirect(url(undefined,true))}
export async function restoreExperiment(fd:FormData){await restore("experiments",String(fd.get("id")??""),{visibility:"draft"});revalidatePath("/admin/lab");redirect(url(undefined,true))}
export async function deleteExperimentForever(fd:FormData){await destroy("experiments",String(fd.get("id")??""));redirect(url(undefined,true))}
export async function restoreService(fd:FormData){await restore("services",String(fd.get("id")??""),{enabled:false});revalidatePath("/admin/services");redirect(url(undefined,true))}
export async function deleteServiceForever(fd:FormData){await destroy("services",String(fd.get("id")??""));redirect(url(undefined,true))}
export async function restorePricing(fd:FormData){await restore("pricing_packages",String(fd.get("id")??""),{visibility:false});revalidatePath("/admin/pricing");redirect(url(undefined,true))}
export async function deletePricingForever(fd:FormData){await destroy("pricing_packages",String(fd.get("id")??""));redirect(url(undefined,true))}
export async function restoreTestimonial(fd:FormData){await restore("testimonials",String(fd.get("id")??""),{visibility:false});revalidatePath("/admin/testimonials");revalidatePath("/");redirect(url(undefined,true))}
export async function deleteTestimonialForever(fd:FormData){await destroy("testimonials",String(fd.get("id")??""));redirect(url(undefined,true))}
