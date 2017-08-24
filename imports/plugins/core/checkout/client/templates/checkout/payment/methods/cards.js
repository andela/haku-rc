import { Packages, Shops, Wallets, Cart } from "/lib/collections";
import { Template } from "meteor/templating";

const openClassName = "in";

Template.corePaymentMethods.onCreated(function () {
  // Set the default paymentMethod
  // Note: we do this once, so if the admin decides to change the default payment method
  // while a user is trying to checkout, they wont get a jarring experience.
  const shop = Shops.findOne();

  this.state = new ReactiveDict();
  this.state.setDefault({
    defaultPaymentMethod: shop.defaultPaymentMethod || "none"
  });
});

Template.corePaymentMethods.helpers({
  isOpen(current) {
    const instance = Template.instance();
    const state = instance.state;
    const name = current.packageName;
    const priority = current.priority;

    if (state.equals("defaultPaymentMethod", name) || priority === "0" && state.equals("defaultPaymentMethod", "none")) {
      return openClassName;
    }
  },
  appDetails: function () {
    // Provides a fallback to the package icon / label if one is not found for this reaction app
    const self = this;
    if (!(this.icon && this.label)) {
      const app = Packages.findOne(this.packageId);
      for (const registry of app.registry) {
        if (!(registry.provides === "dashboard")) {
          continue;
        }
        self.icon = registry.icon;
        self.label = registry.label;
      }
    }
    return self;
  }
});
Template.walletPayment.onCreated(function () {
  this.state = new ReactiveDict();
  this.autorun(() => {
    this.state.setDefault({
      details: {balance: 0}
    });
    this.subscribe("transactionDetails", Meteor.userId());
    const transactionInfo = Wallets.find().fetch();
    if (transactionInfo.length > 0) {
      this.state.set("details", transactionInfo[0]);
    }
  });
});

Template.walletPayment.helpers({
  balance: () => {
    return Template.instance().state.get("details").balance;
  }
});

Template.walletPayment.events({
  "click #pay-with-wallet": (event) => {
    event.preventDefault();
    const balance = Template.instance().state.get("details").balance;
    const cartAmount = Number(Cart.findOne().cartTotal());
    const currency = Shops.findOne().currency;
    if (cartAmount > balance) {
      Alerts.toast("Insufficient balance", "error");
      return false;
    }
    transactionId = Random.id();
    Meteor.call("wallet/transaction", Meteor.userId(), {
      amount: cartAmount,
      date: new Date(),
      orderId: transactionId,
      transactionType: "Debit"
    }, (err, res) => {
      if (res) {
        const paymentMethod = {
          processor: "Wallet",
          storedCard: "",
          method: "credit",
          transactionId,
          currency: currency,
          amount: cartAmount,
          status: "passed",
          mode: "authorize",
          createdAt: new Date(),
          transactions: []
        };
        const theTransaction = {
          amount: cartAmount,
          transactionId,
          currency: currency
        };
        paymentMethod.transactions.push(theTransaction);
        Meteor.call("cart/submitPayment", paymentMethod);
        Alerts.toast("Payment Successful", "success");
      } else {
        Alerts.toast("Oops!!, an error occured, please try again", "error");
      }
    });
  }
});
