import { StaticPages } from "/lib/collections";
import { Template } from "meteor/templating";
import * as CommonMark from "meteor/themeteorchef:commonmark";

Template.staticPageView.helpers({
  page(slug) {
    const page = StaticPages.find({slug}).fetch();
    const pageContent = CommonMark.parseMarkdown(page[0].content);
    return ([{title: page[0].title, content: pageContent}]);
  }
});
