import { Injectable, Logger, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getPrivateUploadsDir, getPublicUploadsDir } from "./storage-paths.js";

export type StoredFile = { url: string; filename: string };

@Injectable()
export class UploadStorageService {
  private readonly logger = new Logger(UploadStorageService.name);

  constructor(private readonly config: ConfigService) {}

  private get supabaseUrl() {
    return this.config.get<string>("SUPABASE_URL")?.replace(/\/$/, "");
  }

  private get secretKey() {
    return this.config.get<string>("SUPABASE_SECRET_KEY")?.trim();
  }

  private get isSupabaseConfigured() {
    return Boolean(this.supabaseUrl && this.secretKey);
  }

  isCloudStorageConfigured() {
    return this.isSupabaseConfigured;
  }

  private get publicBucket() {
    return this.config.get<string>("SUPABASE_PUBLIC_BUCKET") || "nexiera-public";
  }

  private get privateBucket() {
    return this.config.get<string>("SUPABASE_PRIVATE_BUCKET") || "nexiera-private";
  }

  async save(filename: string, buffer: Buffer, mimetype: string, isPrivate: boolean): Promise<StoredFile> {
    if (this.isSupabaseConfigured) {
      const bucket = isPrivate ? this.privateBucket : this.publicBucket;
      const response = await fetch(this.objectUrl(bucket, filename), {
        method: "POST",
        headers: {
          apikey: this.secretKey!,
          authorization: `Bearer ${this.secretKey}`,
          "content-type": mimetype,
          "x-upsert": "false",
        },
        body: new Uint8Array(buffer),
        signal: AbortSignal.timeout(20_000),
      }).catch(() => null);
      if (!response?.ok) {
        this.logger.warn(`Supabase Storage upload failed${response ? ` with status ${response.status}` : " before receiving a response"}.`);
        throw new ServiceUnavailableException("Upload ke penyimpanan cloud gagal. Silakan coba lagi.");
      }
      return {
        filename,
        url: isPrivate ? `/uploads/private/${filename}` : `${this.supabaseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodeURIComponent(filename)}`,
      };
    }

    if (this.config.get<string>("NODE_ENV") === "production") {
      throw new ServiceUnavailableException("Supabase Storage belum dikonfigurasi pada backend.");
    }
    const directory = isPrivate ? getPrivateUploadsDir() : getPublicUploadsDir();
    const path = join(directory, filename);
    await mkdir(directory, { recursive: true });
    await writeFile(path, buffer, { flag: "wx", mode: isPrivate ? 0o600 : 0o644 });
    return { filename, url: isPrivate ? `/uploads/private/${filename}` : `/uploads/${filename}` };
  }

  async remove(filename: string, isPrivate: boolean) {
    if (this.isSupabaseConfigured) {
      const bucket = isPrivate ? this.privateBucket : this.publicBucket;
      await fetch(`${this.supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}`, {
        method: "DELETE",
        headers: {
          apikey: this.secretKey!,
          authorization: `Bearer ${this.secretKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ prefixes: [filename] }),
      }).catch(() => undefined);
      return;
    }
    const directory = isPrivate ? getPrivateUploadsDir() : getPublicUploadsDir();
    await unlink(join(directory, filename)).catch(() => undefined);
  }

  async readPrivate(filename: string) {
    if (this.isSupabaseConfigured) {
      const response = await fetch(this.objectUrl(this.privateBucket, filename), {
        headers: { apikey: this.secretKey!, authorization: `Bearer ${this.secretKey}` },
        signal: AbortSignal.timeout(20_000),
      }).catch(() => null);
      if (response?.ok) {
        return { buffer: Buffer.from(await response.arrayBuffer()), mimetype: response.headers.get("content-type") || "application/octet-stream" };
      }
    }
    try {
      const buffer = await readFile(join(getPrivateUploadsDir(), filename));
      const ext = filename.slice(filename.lastIndexOf(".") + 1).toLowerCase();
      const mimetype = ext === "pdf" ? "application/pdf" : ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
      return { buffer, mimetype };
    } catch {
      return null;
    }
  }

  async isUploadedPublicUrl(value: string) {
    if (!this.isSupabaseConfigured || !this.supabaseUrl) return false;
    try {
      const url = new URL(value);
      const prefix = `/storage/v1/object/public/${encodeURIComponent(this.publicBucket)}/`;
      if (url.origin !== new URL(this.supabaseUrl).origin || !url.pathname.startsWith(prefix)) return false;
      const filename = decodeURIComponent(url.pathname.slice(prefix.length));
      if (!/^[a-f0-9-]+\.(?:png|jpg|webp)$/i.test(filename)) return false;
      const response = await fetch(value, { method: "HEAD", signal: AbortSignal.timeout(10_000) }).catch(() => null);
      return Boolean(response?.ok);
    } catch {
      return false;
    }
  }

  private objectUrl(bucket: string, filename: string) {
    return `${this.supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${encodeURIComponent(filename)}`;
  }
}
