import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface NotificationEmail {
  to: string;
  recipientName?: string;
  title: string;
  message: string;
  linkUrl?: string;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]!);
}

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private readonly resendApiKey: string;
  private readonly from: string;
  private readonly frontendUrl: string;

  constructor(config: ConfigService) {
    this.resendApiKey = config.get<string>("RESEND_API_KEY")?.trim() || "";
    this.from = config.get<string>("MAIL_FROM")?.trim() || "";
    this.frontendUrl = config.get<string>("FRONTEND_URL") || "http://localhost:3000";
  }

  onModuleInit() {
    if (!this.resendApiKey || !this.from) {
      this.logger.warn("Email notifikasi nonaktif: atur RESEND_API_KEY dan MAIL_FROM pada environment.");
    }
  }

  async sendNotificationEmail(input: NotificationEmail) {
    if (!this.resendApiKey || !this.from || !input.to) return;

    const title = escapeHtml(input.title);
    const recipientName = escapeHtml(input.recipientName?.trim() || "Pengguna NEXIERA");
    const message = escapeHtml(input.message).replace(/\r?\n/g, "<br />");
    const actionUrl = this.resolveActionUrl(input.linkUrl);
    const action = actionUrl
      ? `<tr><td align="center" style="padding:24px 32px 8px"><a href="${escapeHtml(actionUrl)}" style="display:inline-block;background:#2457c5;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:700;padding:13px 22px;border-radius:6px">Buka NEXIERA</a></td></tr>`
      : "";
    const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${title}</title><style>@media only screen and (max-width:600px){.mail-card{width:100%!important}.mail-pad{padding-left:22px!important;padding-right:22px!important}.mail-title{font-size:22px!important}}</style></head><body style="margin:0;background:#f3f6fb;padding:28px 12px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse"><tr><td align="center"><table role="presentation" class="mail-card" width="560" cellspacing="0" cellpadding="0" style="width:560px;max-width:100%;border-collapse:separate;border-spacing:0;background:#ffffff;border:1px solid #dfe5ef;border-radius:10px;overflow:hidden"><tr><td style="height:6px;background:#2457c5;font-size:0;line-height:0">&nbsp;</td></tr><tr><td class="mail-pad" style="padding:25px 36px 18px"><div style="font-family:Arial,sans-serif;font-size:20px;font-weight:800;letter-spacing:1.4px;color:#17233d">NEXIERA</div><div style="margin-top:5px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#6c7890">BELAJAR BERSAMA, BERTUMBUH BERSAMA</div></td></tr><tr><td class="mail-pad" style="padding:14px 36px 0"><div style="font-family:Arial,sans-serif;font-size:13px;color:#596579">Halo ${recipientName},</div><h1 class="mail-title" style="margin:12px 0 0;font-family:Arial,sans-serif;font-size:25px;line-height:1.3;color:#17233d">${title}</h1></td></tr><tr><td class="mail-pad" style="padding:18px 36px 10px"><div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:#455166">${message}</div></td></tr>${action}<tr><td class="mail-pad" style="padding:26px 36px 24px"><div style="border-top:1px solid #e8edf4;padding-top:17px;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#7a8496">Email ini dikirim otomatis oleh NEXIERA ke alamat email akun utama Anda. Balas email ini jika Anda memerlukan bantuan.</div></td></tr></table><div style="padding:16px 8px;font-family:Arial,sans-serif;font-size:11px;color:#8993a3;text-align:center">© ${new Date().getFullYear()} NEXIERA</div></td></tr></table></body></html>`;

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${this.resendApiKey}`,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          from: this.from,
          to: [input.to],
          subject: input.title,
          html,
          text: `${input.title}\n\nHalo ${input.recipientName || "Pengguna NEXIERA"},\n\n${input.message}\n\nEmail ini dikirim otomatis oleh NEXIERA.`,
        }),
        signal: AbortSignal.timeout(8_000),
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        this.logger.error(`Gagal mengirim notifikasi email ke ${input.to}: Resend HTTP ${response.status} ${detail}`);
      }
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      this.logger.error(`Gagal mengirim notifikasi email ke ${input.to}: ${detail}`);
    }
  }

  async sendVerificationEmail(to: string, recipientName: string, verificationUrl: string) {
    if (!this.resendApiKey || !this.from || !to) return;
    const name = escapeHtml(recipientName || "Pengguna NEXIERA");
    const url = escapeHtml(verificationUrl);
    const html = `<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0;background:#f3f6fb;padding:28px 12px;font-family:Arial,sans-serif;color:#17233d"><main style="max-width:520px;margin:auto;background:#fff;border:1px solid #dfe5ef;border-radius:10px;padding:32px"><strong style="font-size:20px;letter-spacing:1px">NEXIERA</strong><p>Halo ${name},</p><h1 style="font-size:24px">Verifikasi alamat email</h1><p>Konfirmasi email akun Anda untuk menyelesaikan pendaftaran.</p><p style="text-align:center;margin:28px 0"><a href="${url}" style="background:#2457c5;color:white;text-decoration:none;padding:13px 22px;border-radius:6px;font-weight:bold">Verifikasi Email</a></p><p style="font-size:12px;color:#667">Tautan berlaku selama 24 jam. Jika Anda tidak membuat akun, abaikan email ini.</p></main></body></html>`;
    try {
      const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: `Bearer ${this.resendApiKey}`, "content-type": "application/json" }, body: JSON.stringify({ from: this.from, to: [to], subject: "Verifikasi email NEXIERA", html, text: `Halo ${recipientName}, verifikasi email Anda: ${verificationUrl}` }), signal: AbortSignal.timeout(8_000) });
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        this.logger.error(`Gagal mengirim email verifikasi: Resend HTTP ${response.status} ${detail}`);
      }
    } catch (error) { this.logger.error(`Gagal mengirim email verifikasi: ${error instanceof Error ? error.message : String(error)}`); }
  }

  private resolveActionUrl(path?: string) {
    if (!path?.startsWith("/")) return undefined;
    try {
      return new URL(path, this.frontendUrl).toString();
    } catch {
      return undefined;
    }
  }
}
