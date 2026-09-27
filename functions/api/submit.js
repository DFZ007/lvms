// Cloudflare Pages Function: POST /api/submit
// Emails every website form to the school (admin@lasvegasmusicschools.com by default)
// through Resend (https://resend.com). Set these in Cloudflare Pages →
// Settings → Variables and secrets:
//   RESEND_API_KEY  (secret, required)  API key from resend.com
//   MAIL_FROM       (required)          e.g. "LVMS Website <website@lasvegasmusicschools.com>"
//                                       The domain must be verified in Resend.
//   MAIL_TO         (optional)          defaults to admin@lasvegasmusicschools.com
//   AUTOREPLY       (optional)          "on" sends the family a short confirmation email
//   RESEND_URL      (optional)          override the API URL (for local testing only)

const DEFAULT_TO = 'admin@lasvegasmusicschools.com';
const MAX_BODY = 20000;

const LABELS = {
  name: 'Name', email: 'Email', phone: 'Phone', instrument: 'Instrument',
  b_name: 'Name', b_email: 'Email', b_phone: 'Phone', b_instr: 'Instrument',
  c_name: 'Name', c_email: 'Email', c_phone: 'Phone', c_who: 'I am', c_pref: 'Best way to reach',
  c_msg: 'Message', c_instr: 'Instrument', c_studio: 'Studio', c_age: 'Student age group',
  d_name: 'First name', d_email: 'Email', d_instr: 'Instrument', d_age: 'Student', d_optin: 'News opt-in',
  gc_from: 'From', gc_fromemail: 'Buyer email', gc_to: 'Recipient', gc_toemail: 'Recipient email',
  rel: 'Relationship', agree: 'Agreed to terms', years: 'Years of study', who: 'Contact is', rec: 'Recording link', needs: 'Learning needs',
  gc_del: 'Delivery', gc_date: 'Send on', gc_note: 'Note', gc_opt: 'Gift', gc_amt: 'Custom amount',
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const label = (k) => LABELS[k] || k.replace(/^[a-z]{1,2}_/, '').replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

function firstEmail(fields) {
  for (const k of Object.keys(fields)) {
    if (/email/i.test(k) && !/toemail/i.test(k) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields[k])) return fields[k].trim();
  }
  return null;
}
function firstName(fields) {
  for (const k of ['b_name', 'c_name', 'd_name', 'gc_from', 'name', 'first_name']) if (fields[k]) return String(fields[k]).trim().split(/\s+/)[0];
  for (const k of Object.keys(fields)) if (/name/i.test(k) && !/student|to$|last/i.test(k) && fields[k]) return String(fields[k]).trim().split(/\s+/)[0];
  return '';
}

async function sendMail(env, msg) {
  const r = await fetch(env.RESEND_URL || 'https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(msg),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
}

export async function onRequestPost({ request, env }) {
  if (!env.RESEND_API_KEY || !env.MAIL_FROM) return json({ ok: false, error: 'Email is not configured' }, 500);
  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ ok: false, error: 'Too large' }, 413);
  let body;
  try { body = JSON.parse(raw); } catch { return json({ ok: false, error: 'Bad request' }, 400); }

  const type = String(body.type || 'Website form').slice(0, 60);
  const fields = Object.fromEntries(Object.entries(body.fields || {}).map(([k, v]) => [String(k).slice(0, 40), v === 'on' ? 'Yes' : String(v).slice(0, 4000)]));
  const extra = Object.fromEntries(Object.entries(body.extra || {}).filter(([, v]) => v).map(([k, v]) => [String(k).slice(0, 40), String(v).slice(0, 500)]));

  // Spam: the hidden "company" field is only ever filled in by bots. Pretend success.
  if (fields.company) return json({ ok: true });
  delete fields.company;

  const reply = firstEmail(fields);
  if (!reply) return json({ ok: false, error: 'A valid email is required' }, 422);

  const hidden = /^(utm_|gclid|fbclid|landing_page|referrer)/;
  const rows = [...Object.entries(extra), ...Object.entries(fields).filter(([k]) => !hidden.test(k)).map(([k, v]) => [label(k), v])];
  const track = Object.entries(fields).filter(([k]) => hidden.test(k));
  const who = firstName(fields) || reply;
  const page = String(body.page || '').slice(0, 200);
  const when = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles', dateStyle: 'medium', timeStyle: 'short' });

  const html = `<div style="font:15px/1.5 Arial,sans-serif;color:#1E180F;max-width:620px">
<h2 style="font:600 18px Arial,sans-serif;margin:0 0 4px">${esc(type)}</h2>
<p style="margin:0 0 16px;color:#6b5e49">From ${esc(who)} · ${esc(when)} (Las Vegas time) · page ${esc(page)}</p>
<table style="border-collapse:collapse;width:100%">${rows.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;border-bottom:1px solid #eee;color:#6b5e49;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;border-bottom:1px solid #eee;white-space:pre-wrap">${esc(v)}</td></tr>`).join('')}</table>
${track.length ? `<p style="margin:16px 0 0;font-size:12px;color:#999">${track.map(([k, v]) => `${esc(k)}: ${esc(v)}`).join(' · ')}</p>` : ''}
<p style="margin:16px 0 0;font-size:13px;color:#6b5e49">Reply to this email to answer ${esc(who)} directly.</p></div>`;
  const text = `${type}\nFrom ${who} · ${when} · ${page}\n\n` + rows.map(([k, v]) => `${k}: ${v}`).join('\n') + (track.length ? '\n\n' + track.map(([k, v]) => `${k}: ${v}`).join(' · ') : '');

  try {
    await sendMail(env, {
      from: env.MAIL_FROM,
      to: [env.MAIL_TO || DEFAULT_TO],
      reply_to: reply,
      subject: `${type}: ${who}${extra['Requested time'] ? ' · ' + extra['Requested time'] : ''}`,
      html, text,
    });
  } catch (e) {
    console.error(e);
    return json({ ok: false, error: 'Could not send' }, 502);
  }

  if ((env.AUTOREPLY || '').toLowerCase() === 'on' && type !== 'Newsletter sign-up') {
    const first = firstName(fields);
    const lines = {
      'Assessment request': 'Thank you for requesting a complimentary Initial Assessment. We will contact you shortly to confirm the day, time and studio. Your time is not final until you hear from us.',
      'Gift card order': 'Thank you for your gift card order. We will email you a secure payment link shortly. The gift card is sent once payment is complete.',
      'Curriculum guide request': 'Thank you for requesting the Las Vegas Music School curriculum guide. We will send it to you shortly.',
    };
    const msg = lines[type] || 'Thank you for contacting Las Vegas Music School. A member of our team will get back to you soon.';
    try {
      await sendMail(env, {
        from: env.MAIL_FROM,
        to: [reply],
        reply_to: env.MAIL_TO || DEFAULT_TO,
        subject: 'We received your message · Las Vegas Music School',
        text: `${first ? 'Hi ' + first + ',\n\n' : ''}${msg}\n\nNeed us sooner? Call (702) 518-1081.\n\nLas Vegas Music School\nhttps://www.lasvegasmusicschools.com`,
      });
    } catch (e) { console.error('autoreply', e); }
  }
  return json({ ok: true });
}

export function onRequest({ request }) {
  return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
}
