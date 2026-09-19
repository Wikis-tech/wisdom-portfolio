import {z} from "zod";

const slug=z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120);
const internalOrHttps=z.string().trim().refine(v=>v.startsWith("/")||/^https:\/\//i.test(v),"Use an internal path or HTTPS URL.");
const optionalHttps=z.union([z.literal(""),z.string().url().refine(v=>v.startsWith("https://"),"HTTPS required.")]);

export const experimentInput=z.object({
 title:z.string().trim().min(2).max(140),slug,description:z.string().trim().max(1000),
 status:z.enum(["experiment","prototype","in_development","published","archived"]),
 visibility:z.enum(["draft","public","private","archived"]),
 technology:z.array(z.string().trim().min(1).max(60)).max(30),
 imageUrl:optionalHttps,videoUrl:optionalHttps,githubUrl:optionalHttps,demoUrl:optionalHttps,
 date:z.union([z.literal(""),z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]),
 caseStudy:z.string().max(20000),sortOrder:z.number().int().min(-10000).max(10000),featured:z.boolean()
});

export const serviceInput=z.object({
 title:z.string().trim().min(2).max(120),slug,shortDescription:z.string().trim().min(5).max(500),
 fullDescription:z.string().trim().max(6000),icon:z.string().trim().max(20),imageUrl:optionalHttps,
 startingPrice:z.number().min(0).max(1000000000).nullable(),currency:z.string().trim().regex(/^[A-Z]{3}$/),
 ctaLabel:z.string().trim().min(1).max(80),ctaUrl:internalOrHttps,
 featured:z.boolean(),enabled:z.boolean(),sortOrder:z.number().int().min(-10000).max(10000)
});

export const pricingInput=z.object({
 name:z.string().trim().min(2).max(100),subtitle:z.string().trim().max(120),currency:z.string().trim().regex(/^[A-Z]{3}$/),
 price:z.number().min(0).max(1000000000).nullable(),customQuote:z.boolean(),description:z.string().trim().max(2000),
 features:z.array(z.string().trim().min(1).max(180)).max(30),ctaText:z.string().trim().min(1).max(80),
 ctaUrl:internalOrHttps,featured:z.boolean(),visible:z.boolean(),sortOrder:z.number().int().min(-10000).max(10000)
});

export const nowInput=z.object({
 label:z.string().trim().min(1).max(40),text:z.string().trim().min(1).max(240),
 url:z.union([z.literal(""),internalOrHttps]),sortOrder:z.number().int().min(-10000).max(10000),visible:z.boolean()
});
