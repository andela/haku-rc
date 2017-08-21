import { Session } from "meteor/session";
import { Template } from "meteor/templating";

Template.sortFilter.events({
  "change #price-filter": function (event) {
    Session.set("priceFilter", event.target.value);
  },
  "change #sort-value": function (event) {
    Session.set("sortValue", event.target.value);
  }
});
