/* eslint no-undef: 0 */
import swal from "sweetalert2";
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import { Accounts, Packages, Wallets } from "/lib/collections";

let list = [];
let pageList = [];
let currentPage = 1;
const numberPerPage = 10;
let numberOfPages = 0;

Template.wallet.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    details: { balance: 0, transactions: [] },
    transactions: [],
    transactionsList: [],
    currentPageNum: 1
  });
  this.autorun(() => {
    this.subscribe("transactionDetails", Meteor.userId());
    const transactionInfo = Wallets.find().fetch();
    if (transactionInfo.length > 0) {
      this.state.set("details", transactionInfo[0]);
      makeList();
    }
  });
});

function makeList() {
  const transactions = Template.instance().state.get("details").transactions;
  if (transactions.length > 0) {
    const newTranscationDetails = transactions.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
    Template.instance().state.set("transactionsList", newTranscationDetails);
    numberOfPages = getNumberOfPages();
  }
}

function getNumberOfPages() {
  list = Template.instance().state.get("transactionsList");
  if (list.length > 0) {
    return Math.ceil(list.length / numberPerPage);
  }
}

function check() {
  document.getElementById("next").disabled = currentPage === numberOfPages
    ? true
    : false;
  document.getElementById("previous").disabled = currentPage === 1
    ? true
    : false;
  document.getElementById("first").disabled = currentPage === 1 ? true : false;
  document.getElementById("last").disabled = currentPage === numberOfPages
    ? true
    : false;
}

function loadList() {
  list = Template.instance().state.get("transactionsList");
  let begin = (currentPage - 1) * numberPerPage;
  let end = begin + numberPerPage;
  if (list[0] !== undefined) {
    pageList = list.slice(begin, end);
    Template.instance().state.set("transactions", pageList);
    check();
  }
}

function confirmTransfer(transaction, recipient) {
  swal({
    title: "Are you sure?",
    text: "You will not be able to reverse this action!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, Transfer it!",
    html: false
  }).then(
    () => {
      Meteor.call(
        "wallet/transaction",
        Meteor.userId(),
        transaction,
        (err, res) => {
          if (res === 2) {
            Alerts.toast(`No user with email ${recipient}`, "error");
          } else if (res === 1) {
            document.getElementById("recipient").value = "";
            document.getElementById("transferAmount").value = "";
            Alerts.toast("The transfer was successful", "success");
          } else {
            Alerts.toast("An error occured, please try again", "error");
          }
        }
      );
    },
    dismiss => {
      if (dismiss === "cancel") {
        swal("Cancelled", "Your Money is safe :)", "error");
      }
    }
  );
}


const getPaystackSettings = () => {
  const paystack = Packages.findOne({
    name: "paystack",
    shopId: Reaction.getShopId()
  });

  return {
    public: "pk_test_d8a620c116e0777b05a05931d421cb1ac7f5a99b",
    secret: "sk_test_217ff5853fc7a1e4bfbdd93a0fef5144679506c4"
  };
};

const finalizeDeposit = paystackMethod => {
  Meteor.call(
    "wallet/transaction",
    Meteor.userId(),
    paystackMethod.transactions,
    (err, res) => {
      if (res) {
        document.getElementById("depositAmount").value = "";
        Alerts.toast("Your deposit was successful", "success");
      } else {
        Alerts.toast("An error occured, please try again", "error");
      }
    }
  );
};

function handlePayment(result) {
  const type = "deposit";
  const transactionId = result.reference;
  const paystackConfig = getPaystackSettings();
  HTTP.call(
    "GET",
    `https://api.paystack.co/transaction/verify/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${paystackConfig.secret}`
      }
    },
    function (error, response) {
      if (error) {
        Alerts.toast("Unable to verify payment", "error");
      } else if (response.data.data.status !== "success") {
        Alerts.toast("Payment was unsuccessful", "error");
      } else {
        const paystackResponse = response.data.data;
        paystackMethod = {
          processor: "Paystack",
          storedCard: paystackResponse.authorization.last4,
          method: "Paystack",
          transactionId: paystackResponse.reference,
          currency: paystackResponse.currency,
          amount: parseInt(paystackResponse.amount, 10),
          status: paystackResponse.status,
          mode: "authorize",
          createdAt: new Date()
        };
        if (type === "deposit") {
          paystackMethod.transactions = {
            amount: paystackResponse.amount / 100,
            referenceId: paystackResponse.reference,
            date: new Date(),
            transactionType: "Credit"
          };
          finalizeDeposit(paystackMethod);
        }
      }
    }
  );
}

// Paystack payment
const payWithPaystack = (email, amount) => {
  const paystackConfig = getPaystackSettings();
  const handler = PaystackPop.setup({
    key: paystackConfig.public,
    email: email,
    amount: amount * 100,
    callback: handlePayment
  });
  handler.openIframe();
};

Template.wallet.events({
  "click #first": event => {
    event.preventDefault();
    currentPage = 1;
    Template.instance().state.set("currentPageNum", currentPage);
    loadList();
  },
  "click #next": event => {
    event.preventDefault();
    currentPage += 1;
    Template.instance().state.set("currentPageNum", currentPage);
    loadList();
  },
  "click #previous": event => {
    event.preventDefault();
    currentPage -= 1;
    Template.instance().state.set("currentPageNum", currentPage);
    loadList();
  },
  "click #last": event => {
    event.preventDefault();
    currentPage = numberOfPages;
    Template.instance().state.set("currentPageNum", currentPage);
    loadList();
  },
  "submit #deposit": event => {
    event.preventDefault();
    const accountDetails = Accounts.find(Meteor.userId()).fetch();
    const userMail = accountDetails[0].emails[0].address;
    const amount = parseInt(document.getElementById("depositAmount").value, 10);
    const mailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i;
    if (!mailRegex.test(userMail)) {
      Alerts.toast("Invalid email address", "error");
      return false;
    }
    if (amount < 0) {
      Alerts.toast("Amount cannot be negative", "error");
      return false;
    }
    if (amount === 0 || amount === "") {
      Alerts.toast("Please enter amount ", "error");
      return false;
    }
    payWithPaystack(userMail, amount);
  },
  "submit #transfer": event => {
    event.preventDefault();
    const accountDetails = Accounts.find(Meteor.userId()).fetch();
    const userMail = accountDetails[0].emails[0].address;
    const recipient = document.getElementById("recipient").value;
    const amount = parseInt(
      document.getElementById("transferAmount").value,
      10
    );

    if (amount > Template.instance().state.get("details").balance) {
      Alerts.toast("Insufficient Balance", "error");
      return false;
    }
    if (amount < 0) {
      Alerts.toast("Amount cannot be negative", "error");
      return false;
    }
    if (amount === 0 || amount === "") {
      Alerts.toast("Please enter amount ", "error");
      return false;
    }
    if (userMail === recipient) {
      Alerts.toast("You can not transfer to yourself", "error");
      return false;
    }
    const mailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/i;
    if (!mailRegex.test(recipient)) {
      Alerts.toast("Invalid email address", "error");
      return false;
    }
    const transaction = {
      amount,
      to: recipient,
      date: new Date(),
      transactionType: "Debit"
    };
    confirmTransfer(transaction, recipient);
  }
});

Template.wallet.helpers({
  balance() {
    return Template.instance().state.get("details").balance;
  },

  getTransactions() {
    makeList();
    loadList();
    const transactions = Template.instance().state.get("transactions");
    return transactions;
  },
  getCurrentPage() {
    const currentPageNum = Template.instance().state.get("currentPageNum");
    return currentPageNum;
  },
  formatDate(date) {
    return moment(date).format("dddd, MMMM Do YYYY, h:mm:ssa");
  }
});
