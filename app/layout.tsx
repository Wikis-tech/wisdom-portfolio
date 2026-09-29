import type {Metadata} from "next";
import Script from "next/script";
import "./globals.css";
import {AnalyticsBridge} from "@/components/analytics/analytics-bridge";
import {getAnalyticsSettings,getSiteSettings,siteOrigin} from "@/lib/site/content";
import {MotionController} from "@/components/portfolio/motion-controller";

export async function generateMetadata():Promise<Metadata>{
 const site=await getSiteSettings();
 const origin=siteOrigin(site);
 const description="Websites, digital products and intelligent tools built with software, design, AI and strategy.";
 return {
  metadataBase:new URL(origin),
  title:{default:`${site.professional_name} — ${site.nav_brand_name}`,template:`%s | ${site.nav_brand_name}`},
  description,
  applicationName:site.brand_name,
  creator:site.professional_name,
  authors:[{name:site.professional_name,url:origin}],
  alternates:{canonical:origin},
  icons:site.favicon_url?{icon:site.favicon_url,shortcut:site.favicon_url}:undefined,
  openGraph:{type:"website",siteName:site.brand_name,title:`${site.professional_name} — ${site.nav_brand_name}`,description,url:origin},
  twitter:{card:"summary",title:`${site.professional_name} — ${site.nav_brand_name}`,description},
 };
}

export default async function RootLayout({children}:Readonly<{children:React.ReactNode}>){
 const analytics=await getAnalyticsSettings();
 const ga=analytics.enabled&&analytics.provider==="google_analytics"&&analytics.measurement_id?analytics.measurement_id:null;
 return <html lang="en"><body>
  <MotionController/>
  {children}
  {ga?<><Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive"/><Script id="wikis-tech-ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true});`}</Script></>:null}
  <AnalyticsBridge settings={analytics}/>
 </body></html>
}
