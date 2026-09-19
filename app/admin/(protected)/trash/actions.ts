"use server";
import {redirect} from "next/navigation";import {revalidatePath} from "next/cache";import {requireCmsUser} from "@/lib/auth/require-cms-user";import {createClient} from "@/lib/supabase/server";
async function admin(){const u=await requireCmsUser();if(u.role!=="admin")throw new Error("Admin access required.");return u}
async function restore(table:"projects"|"designs"|"experiments"|"services"|"pricing_packages",id:string,extra:Record<string,unknown>={}){const u=await admin(),s=await createClient();await s.from(table).update({deleted_at:null,updated_by:u.id,updated_at:new Date().toISOString(),...extra}).eq("id",id);revalidatePath("/admin/trash")}
async function destroy(table:"projects"|"designs"|"experiments"|"services"|"pricing_packages",id:string){await admin();const s=await createClient();await s.from(table).delete().eq("id",id);revalidatePath("/admin/trash")}
export async function restoreProject(fd:FormData){await restore("projects",String(fd.get("id")));revalidatePath("/admin/projects")}
export async function deleteProjectForever(fd:FormData){await destroy("projects",String(fd.get("id")))}
export async function restoreDesign(fd:FormData){await restore("designs",String(fd.get("id")));revalidatePath("/admin/designs");revalidatePath("/archive")}
export async function deleteDesignForever(fd:FormData){await destroy("designs",String(fd.get("id")))}
export async function restoreExperiment(fd:FormData){await restore("experiments",String(fd.get("id")),{visibility:"draft"});revalidatePath("/admin/lab")}
export async function deleteExperimentForever(fd:FormData){await destroy("experiments",String(fd.get("id")))}
export async function restoreService(fd:FormData){await restore("services",String(fd.get("id")),{enabled:false});revalidatePath("/admin/services")}
export async function deleteServiceForever(fd:FormData){await destroy("services",String(fd.get("id")))}
export async function restorePricing(fd:FormData){await restore("pricing_packages",String(fd.get("id")),{visibility:false});revalidatePath("/admin/pricing")}
export async function deletePricingForever(fd:FormData){await destroy("pricing_packages",String(fd.get("id")))}