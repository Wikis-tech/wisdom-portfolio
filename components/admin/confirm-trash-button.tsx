"use client";
export function ConfirmTrashButton({label="Move to Trash"}:{label?:string}){
 return <button type="submit" onClick={e=>{if(!window.confirm("Move this item to Trash? It will be hidden from your public portfolio and can be restored later."))e.preventDefault();}} className="rounded-lg border border-red-400/20 px-3 py-2 text-xs text-red-200 hover:bg-red-400/10">{label}</button>;
}
