import {getNavigation,getSiteSettings} from "@/lib/site/content";
import {PublicNavClient} from "@/components/portfolio/public-nav-client";

export async function PublicNav(){
 const [items,site]=await Promise.all([getNavigation("header"),getSiteSettings()]);
 return <PublicNavClient items={items} brand={site.nav_brand_name} logoUrl={site.logo_url}/>;
}
