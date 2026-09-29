import { createClient } from "npm:@supabase/supabase-js@2.116.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, authorization, x-client-info, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

const clean = (v: FormDataEntryValue | null, max: number) =>
  String(v ?? "").trim().replace(/[\u0000-\u001f\u007f]/g, "").slice(0, max);

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254;

const safeFileName = (name: string) => {
  const parts = name.toLowerCase().split(".");
  const ext = parts.length > 1 ? parts.pop()!.replace(/[^a-z0-9]/g, "") : "";
  const base = parts.join(".").replace(/[^a-z0-9-_]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "brief";
  return ext ? `${base}.${ext}` : base;
};

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function ipFrom(req: Request) {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json({ ok: false, message: "Method not allowed." }, 405);

  const url = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRole) return json({ ok: false, message: "Service unavailable." }, 503);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ ok: false, message: "Invalid form submission." }, 400);
  }

  const kind = clean(form.get("kind"), 20);
  const honeypot = clean(form.get("companyWebsite"), 300);
  if (honeypot) return json({ ok: true, message: "Thanks — your message was received." }, 202);
  if (kind !== "contact" && kind !== "quote") return json({ ok: false, message: "Invalid submission type." }, 400);

  const supabase = createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const ip = ipFrom(req);
  const email = clean(form.get("email"), 254).toLowerCase();
  if (!emailOk(email)) return json({ ok: false, message: "Enter a valid email address." }, 400);

  const ipHash = await sha256(`${kind}:ip:${ip}`);
  const emailHash = await sha256(`${kind}:email:${email}`);
  const limits = kind === "quote"
    ? [{ key: ipHash, max: 3, secs: 21600 }, { key: emailHash, max: 2, secs: 21600 }]
    : [{ key: ipHash, max: 5, secs: 3600 }, { key: emailHash, max: 3, secs: 3600 }];

  for (const limit of limits) {
    const { data, error } = await supabase.rpc("consume_form_rate_limit", {
      p_key_hash: limit.key,
      p_limit: limit.max,
      p_window_seconds: limit.secs,
    });
    if (error) return json({ ok: false, message: "Could not process the request safely." }, 503);
    if (!data) return json({ ok: false, message: "Too many requests. Please try again later." }, 429);
  }

  if (kind === "contact") {
    const name = clean(form.get("name"), 120);
    const subject = clean(form.get("subject"), 180);
    const message = clean(form.get("message"), 5000);
    if (name.length < 2 || subject.length < 2 || message.length < 10) {
      return json({ ok: false, message: "Please complete all required fields." }, 400);
    }

    const duplicateHash = await sha256(`contact:duplicate:${email}:${subject.toLowerCase()}:${message.toLowerCase()}`);
    const { data: dupOk } = await supabase.rpc("consume_form_rate_limit", {
      p_key_hash: duplicateHash,
      p_limit: 1,
      p_window_seconds: 600,
    });
    if (!dupOk) return json({ ok: true, message: "Thanks — your message was received." }, 202);

    const { error } = await supabase.from("contact_messages").insert({
      name, email, subject, message, status: "unread", source: "portfolio",
    });
    if (error) return json({ ok: false, message: "Your message could not be saved. Please try again." }, 500);
    return json({ ok: true, message: "Message sent. I’ll get back to you as soon as I can." }, 201);
  }

  const name = clean(form.get("name"), 120);
  const phone = clean(form.get("phone"), 40);
  const projectType = clean(form.get("projectType"), 40);
  const description = clean(form.get("description"), 8000);
  const budget = clean(form.get("budget"), 40);
  const timeline = clean(form.get("timeline"), 180);
  const contactMethod = clean(form.get("contactMethod"), 20) || "email";

  const projectTypes = new Set(["website","web_application","ui_ux","brand_graphics","ai_solution","business_technology","other"]);
  const budgets = new Set(["","under_100k","100k_300k","300k_750k","750k_plus","discuss"]);
  const contactMethods = new Set(["email","whatsapp","phone"]);

  if (name.length < 2 || description.length < 20 || !projectTypes.has(projectType) || !budgets.has(budget) || !contactMethods.has(contactMethod)) {
    return json({ ok: false, message: "Please review the quote details and try again." }, 400);
  }

  const duplicateHash = await sha256(`quote:duplicate:${email}:${projectType}:${description.toLowerCase()}`);
  const { data: dupOk } = await supabase.rpc("consume_form_rate_limit", {
    p_key_hash: duplicateHash,
    p_limit: 1,
    p_window_seconds: 1800,
  });
  if (!dupOk) return json({ ok: true, message: "Your request is already in the queue." }, 202);

  let attachment: null | {
    attachment_bucket: string;
    attachment_path: string;
    attachment_name: string;
    attachment_mime: string;
    attachment_size: number;
  } = null;

  const fileValue = form.get("brief");
  if (fileValue instanceof File && fileValue.size > 0) {
    const allowed = new Map([
      ["application/pdf", new Set(["pdf"])],
      ["image/jpeg", new Set(["jpg","jpeg"])],
      ["image/png", new Set(["png"])],
      ["image/webp", new Set(["webp"])],
    ]);
    const safe = safeFileName(fileValue.name);
    const ext = safe.includes(".") ? safe.split(".").pop()! : "";
    if (fileValue.size > 10 * 1024 * 1024 || !allowed.has(fileValue.type) || !allowed.get(fileValue.type)!.has(ext)) {
      return json({ ok: false, message: "Brief must be PDF, JPG, PNG or WebP and no larger than 10 MB." }, 400);
    }

    const requestId = crypto.randomUUID();
    const storagePath = `quotes/${requestId}/${crypto.randomUUID()}-${safe}`;
    const { error: uploadError } = await supabase.storage
      .from("portfolio-private")
      .upload(storagePath, fileValue, { contentType: fileValue.type, upsert: false, cacheControl: "3600" });

    if (uploadError) return json({ ok: false, message: "The brief could not be uploaded." }, 500);

    attachment = {
      attachment_bucket: "portfolio-private",
      attachment_path: storagePath,
      attachment_name: fileValue.name.slice(0, 180),
      attachment_mime: fileValue.type,
      attachment_size: fileValue.size,
    };
  }

  const payload = {
    name,
    email,
    phone: phone || null,
    project_type: projectType,
    description,
    budget: budget || null,
    timeline: timeline || null,
    contact_method: contactMethod,
    status: "new",
    ...(attachment ?? {}),
  };

  const { error: insertError } = await supabase.from("quote_requests").insert(payload);
  if (insertError) {
    if (attachment) await supabase.storage.from("portfolio-private").remove([attachment.attachment_path]);
    return json({ ok: false, message: "Your quote request could not be saved. Please try again." }, 500);
  }

  return json({ ok: true, message: "Quote request received. I’ll review the scope and get back to you." }, 201);
});
