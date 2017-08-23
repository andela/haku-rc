import { Wallets } from "/lib/collections";

Meteor.publish("transactionDetails", (userId) => {
  check(userId, String);
  return Wallets.find({ userId });
});
