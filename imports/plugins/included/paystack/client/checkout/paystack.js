/* eslint camelcase: 0 */
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Random } from "meteor/random";
import {AutoForm} from "meteor/aldeed:autoform";
import { Cart } from "/lib/collections";
import { Paystack } from "../../lib/api";
import { PaystackPayment } from "../../lib/collections/schemas";
import "../../lib/api/paystackAPI";
import "./paystack.html";

const enableButton = (template, buttonText) => {
  // $("#paystackPaymentForm").find(":input").removeAttr("disabled");
  $("#paystackPaymentForm").find(":input").removeAttr("disabled");
  $("#paystackPaymentForm").find("#btn-complete-order").text(buttonText);
  $("#paystackPaymentForm").find("#btn-processing").addClass("hidden");
};

function paymentAlert(template, errorMessage) {
  $("#paystackPaymentForm").find(".alert").removeClass("hidden").text(errorMessage || "Please check the details above and try again.");
}

function handlePaystackSubmitError(error) {
  const serverError = error !== null ? error.message : void 0;
  if (serverError) {
    return paymentAlert("Oops! " + serverError);
  } else if (error) {
    return paymentAlert("Oops! " + error, null, 4);
  }
}

Template.paystackPaymentForm.helpers({
  PaystackPayment() {
    return PaystackPayment;
  }
});

AutoForm.addHooks("paystack-payment-form", {
  onSubmit(doc) {
    Meteor.call("paystack/getKeys", (err, keys) => {
      const cart = Cart.findOne();
      const amount = Math.round(cart.cartTotal()) * 100;
      const template = this.template;
      const key = keys.public;
      const details = {
        key,
        name: doc.payerName,
        email: doc.payerEmail,
        reference: Random.id(),
        amount,
        callback(response) {
          const secret = keys.secret;
          const reference = response.reference;
          if (reference) {
            Paystack.verify(reference, secret, (error, res) => {
              if (error) {
                handlePaystackSubmitError(template, error);
                enableButton(template, "Resubmit payment");
              } else {
                const transaction = res.data;
                const paymentMethod = {
                  processor: "Paystack",
                  storedCard: transaction.authorization.card_type,
                  method: "Paystack Payment",
                  transactionId: transaction.reference,
                  currency: transaction.currency,
                  amount: transaction.amount / 100,
                  status: "passed",
                  mode: "authorize",
                  createdAt: new Date(),
                  transactions: []
                };
                Alerts.toast("Transaction successful");
                paymentMethod.transactions.push(transaction.authorization);
                Meteor.call("cart/submitPayment", paymentMethod);
              }
            });
          }
        },
        onClose() {
          enableButton(template, "Complete payment");
        }
      };
      try {
        PaystackPop.setup(details).openIframe();
      } catch (error) {
        handlePaystackSubmitError(template, error);
        enableButton(template, "Complete payment");
      }
    });
    return false;
  }
});
