"use client";

import {useSearchParams} from "next/navigation";

export function AdminQueryNotice(){
 const params=useSearchParams();
 const error=params.get("error");
 const saved=params.get("saved");
 const trashed=params.get("trashed");
 if(!error&&!saved&&!trashed)return null;
 if(error)return <div role="alert" className="mb-6 rounded-xl border border-red-400/20 bg-red-400/[.06] px-4 py-3 text-sm leading-6 text-red-100"><strong className="font-semibold">Could not complete that action.</strong><span className="ml-2 text-red-100/80">{error}</span></div>;
 return <div role="status" className="mb-6 rounded-xl border border-emerald-400/20 bg-emerald-400/[.06] px-4 py-3 text-sm text-emerald-100">{trashed?"Moved to Trash successfully.":"Changes saved successfully."}</div>;
}
