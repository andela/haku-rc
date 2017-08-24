import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "WalletPayment",
  name: "wallet",
  icon: "fa fa-money",
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
      label: "Wallet",
      description: "Pay using Wallet",
      icon: "fa fa-money",
      priority: 3,
      container: "paymentMethod"
    }
  ]
});
