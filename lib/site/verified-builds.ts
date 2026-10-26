export type VerifiedBuild={
 slug:string;
 title:string;
 description:string;
 stack:string[];
 liveUrl:string;
 repoUrl:string;
 kind:string;
};

export const verifiedBuilds:VerifiedBuild[]=[
 {
  slug:"peecleanz",
  title:"Pee Cleanz",
  description:"Professional cleaning-services website focused on clear service presentation and conversion-oriented contact paths.",
  stack:["HTML","CSS","JavaScript"],
  liveUrl:"https://wikis-tech.github.io/peecleanz/",
  repoUrl:"https://github.com/Wikis-tech/peecleanz",
  kind:"Business website",
 },
 {
  slug:"mfm-gtch",
  title:"MFM Guitar Choir",
  description:"A public-facing worship-ministry website designed to present identity, ministry content and community information.",
  stack:["HTML","CSS","JavaScript"],
  liveUrl:"https://wikis-tech.github.io/mfm-gtch/",
  repoUrl:"https://github.com/Wikis-tech/mfm-gtch",
  kind:"Community website",
 },
 {
  slug:"offnot-energy",
  title:"Offnot Energy",
  description:"A clean-energy landing-page concept centred on solar energy and a clear commercial presentation.",
  stack:["HTML","CSS","JavaScript"],
  liveUrl:"https://wikis-tech.github.io/offnot-energy/",
  repoUrl:"https://github.com/Wikis-tech/offnot-energy",
  kind:"Landing page",
 },
 {
  slug:"just-food",
  title:"Just Food",
  description:"A premium restaurant landing-page concept with a visual, hospitality-focused presentation.",
  stack:["HTML","CSS","JavaScript"],
  liveUrl:"https://wikis-tech.github.io/just-food/",
  repoUrl:"https://github.com/Wikis-tech/just-food",
  kind:"Landing page",
 },
 {
  slug:"novatrade",
  title:"NovaTrade",
  description:"A brokerage-platform frontend concept exploring a polished financial-services landing-page experience.",
  stack:["HTML","CSS","JavaScript"],
  liveUrl:"https://wikis-tech.github.io/Novatrade/",
  repoUrl:"https://github.com/Wikis-tech/Novatrade",
  kind:"Fintech concept",
 },
 {
  slug:"legacy-portfolio",
  title:"Okoh Wisdom — Legacy Portfolio",
  description:"An earlier personal portfolio that established the sapphire visual identity now being evolved in this new portfolio system.",
  stack:["HTML","CSS","JavaScript"],
  liveUrl:"https://wikis-tech.github.io/wisdom-okoh/",
  repoUrl:"https://github.com/Wikis-tech/wisdom-okoh",
  kind:"Portfolio",
 },
];
