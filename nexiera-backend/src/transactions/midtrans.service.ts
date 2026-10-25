import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

interface MidtransRefundResponse {
  status_code?: string;
  refund_key?: string;
  transaction_id?: string;
  status_message?: string;
}

interface MidtransSnapResponse {
  token?: string;
  redirect_url?: string;
  error_messages?: string[];
}

export class MidtransRefundRejectedError extends Error {
  constructor(message: string, readonly statusCode?: string) {
    super(message);
    this.name = "MidtransRefundRejectedError";
  }
}

@Injectable()
export class MidtransService {
  constructor(private readonly config: ConfigService) {}

  async createSnapCheckout(input: {
    orderId: string;
    amount: number;
    classId: string;
    classTitle: string;
    customer: { name: string; email: string; phoneNumber: string };
  }) {
    const serverKey = this.config.getOrThrow<string>("MIDTRANS_SERVER_KEY");
    const isProduction = this.isProductionMode();
    const baseUrl = isProduction
      ? "https://app.midtrans.com"
      : "https://app.sandbox.midtrans.com";
    const authorization = Buffer.from(`${serverKey}:`).toString("base64");

    let response: Response;
    try {
      response = await fetch(`${baseUrl}/snap/v1/transactions`, {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Basic ${authorization}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          transaction_details: {
            order_id: input.orderId,
            gross_amount: input.amount,
          },
          item_details: [
            {
              id: input.classId.slice(0, 50),
              price: input.amount,
              quantity: 1,
              name: input.classTitle.slice(0, 50),
            },
          ],
          customer_details: {
            first_name: input.customer.name.slice(0, 50),
            email: input.customer.email,
            phone: input.customer.phoneNumber,
          },
        }),
        signal: AbortSignal.timeout(15_000),
      });
    } catch {
      throw new ServiceUnavailableException("Midtrans checkout endpoint is unavailable");
    }

    const payload = (await response.json().catch(() => ({}))) as MidtransSnapResponse;
    if (!response.ok || !payload.token || !payload.redirect_url) {
      throw new ServiceUnavailableException(
        payload.error_messages?.join("; ") || `Midtrans rejected checkout (${response.status})`,
      );
    }

    let redirectUrl: URL;
    try {
      redirectUrl = new URL(payload.redirect_url);
    } catch {
      throw new ServiceUnavailableException("Midtrans returned an invalid checkout URL");
    }
    const allowedHosts = new Set(["app.midtrans.com", "app.sandbox.midtrans.com"]);
    if (redirectUrl.protocol !== "https:" || !allowedHosts.has(redirectUrl.hostname)) {
      throw new ServiceUnavailableException("Midtrans returned an invalid checkout URL");
    }

    return { redirectUrl: redirectUrl.toString() };
  }

  async requestFullRefund(referenceId: string, transactionId: string, reason: string) {
    const serverKey = this.config.getOrThrow<string>("MIDTRANS_SERVER_KEY");
    const isProduction = this.isProductionMode();
    const baseUrl = isProduction
      ? "https://api.midtrans.com"
      : "https://api.sandbox.midtrans.com";
    const authorization = Buffer.from(`${serverKey}:`).toString("base64");

    let response: Response;
    try {
      response = await fetch(`${baseUrl}/v2/${encodeURIComponent(referenceId)}/refund`, {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Basic ${authorization}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          refund_key: `nexiera-${transactionId}`,
          reason,
        }),
        signal: AbortSignal.timeout(15_000),
      });
    } catch {
      throw new ServiceUnavailableException("Midtrans refund endpoint is unavailable");
    }

    const payload = (await response.json().catch(() => ({}))) as MidtransRefundResponse;


    if (payload.status_code === "406") return payload;

    if (!response.ok || payload.status_code !== "200") {
      const message = payload.status_message || `Midtrans rejected the refund request (${response.status})`;
      if (payload.status_code) {
        throw new MidtransRefundRejectedError(message, payload.status_code);
      }
      throw new ServiceUnavailableException(message);
    }

    return payload;
  }

  private isProductionMode() {
    const configured = this.config.get<string>("MIDTRANS_IS_PRODUCTION");
    if (configured !== "true" && configured !== "false") {
      throw new ServiceUnavailableException("MIDTRANS_IS_PRODUCTION must be explicitly set to true or false");
    }
    return configured === "true";
  }
}
