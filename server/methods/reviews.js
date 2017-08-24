import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import * as Schemas from "/lib/collections/schemas";
import * as Collections from "/lib/collections";
import { Logger } from "/server/api";

Meteor.methods({
  "insert/review"(review) {
    check(review, Schemas.Reviews);
    Meteor.publish("Reviews");
    const index = Collections.Reviews.find({}).count();
    review.index = index + 1;
    Collections.Reviews.insert(review);
  }
});
