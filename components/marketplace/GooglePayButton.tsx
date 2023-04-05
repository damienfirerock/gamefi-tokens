import React from "react";
import GooglePayButton from "@google-pay/button-react";
import { useRouter } from "next/router";

const mockPaymentRequest: google.payments.api.PaymentDataRequest = {
  apiVersion: 2,
  apiVersionMinor: 0,
  allowedPaymentMethods: [
    {
      type: "CARD",
      parameters: {
        allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
        allowedCardNetworks: ["MASTERCARD", "VISA"],
      },
      tokenizationSpecification: {
        type: "PAYMENT_GATEWAY",
        parameters: {
          gateway: "example",
          gatewayMerchantId: "exampleGatewayMerchantId",
        },
      },
    },
  ],
  merchantInfo: {
    merchantId: "12345678901234567890",
    merchantName: "Demo Merchant",
  },
  transactionInfo: {
    totalPriceStatus: "FINAL",
    totalPriceLabel: "Total",
    totalPrice: "10.00",
    currencyCode: "USD",
    countryCode: "US",
  },
};

interface IWrappedGooglePayButton {
  handlePayment: (paymentData: google.payments.api.PaymentData) => void;
}

const WrappedGooglePayButton: React.FunctionComponent<
  IWrappedGooglePayButton
> = (props) => {
  const { handlePayment } = props;
  const { locale } = useRouter();

  return (
    <GooglePayButton
      environment="TEST"
      paymentRequest={mockPaymentRequest}
      onLoadPaymentData={handlePayment}
      buttonLocale={locale}
    />
  );
};

export default WrappedGooglePayButton;
