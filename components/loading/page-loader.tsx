export function PageLoader({admin=false}:{admin?:boolean}){
 return <div className={`route-loader ${admin?"route-loader-admin":"route-loader-public"}`} role="status" aria-live="polite" aria-label="Loading page">
  <div className="route-loader-inner">
   <div className="global-loader-mark" aria-hidden="true">
    <span className="global-loader-ring global-loader-ring-a"/>
    <span className="global-loader-ring global-loader-ring-b"/>
    <span className="global-loader-core">W</span>
   </div>
   <p className="global-loader-label">{admin?"Loading Control Center":"WIKIS TECH"}</p>
   <div className="route-loader-track" aria-hidden="true"><span/></div>
   <span className="sr-only">Loading</span>
  </div>
 </div>;
}
