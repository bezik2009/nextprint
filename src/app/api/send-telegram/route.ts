/**
 * POST /api/send-telegram
 *
 * Accepts multipart/form-data with:
 *   "payload" — JSON string containing lead data
 *   "files"   — zero or more uploaded files (real binary)
 *
 * On valid submission:
 *   1. Sends Telegram notification (required — failure blocks user)
 *   2. Sends email with file attachments via Resend (best-effort)
 *
 * Required env vars:
 *   TELEGRAM_BOT_TOKEN       — bot token from @BotFather
 *   TELEGRAM_CHAT_ID         — target chat / channel ID
 *   RESEND_API_KEY           — Resend API key
 *   QUOTE_NOTIFICATION_EMAIL — recipient e.g. office@nextprint.com.ua
 *   QUOTE_FROM_EMAIL         — sender e.g. NextPrint <onboarding@resend.dev>
 */

import { NextRequest, NextResponse } from "next/server";

/* ── Constants ───────────────────────────────────────────────────────────── */

const MAX_FILES       = 5;
const MAX_FILE_BYTES  = 20 * 1024 * 1024;  // 20 MB per file
const MAX_TOTAL_BYTES = 50 * 1024 * 1024;  // 50 MB total
const ALLOWED_EXT     = new Set([
  "stl","step","stp","3mf","obj","zip","rar","pdf","dxf","png","jpg","jpeg",
]);

/* ── In-memory rate limiter ──────────────────────────────────────────────
 * MVP implementation — single instance only.
 * Replace with Upstash Redis / Vercel KV for multi-instance production.
 * ─────────────────────────────────────────────────────────────────────── */

const RATE_LIMIT_MAX      = 5;           // max submissions per window
const RATE_LIMIT_WINDOW   = 10 * 60 * 1000; // 10 minutes in ms

interface RateEntry { count: number; windowStart: number; }

// Module-level map — persists across requests within the same Node process
const rateLimitMap = new Map<string, RateEntry>();

function getClientIp(req: NextRequest): string {
  // Prefer the leftmost address in x-forwarded-for (original client IP)
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now  = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart >= RATE_LIMIT_WINDOW) {
    // First request or window has expired — start fresh
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count++;
  return false;
}

// Periodically prune stale entries to prevent unbounded memory growth.
// Runs at most once every 10 minutes, triggered by incoming requests.
let lastPruned = 0;
function pruneRateLimitMap(): void {
  const now = Date.now();
  if (now - lastPruned < RATE_LIMIT_WINDOW) return;
  lastPruned = now;
  for (const [ip, entry] of rateLimitMap) {
    if (now - entry.windowStart >= RATE_LIMIT_WINDOW) rateLimitMap.delete(ip);
  }
}



interface FileMeta {
  name: string;
  size: number;
  type: string;
}

interface ContactInfo {
  name:    string;
  company: string;
  email:   string;
  phone:   string;
  comment: string;
}

interface QuotePayload {
  step1_productionType: string;
  step2_fileFormat:     string;
  step3_quantity:       string;
  step4_size:           string;
  step4_sizePreset:     string;
  step5_useCase:        string;
  step5_useCaseOther:   string;
  step6_material:       string;
  step7_deadline:       string;
  step9_contact:        ContactInfo;
  _hp?:                 string;
}

/* ── Label maps ──────────────────────────────────────────────────────────── */

const PRODUCTION_TYPE: Record<string,string> = {
  prototype:     "Прототип",
  "small-batch": "Мала серія (1–100 шт.)",
  "medium-batch":"Середня серія (100–1000 шт.)",
  regular:       "Регулярне виробництво",
};
const FILE_FORMAT: Record<string,string> = {
  stl:"STL", step:"STEP", "3mf":"3MF",
  drawing:"Креслення", photo:"Фото", "need-modeling":"Потрібно змоделювати",
};
const USE_CASE: Record<string,string> = {
  electronics:"Корпус електроніки", robotics:"Робототехніка",
  automotive:"Автомобіль", industrial:"Промисловість",
  household:"Побут", other:"Інше",
};
const MATERIAL: Record<string,string> = {
  pla:"PLA", petg:"PETG", abs:"ABS", asa:"ASA", tpu:"TPU",
  nylon:"Nylon", pc:"PC (Полікарбонат)", pctg:"PCTG",
  unknown:"Не знаю (підбір матеріалу)",
};
const DEADLINE: Record<string,string> = {
  urgent:"🔴 Терміново (1–2 дні)", "3-5-days":"🟡 3–5 днів",
  week:"🟢 До тижня", flexible:"⚪ Не поспішає",
};
const DEADLINE_PLAIN: Record<string,string> = {
  urgent:"Терміново (1–2 дні)", "3-5-days":"3–5 днів",
  week:"До тижня", flexible:"Не поспішає",
};
const SIZE_PRESET: Record<string,string> = {
  xs:"до 5 см", sm:"5–15 см", md:"15–30 см", lg:"більше 30 см",
};

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function esc(s: string): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
function escHtml(s: string): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
          .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}
function fmtBytes(n: number): string {
  return n > 1024*1024 ? `${(n/1024/1024).toFixed(1)} МБ` : `${Math.round(n/1024)} КБ`;
}
function tgRow(label: string, value: string): string {
  return value.trim() ? `<b>${esc(label)}:</b> ${esc(value)}\n` : "";
}

/* ── Request ID ──────────────────────────────────────────────────────────── */

function generateRequestId(): string {
  const date   = new Date().toISOString().slice(0,10).replace(/-/g,"");
  const chars  = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const suffix = Array.from({length:4}, () => chars[Math.floor(Math.random()*chars.length)]).join("");
  return `NP-${date}-${suffix}`;
}

/* ── File validation ─────────────────────────────────────────────────────── */

function extOf(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

function validateFiles(files: File[]): { ok: true } | { ok: false; error: string } {
  if (files.length > MAX_FILES)
    return { ok:false, error: `Максимум ${MAX_FILES} файлів` };

  let total = 0;
  for (const f of files) {
    if (!ALLOWED_EXT.has(extOf(f.name)))
      return { ok:false, error: `Недозволений тип файлу: ${extOf(f.name)}` };
    if (f.size > MAX_FILE_BYTES)
      return { ok:false, error: `Файл ${f.name} перевищує 20 МБ` };
    total += f.size;
  }
  if (total > MAX_TOTAL_BYTES)
    return { ok:false, error: "Загальний розмір файлів перевищує 50 МБ" };

  return { ok:true };
}

/* ── Telegram message builder ────────────────────────────────────────────── */

function buildTelegramMessage(d: QuotePayload, files: FileMeta[], requestId: string): string {
  const c = d.step9_contact;
  const sizeDisplay = d.step4_size
    ? `${d.step4_size} мм`
    : d.step4_sizePreset ? (SIZE_PRESET[d.step4_sizePreset] ?? d.step4_sizePreset) : "";

  const useCaseDisplay =
    d.step5_useCase === "other" && d.step5_useCaseOther
      ? `Інше — ${d.step5_useCaseOther}`
      : USE_CASE[d.step5_useCase] ?? d.step5_useCase;

  const filesBlock = files.length === 0
    ? "Файли не прикріплено"
    : files.map(f => `• ${esc(f.name)} (${fmtBytes(f.size)})`).join("\n");

  return [
    "📦 <b>НОВА ЗАЯВКА — NextPrint</b>\n",
    `🆔 <b>ID заявки:</b> <code>${esc(requestId)}</code>\n`,
    "<b>━━━ Замовлення ━━━</b>",
    tgRow("Тип виробництва",    PRODUCTION_TYPE[d.step1_productionType] ?? d.step1_productionType),
    tgRow("Файл / Модель",      FILE_FORMAT[d.step2_fileFormat] ?? d.step2_fileFormat),
    tgRow("Кількість",          d.step3_quantity ? `${d.step3_quantity} шт.` : ""),
    tgRow("Розмір деталі",      sizeDisplay),
    tgRow("Сфера застосування", useCaseDisplay),
    tgRow("Матеріал",           MATERIAL[d.step6_material] ?? d.step6_material),
    tgRow("Дедлайн",            DEADLINE[d.step7_deadline] ?? d.step7_deadline),
    "",
    "<b>━━━ Файли ━━━</b>",
    filesBlock,
    "",
    "<b>━━━ Контакти ━━━</b>",
    tgRow("Імʼя",    c.name),
    tgRow("Компанія",c.company),
    tgRow("Email",   c.email),
    tgRow("Телефон", c.phone),
    c.comment.trim() ? `\n<b>Коментар:</b>\n${esc(c.comment.trim())}` : "",
  ].join("\n").replace(/\n{3,}/g,"\n\n").trim();
}

/* ── Email HTML builder ──────────────────────────────────────────────────── */

function buildEmailHtml(d: QuotePayload, files: FileMeta[], requestId: string): string {
  const c = d.step9_contact;
  const sizeDisplay = d.step4_size
    ? `${d.step4_size} мм`
    : d.step4_sizePreset ? (SIZE_PRESET[d.step4_sizePreset] ?? d.step4_sizePreset) : "—";

  const useCaseDisplay =
    d.step5_useCase === "other" && d.step5_useCaseOther
      ? `Інше — ${escHtml(d.step5_useCaseOther)}`
      : escHtml(USE_CASE[d.step5_useCase] ?? d.step5_useCase);

  const filesHtml = files.length === 0
    ? "<p style='margin:0;color:#888;'>Файли не прикріплено</p>"
    : files.map(f =>
        `<div style='margin-bottom:4px;'>📎 ${escHtml(f.name)} <span style='color:#888;font-size:12px;'>${fmtBytes(f.size)}${f.type ? ` · ${escHtml(f.type)}` : ""}</span></div>`
      ).join("");

  const eRow = (label: string, value: string) =>
    value.trim()
      ? `<tr><td style='padding:6px 12px 6px 0;color:#888;font-size:13px;white-space:nowrap;vertical-align:top;'>${escHtml(label)}</td><td style='padding:6px 0;font-size:14px;color:#1a1a1a;'>${escHtml(value)}</td></tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="uk">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">
  <tr><td style="background:#020B16;padding:24px 32px;">
    <p style="margin:0;color:#F5C400;font-size:18px;font-weight:700;letter-spacing:.05em;">NEXTPRINT</p>
    <p style="margin:6px 0 0;color:rgba(255,255,255,.55);font-size:13px;">Нова заявка з сайту</p>
  </td></tr>
  <tr><td style="background:#F5C400;padding:10px 32px;">
    <p style="margin:0;font-size:13px;font-weight:700;color:#020B16;letter-spacing:.08em;">ID ЗАЯВКИ: ${escHtml(requestId)}</p>
  </td></tr>
  <tr><td style="padding:28px 32px;">
    <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#888;">Замовлення</p>
    <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
      ${eRow("Тип виробництва",    PRODUCTION_TYPE[d.step1_productionType] ?? d.step1_productionType)}
      ${eRow("Файл / Модель",      FILE_FORMAT[d.step2_fileFormat] ?? d.step2_fileFormat)}
      ${eRow("Кількість",          d.step3_quantity ? `${d.step3_quantity} шт.` : "")}
      ${eRow("Розмір деталі",      sizeDisplay)}
      ${eRow("Сфера застосування", useCaseDisplay)}
      ${eRow("Матеріал",           MATERIAL[d.step6_material] ?? d.step6_material)}
      ${eRow("Дедлайн",            DEADLINE_PLAIN[d.step7_deadline] ?? d.step7_deadline)}
    </table>
    <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
    <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#888;">Файли</p>
    ${filesHtml}
    <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
    <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#888;">Контакти</p>
    <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
      ${eRow("Імʼя",    c.name)}
      ${eRow("Компанія",c.company)}
      ${eRow("Email",   c.email)}
      ${eRow("Телефон", c.phone)}
    </table>
    ${c.comment.trim() ? `
    <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#888;">Коментар</p>
    <p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.6;white-space:pre-wrap;">${escHtml(c.comment.trim())}</p>` : ""}
  </td></tr>
  <tr><td style="background:#f9f9f9;padding:16px 32px;border-top:1px solid #eee;">
    <p style="margin:0;font-size:12px;color:#aaa;">nextprint.com.ua · автоматичне повідомлення</p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

/* ── Email sender (Resend) ───────────────────────────────────────────────── */

interface ResendAttachment {
  filename: string;
  content:  string; // base64
}

async function sendEmail(
  d: QuotePayload,
  files: Array<{ meta: FileMeta; buffer: ArrayBuffer }>,
  requestId: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to     = process.env.QUOTE_NOTIFICATION_EMAIL;
  const from   = process.env.QUOTE_FROM_EMAIL ?? "NextPrint <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.warn("[send-email] RESEND_API_KEY or QUOTE_NOTIFICATION_EMAIL not set — skipping");
    return;
  }

  const attachments: ResendAttachment[] = files.map(({ meta, buffer }) => ({
    filename: meta.name,
    content:  Buffer.from(buffer).toString("base64"),
  }));

  const res = await fetch("https://api.resend.com/emails", {
    method:  "POST",
    headers: { "Content-Type":"application/json", "Authorization":`Bearer ${apiKey}` },
    body: JSON.stringify({
      from,
      to,
      subject:     `Нова заявка NextPrint — ${requestId}`,
      html:        buildEmailHtml(d, files.map(f => f.meta), requestId),
      attachments,
    }),
  });

  if (!res.ok) {
    console.error(`[send-email] Resend HTTP ${res.status}`);
  }
}

/* ── Telegram document sender (best-effort) ──────────────────────────────── */

/**
 * Sends each uploaded file to the Telegram chat as a document.
 * Called after sendMessage succeeds — fires best-effort, never blocks the user.
 * Telegram limits: 50 MB per document via Bot API.
 */
async function sendTelegramDocuments(
  token:     string,
  chatId:    string,
  files:     Array<{ meta: FileMeta; buffer: ArrayBuffer }>,
  requestId: string,
): Promise<void> {
  if (files.length === 0) return;

  console.log(`[send-telegram-doc] ${requestId} — sending ${files.length} file(s)`);

  const url = `https://api.telegram.org/bot${token}/sendDocument`;

  for (const { meta, buffer } of files) {
    try {
      console.log(`[send-telegram-doc] ${requestId} — uploading "${meta.name}" (${fmtBytes(meta.size)})`);

      const form = new FormData();
      form.append("chat_id", chatId);
      form.append("caption", `Файл до заявки ${requestId}: ${meta.name}`);
      // Blob + filename as third arg is required for multipart/form-data filename param.
      // Do NOT set Content-Type manually — browser/node sets multipart boundary automatically.
      form.append(
        "document",
        new Blob([buffer], { type: meta.type || "application/octet-stream" }),
        meta.name,
      );

      const res = await fetch(url, { method: "POST", body: form });

      if (res.ok) {
        console.log(`[send-telegram-doc] ${requestId} — "${meta.name}" sent OK (${res.status})`);
      } else {
        // Read Telegram's JSON error body to get the description
        let tgDescription = "(could not parse body)";
        try {
          const body = await res.json() as { ok: boolean; description?: string };
          tgDescription = body.description ?? tgDescription;
        } catch {
          // ignore parse failure
        }
        console.error(
          `[send-telegram-doc] ${requestId} — "${meta.name}" failed:`,
          `HTTP ${res.status} —`, tgDescription,
        );
      }
    } catch (err) {
      console.error(
        `[send-telegram-doc] ${requestId} — "${meta.name}" network error:`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  console.log(`[send-telegram-doc] ${requestId} — done`);
}



export async function POST(req: NextRequest): Promise<NextResponse> {
  pruneRateLimitMap();

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests" },
      { status: 429 }
    );
  }

  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("[send-telegram] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return NextResponse.json({ success:false, error:"Server misconfiguration" }, { status:500 });
  }

  // ── Parse multipart/form-data ──────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ success:false, error:"Invalid form data" }, { status:400 });
  }

  const payloadRaw = formData.get("payload");
  if (typeof payloadRaw !== "string") {
    return NextResponse.json({ success:false, error:"Missing payload field" }, { status:400 });
  }

  let payload: QuotePayload;
  try {
    payload = JSON.parse(payloadRaw) as QuotePayload;
  } catch {
    return NextResponse.json({ success:false, error:"Invalid JSON payload" }, { status:400 });
  }

  // ── Honeypot ───────────────────────────────────────────────────────────
  if (payload._hp && payload._hp.trim().length > 0) {
    return NextResponse.json({ success:true });
  }

  // ── Collect and validate files ─────────────────────────────────────────
  const rawFiles = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);

  const validation = validateFiles(rawFiles);
  if (!validation.ok) {
    return NextResponse.json({ success:false, error: validation.error }, { status:400 });
  }

  // Read buffers while we have them (streams can't be re-read)
  const fileData = await Promise.all(
    rawFiles.map(async (f) => ({
      meta:   { name: f.name, size: f.size, type: f.type } as FileMeta,
      buffer: await f.arrayBuffer(),
    }))
  );

  const requestId = generateRequestId();

  // ── 1. Telegram (required) ─────────────────────────────────────────────
  const fileMetas = fileData.map(f => f.meta);

  let tgRes: Response;
  try {
    tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method:  "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({
        chat_id:                  chatId,
        text:                     buildTelegramMessage(payload, fileMetas, requestId),
        parse_mode:               "HTML",
        disable_web_page_preview: true,
      }),
    });
  } catch (err) {
    console.error("[send-telegram] Network error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ success:false, error:"Failed to reach Telegram API" }, { status:502 });
  }

  if (!tgRes.ok) {
    console.error(`[send-telegram] Telegram API error ${tgRes.status}`);
    return NextResponse.json({ success:false, error:`Telegram error ${tgRes.status}` }, { status:502 });
  }

  // ── 2. Telegram documents (best-effort — does not block user response) ──
  sendTelegramDocuments(token, chatId, fileData, requestId).catch((err: unknown) => {
    console.error("[send-telegram-doc] Unexpected error:", err instanceof Error ? err.message : err);
  });

  // ── 3. Email via Resend with real attachments (best-effort) ────────────
  sendEmail(payload, fileData, requestId).catch((err: unknown) => {
    console.error("[send-email] Unexpected error:", err instanceof Error ? err.message : err);
  });

  return NextResponse.json({ success:true, requestId });
}
