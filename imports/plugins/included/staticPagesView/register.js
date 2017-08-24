import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "Static Pages",
  name: "reaction-static-pages",
  icon: "fa fa-sun-o",
  autoEnable: true,
  settings: {
    name: "Static"
  },
  registry: [{
    route: "/dashboard/static-pages",
    provides: "dashboard",
    workflow: "corePagesWorkFlow",
    name: "staticPages",
    label: "Manage Static Pages",
    description: "Create and manage static pages",
    icon: "fa fa-paperclip",
    priority: 1,
    container: "core",
    template: "staticPages"
  }],
  layout: [{
    layout: "coreLayout",
    workflow: "corePagesWorkFlow",
    collection: "StaticPages",
    theme: "default",
    enabled: true,
    structure: {
      template: "staticPages",
      layoutHeader: "layoutHeader",
      layoutFooter: "layoutFooter",
      notFound: "notFound",
      dashboardHeader: "dashboardHeader",
      dashboardHeaderControls: "filterStatic",
      dashboardControls: "dashboardControls",
      adminControlsFooter: "adminControlsFooter"
    }
  }]
});
