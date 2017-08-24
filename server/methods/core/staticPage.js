import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { StaticPages } from "../../../lib/collections";
import * as Collections from "/lib/collections";
import * as Schemas from "../../../lib/collections/schemas";

Meteor.methods({
  /**
   * @summary - Creates a Static Page
   * @param{String} title - The title of the page
   * @param{String} slug - the URI with which the page is accessible
   * @param{String} content - the content of the page
   * @param{String} shopId - the ShopId of the page
   * @param{String} pageOwner of the page
   * @param{String} createdAt, the date of creation of the page
   * @return {no-return} there is no return
   */
  insertPage: function (title, slug, content, shopId, pageOwner, createdAt) {
    check(title, String);
    check(slug, String);
    check(content, String);
    check(shopId, String);
    check(pageOwner, String);
    check(createdAt, Date);

    const page = {
      title: title,
      slug: slug,
      content: content,
      shopId: shopId,
      pageOwner: pageOwner,
      createdAt: createdAt
    };
    check(page, Schemas.StaticPages);
    Collections.StaticPages.insert(page);
  },

  /**
   * @summary - Updates a Static Page
   * @param{String} _id - The page to be updated
   * @param{String} title - The new name for the page
   * @param{String} slug - The new title for the page
   * @param{String} content - The new body for the page
   * @param{String} shopId - the content of the page
   * @return{no-return} No return value
   */
  "updatePage"(_id, title, slug, content, shopId) {
    check(_id, String);
    check(title, String);
    check(slug, String);
    check(content, String);
    check(shopId, String);

    const page = {
      title,
      slug,
      content,
      shopId
    };
    // check(page, Schemas.StaticPages);
    Collections.StaticPages.update(_id, {
      $set:
        page

    });
  },

  /**
   * @summary - Deletes a Static Page
   * @param{String} _id - The id of the page
   * @return{no-return} No return value
   */
  "deletePage"(_id) {
    check(_id, String);
    StaticPages.remove(_id);
  }
});
