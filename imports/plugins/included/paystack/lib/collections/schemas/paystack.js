import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { PackageConfig } from "/lib/collections/schemas/registry";

export const PaystackPackageConfig = new SimpleSchema([
  PackageConfig, {
    "settings.mode": {
      type: Boolean,
      defaultValue: true
    },
    "settings.publicKey": {
      type: String,
      label: "Public Key",
      optional: true
    },
    "settings.secretKey": {
      type: String,
      label: "Secret Key",
      optional: true
    }
  }
]);

export const PaystackPayment = new SimpleSchema({
  payerName: {
    type: String,
    label: "Cardholder name"
  },
  payerEmail: {
    type: String,
    label: "Email"
  }
});
