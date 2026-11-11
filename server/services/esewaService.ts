import crypto from 'crypto';

export interface EsewaInitiatePayload {
  amount: number;
  tax_amount?: number;
  total_amount: number;
  transaction_uuid: string;
  product_code?: string;
  product_service_charge?: number;
  product_delivery_charge?: number;
  success_url: string;
  failure_url: string;
}

export class EsewaService {
  private static merchantCode = process.env.ESEWA_MERCHANT_CODE || 'EPAYTEST';
  private static secretKey = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
  private static gatewayUrl = process.env.ESEWA_GATEWAY_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

  /**
   * Generates HMAC-SHA256 Base64 signature as mandated by eSewa ePay v2
   */
  public static generateSignature(totalAmount: number, transactionUuid: string, productCode = this.merchantCode): string {
    const dataString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    const hmac = crypto.createHmac('sha256', this.secretKey);
    hmac.update(dataString);
    return hmac.digest('base64');
  }

  /**
   * Formats the complete form payload needed to redirect client to eSewa payment portal
   */
  public static createPaymentRequest(params: {
    amount: number;
    deliveryFee: number;
    totalAmount: number;
    orderNumber: string;
    clientSuccessUrl: string;
    clientFailureUrl: string;
  }) {
    const transactionUuid = `${params.orderNumber}-${Date.now()}`;
    const productCode = this.merchantCode;
    const signature = this.generateSignature(params.totalAmount, transactionUuid, productCode);

    return {
      gatewayUrl: this.gatewayUrl,
      formData: {
        amount: params.amount.toString(),
        tax_amount: '0',
        total_amount: params.totalAmount.toString(),
        transaction_uuid: transactionUuid,
        product_code: productCode,
        product_service_charge: '0',
        product_delivery_charge: params.deliveryFee.toString(),
        success_url: params.clientSuccessUrl,
        failure_url: params.clientFailureUrl,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        signature: signature
      }
    };
  }

  /**
   * Server-side signature verification from eSewa redirect payload
   */
  public static verifyCallbackSignature(encodedData: string): { verified: boolean; data?: any } {
    try {
      const decodedString = Buffer.from(encodedData, 'base64').toString('utf-8');
      const parsedData = JSON.parse(decodedString);
      
      const expectedSignature = this.generateSignature(
        Number(parsedData.total_amount),
        parsedData.transaction_uuid,
        parsedData.product_code
      );

      const isValid = expectedSignature === parsedData.signature;
      return { verified: isValid, data: parsedData };
    } catch (e) {
      return { verified: false };
    }
  }
}
