import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "PaystackPayment",
  name: "paystack",
  icon: "fa fa-credit-card-alt",
  autoEnable: true,
  settings: {
    mode: false,
    publicKey: "",
    secretKey: ""
  },
  registry: [
    // Dashboard card
    {
      provides: "dashboard",
      label: "Paystack Payment",
      description: "Paystack Payment Provider",
      icon: "fa fa-credit-card-alt",
      priority: 3,
      container: "paymentMethod"
    },

    // Settings panel
    {
      label: "Paystack Payment Settings", // this key (minus spaces) is used for translations
      route: "/dashboard/paystack",
      provides: "settings",
      container: "dashboard",
      template: "paystackSettings"
    },

    // Payment form for checkout
    {
      template: "paystackPaymentForm",
      provides: "paymentMethod"
    }
  ]
});
