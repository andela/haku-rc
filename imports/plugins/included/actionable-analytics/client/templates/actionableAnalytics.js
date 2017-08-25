import _ from "lodash";
import { Template } from "meteor/templating";
import { Orders } from "/lib/collections";
import { formatPriceString } from "/client/api";
import { ReactiveDict } from "meteor/reactive-dict";
import $ from "jquery";

/**
 * Function to fetch the total of all sales made
 * @param {Array} allOrders - Array containing all the orders
 * @return {Object} - an Object containing the necessary overview details
 */
function extractAnalyticsItems(allOrders) {
  let totalSales = 0;
  let ordersCancelled = 0;
  let totalItemsPurchased = 0;
  let totalShippingCost = 0;
  const analytics = {};
  const analyticsStatement = {};
  const ordersAnalytics = [];
  allOrders.forEach((order) => {
    const orderDate = order.createdAt;
    const dateString = orderDate.toISOString().split("T")[0];
    if (order.workflow.status !== "canceled") {
      ordersAnalytics.push({
        date: dateString,
        country: order.billing[0].address.region,
        city: order.billing[0].address.city,
        paymentProcessor: order.billing[0].paymentMethod.processor,
        shipping: order.billing[0].invoice.shipping,
        taxes: order.billing[0].invoice.taxes
      });
      totalSales += order.billing[0].invoice.subtotal;
      totalItemsPurchased += order.items.length;
      totalShippingCost += order.billing[0].invoice.shipping;
      order.items.forEach((item) => {
        if (analytics[item.title]) {
          analytics[item.title].quantitySold += item.quantity;
          analytics[item.title].totalSales += item.variants.price;
        } else {
          analytics[item.title] = {
            quantitySold: item.quantity,
            totalSales: item.variants.price
          };
        }
        const uniqueStamp = `${dateString}::${item.title}`;
        if (analyticsStatement[uniqueStamp] && analyticsStatement[uniqueStamp].title === item.title) {
          analyticsStatement[uniqueStamp].totalSales += item.variants.price;
          analyticsStatement[uniqueStamp].quantity += item.quantity;
        } else {
          analyticsStatement[uniqueStamp] = {
            title: item.title,
            quantity: item.quantity,
            dateString,
            totalSales: item.variants.price
          };
        }
      });
    } else {
      ordersCancelled += 1;
    }
  });
  return { totalSales, totalItemsPurchased, totalShippingCost, analytics, analyticsStatement, ordersAnalytics, ordersCancelled };
}

/**
 * Helper function to calculate the differnce (in days)
 * between 2 dates
 * @param{Object} date1 - older date1 in milliseconds
 * @param{Object} date2 - recent date in milliseconds
 * @return{Number} - Difference between date2 and date1 in days (Number of days between date2 and date1)
 */
function daysDifference(date1, date2) {
  // a Day represented in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;
  // Calculate the difference in milliseconds
  const difference = new Date(new Date(date2).setHours(23)) - new Date(new Date(date1).setHours(0));
  // Convert back to days and return
  return Math.round(difference / oneDay);
}


/**
 * Helper method to set up the average sales total
 * @param{Number} totalSales - total sales
 * @param{Date} fromDate - start date
 * @param{toDate} toDate - end date
 * @return{Number} sales per day
 */
function setUpAverageSales(totalSales, fromDate, toDate) {
  const difference = daysDifference(Date.parse(fromDate), Date.parse(toDate));
  const salesPerDay = difference === 0 ? totalSales : totalSales / difference;
  return salesPerDay;
}

Template.actionableAnalytics.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    ordersPlaced: 0,
    beforeDate: new Date(),
    afterDate: new Date(),
    totalSales: 0,
    totalItemsPurchased: 0,
    ordersCancelled: 0,
    totalShippingCost: 0,
    salesPerDay: 0,
    analytics: {},
    analyticsStatement: {},
    ordersAnalytics: [],
    productsAnalytics: []
  });
  const self = this;
  self.autorun(() => {
    const orderSub = self.subscribe("Orders");
    if (orderSub.ready()) {
      const allOrders = Orders.find({
        createdAt: {
          $gte: new Date(self.state.get("beforeDate").setHours(0)),
          $lte: new Date(self.state.get("afterDate").setHours(23))
        }
      }).fetch();
      if (allOrders) {
        const analyticsItems = extractAnalyticsItems(allOrders);
        self.state.set("ordersPlaced", allOrders.length);
        self.state.set("totalSales", analyticsItems.totalSales);
        self.state.set("totalItemsPurchased", analyticsItems.totalItemsPurchased);
        self.state.set("totalShippingCost", analyticsItems.totalShippingCost);
        self.state.set("analytics", analyticsItems.analytics);
        self.state.set("analyticsStatement", analyticsItems.analyticsStatement);
        self.state.set("ordersAnalytics", analyticsItems.ordersAnalytics);
        self.state.set("ordersCancelled", analyticsItems.ordersCancelled);
        self.state.set("salesPerDay",
        setUpAverageSales(self.state.get("totalSales"),
          self.state.get("beforeDate"),
          self.state.get("afterDate")));
      }
    }
  });
});

Template.actionableAnalytics.onRendered(() => {
  const instance = Template.instance();
  let fromDatePicker = {};
  const toDatePicker = new Pikaday({ // eslint-disable-line no-undef
    field: $("#todatepicker")[0],
    format: "DD/MM/YYYY",
    onSelect() {
      const nextDate = this.getDate();
      instance.state.set("afterDate", nextDate);
    }
  });

  fromDatePicker = new Pikaday({ // eslint-disable-line no-undef
    field: $("#fromdatepicker")[0],
    format: "DD/MM/YYYY",
    onSelect() {
      toDatePicker.setMinDate(this.getDate());
      const nextDate = this.getDate();
      if (Date.parse(toDatePicker.getDate()) < Date.parse(nextDate)) {
        toDatePicker.setDate(nextDate);
      } else {
        instance.state.set("beforeDate", this.getDate());
      }
    }
  });
  fromDatePicker.setMaxDate(new Date());
  toDatePicker.setMaxDate(new Date());
  fromDatePicker.setDate(new Date());
  toDatePicker.setDate(fromDatePicker.getDate());
});

Template.actionableAnalytics.helpers({
  ordersPlaced() {
    const instance = Template.instance();
    const orders = instance.state.get("ordersPlaced");
    return orders - Template.instance().state.get("ordersCancelled");
  },
  totalSales() {
    const instance = Template.instance();
    return formatPriceString(instance.state.get("totalSales"));
  },
  totalItemsPurchased() {
    const instance = Template.instance();
    return instance.state.get("totalItemsPurchased");
  },
  totalShippingCost() {
    const instance = Template.instance();
    return formatPriceString(instance.state.get("totalShippingCost"));
  },
  salesPerDay() {
    const instance = Template.instance();
    return formatPriceString(instance.state.get("salesPerDay"));
  },
  bestSelling() {
    const products = [];
    const instance = Template.instance();
    const analytics = instance.state.get("analytics");
    Object.keys(analytics).forEach((key) => {
      products.push({
        product: key,
        quantitySold: analytics[key].quantitySold
      });
    });
    return _.orderBy(
      products,
      product => product.quantitySold,
      "desc"
    );
  },
  topEarning() {
    const products = [];
    const instance = Template.instance();
    const analytics = instance.state.get("analytics");
    Object.keys(analytics).forEach((key) => {
      products.push({
        product: key,
        salesSorter: analytics[key].totalSales,
        totalSales: formatPriceString(analytics[key].totalSales)
      });
    });
    return _.orderBy(
      products,
      product => product.salesSorter,
      "desc"
    );
  },
  statements() {
    const statements = [];
    const instance = Template.instance();
    const analyticsStatement = instance.state.get("analyticsStatement");

    Object.keys(analyticsStatement).forEach((key) => {
      statements.push(analyticsStatement[key]);
      analyticsStatement[key].totalSales = formatPriceString(analyticsStatement[key].totalSales);
    });
    return _.orderBy(
      statements,
      statement => Date.parse(statement.dateString),
      "desc"
    );
  },
  orders() {
    const instance = Template.instance();
    const orders = instance.state.get("ordersAnalytics");
    return _.orderBy(
      orders,
      (order) => {
        const currentOrder = order;
        currentOrder.taxes = formatPriceString(currentOrder.taxes);
        currentOrder.shipping = formatPriceString(currentOrder.shipping);
        return Date.parse(currentOrder.date);
      },
      "desc"
    );
  },
  products() {
    const instance = Template.instance();
    const productsAnalytics = instance.state.get("productsAnalytics");
    return _.orderBy(productsAnalytics,
      product => product.views,
      "desc"
    );
  },
  ordersCancelled() {
    return Template.instance().state.get("ordersCancelled");
  }
});
