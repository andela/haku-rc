/* eslint-disable no-undef */
import SimpleMDE from "simplemde";
import { Template } from "meteor/templating";
import { StaticPages } from "/lib/collections";
import "./staticPageView.html";
import "/node_modules/simplemde/dist/simplemde.min.css";
import { Reaction } from "/client/api";

let simplemde;
Template.staticPages.onRendered(() => {
  $("#main").css("overflow", "visible");

  simplemde = new SimpleMDE({
    element: document.getElementById("editormd"),
    autofocus: true
  });

  $(".editor-toolbar").append(
    $("<a/>")
      .attr("id", "static-pages-submit")
      .attr("title", "Create Page")
      .attr("tabindex", "-1")
      .addClass("fa fa-floppy-o static-pages-new")
  );
});
Template.staticPages.onDestroyed(() => {
  $("#main").css("overflow", "auto");
});

Template.staticPages.helpers({
  baseUrl() {
    return window.location.host;
  },
  userPages() {
    return StaticPages.find({shopId: Reaction.shopId}).fetch();
  }
});

Template.staticPages.events({
  "click .static-pages-new": () => {
    const title = $("#static-page-title").val();
    const slug = $("#static-page-slug").val();
    const shopId = Reaction.shopId;
    const pageOwner = Meteor.user()._id;
    const content = simplemde.value();
    const createdAt = new Date();
    Meteor.call("insertPage", title, slug, content, shopId, pageOwner,  createdAt, function (err) {
      if (err) {
        Alerts.toast(err.message, "error");
      } else {
        Alerts.toast("Created New Static Page", "success");
      }
    });
  },
  "click .static-pages-update": () => {
    const _id = $("#static-page-id").val();
    const title = $("#static-page-title").val();
    const slug = $("#static-page-slug").val();
    const shopId = Reaction.shopId;
    const content = simplemde.value();

    Meteor.call("updatePage", _id, title, slug, content, shopId,  (err) => {
      if (err) {
        Alerts.toast(err.message, "error");
      } else {
        Alerts.toast(`Updated ${title}`, "success");
      }
    });
  },
  "click #static-pages-menu-toggle": (event) => {
    event.preventDefault();
    $("#static-pages-wrapper").toggleClass("active");
    $("#static-pages-menu-toggle > i").toggleClass("fa-caret-square-o-left fa-caret-square-o-right");
    $("#static-pages-menu-toggle").toggleClass("static-pages-menu-adjust");
  },
  "click .editPage": (event) => {
    const _id = $(event.currentTarget).parents("tr").attr("id");
    const pageDetails = StaticPages.find({_id}).fetch();
    $("#static-page-title").val(pageDetails[0].title);
    $("#static-page-slug").val(pageDetails[0].slug);
    $("#static-page-id").val(pageDetails[0]._id);
    simplemde.value(pageDetails[0].content);
    $("#static-pages-submit").removeClass("static-pages-new")
    .addClass("static-pages-update")
    .prop("title", "Update Page");
  },
  "click .deletePage": (event) => {
    Alerts.alert({
      title: "Delete this page?",
      showCancelButton: true,
      cancelButtonText: "No",
      confirmButtonText: "Yes"
    }, (confirmed) => {
      if (confirmed) {
        const _id = $(event.currentTarget).parents("tr").attr("id");
        Meteor.call("deletePage", _id);
      }
    });
  },
  "click .addPage": () => {
    $("#static-page-title").val("").focus();
    $("#static-page-slug").val("");
    simplemde.value("");
    $("#static-pages-submit").addClass("static-pages-new")
    .removeClass("static-pages-update")
    .prop("title", "Create");
  }
});
