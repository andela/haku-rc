import { Reviews } from "/lib/collections";
import { Meteor } from "meteor/meteor";

Meteor.publish("Reviews", function () {
  return Reviews.find({});
});
