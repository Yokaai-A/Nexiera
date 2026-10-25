import { BadRequestException } from "@nestjs/common";

export interface MidtransNotification {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  transaction_id?: string;
  fraud_status?: string;
  bank_confirmed_at?: string;
}


export function parseMidtransNotification(value: unknown): MidtransNotification {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new BadRequestException("Invalid Midtrans notification payload");
  }

  const payload = value as Record<string, unknown>;
  const requiredFields = [
    "order_id",
    "status_code",
    "gross_amount",
    "signature_key",
    "transaction_status",
  ] as const;

  for (const field of requiredFields) {
    if (typeof payload[field] !== "string" || payload[field].length === 0) {
      throw new BadRequestException(`Midtrans notification field '${field}' is required`);
    }
  }

  for (const field of ["transaction_id", "fraud_status", "bank_confirmed_at"] as const) {
    if (payload[field] !== undefined && typeof payload[field] !== "string") {
      throw new BadRequestException(`Midtrans notification field '${field}' must be a string`);
    }
  }

  return payload as unknown as MidtransNotification;
}
