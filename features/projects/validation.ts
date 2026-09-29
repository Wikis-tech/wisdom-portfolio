import { z } from "zod";

const optionalText=(max:number)=>z.string().trim().max(max).optional();

export const projectSchema=z.object({
 title:z.string().trim().min(2).max(120),
 slug:z.preprocess(
  value=>String(value??"").trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""),
  z.string().min(1,"Enter a slug.").max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/,"Use letters, numbers and hyphens.")
 ),
 shortDescription:optionalText(500),
 problem:optionalText(4000),
 solution:optionalText(4000),
 whyItMattered:optionalText(4000),
 outcome:optionalText(4000),
 year:z.coerce.number().int().min(2000).max(2100).optional(),
 client:optionalText(120),
 role:optionalText(160),
 status:z.enum(["shipped","live","in_development","prototype","experiment","concept","archived"]),
 visibility:z.enum(["public","private"]),
 featured:z.boolean(),
 confidential:z.boolean(),
 liveUrl:z.union([z.string().url(),z.literal("")]).optional(),
 githubUrl:z.union([z.string().url(),z.literal("")]).optional(),
 seoTitle:optionalText(80),
 seoDescription:optionalText(320),
 seoImageUrl:z.union([z.string().url().refine(v=>v.startsWith("https://")),z.literal("")]).optional(),
 seoNoindex:z.boolean()
});

export const blockSchema=z.object({
 blockType:z.enum(["heading","paragraph","image","gallery","video","quote","stats","two_column","full_width_image","technology","before_after","embed","spacer","cta"]),
 content:z.string().max(12000)
});
