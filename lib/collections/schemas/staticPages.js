import { Random } from "meteor/random";
import {
  SimpleSchema
} from "meteor/aldeed:simple-schema";

/**
 + * Reaction Schemas Static Pages
 + */

export const StaticPages = new SimpleSchema({
  _id: {
    type: String,
    defaultValue: Random.id(),
    optional: true
  },
  title: {
    type: String,
    label: "title"
  },
  slug: {
    type: String,
    label: "slug"
  },
  content: {
    label: "content",
    type: String
  },
  shopId: {
    label: "shopId",
    type: String,
    optional: true
  },
  pageOwner: {
    label: "pageOwner",
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date
        };
      }
    },
    denyUpdate: true
  },
  updatedAt: {
    type: Date,
    optional: true
  }
});
