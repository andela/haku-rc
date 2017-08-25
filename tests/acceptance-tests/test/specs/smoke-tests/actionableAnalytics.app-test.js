"use strict";
const yaml = require("js-yaml");
const fs   = require("fs");
const expect = require("chai").expect;
const getId = require("../../../lib/get-elements.js");

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
  // browser.getSession().then(function (sessionid) {
  //   browser.sessionID = sessionid.id_;
  // });
});

describe("actionable analytics test", function () {
  it("should show analytics data", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));
    const usrData = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/user-data.yml", "utf8"));

    // default to process env if we've got that
    const adminEmail = process.env.REACTION_EMAIL || usrData.admin_email;
    const adminPassword = process.env.REACTION_AUTH || usrData.admin_pw;

    browser.waitForExist(".product-grid-list.list-unstyled");
    browser.click(eleMap.login_dropdown_btn);
    browser.pause(5000);
    browser.setValue(getId.retId(eleIds.login_email_fld_id), adminEmail);
    browser.setValue(getId.retId(eleIds.login_pw_fld_id), adminPassword);
    browser.click(eleMap.login_btn);
    browser.pause("10000");
    browser.click("#logged-in-display-name");
    browser.waitForExist(".dropdown.open");
    browser.click("#dropdown-apps-dashboard");
    browser.pause("5000");
    browser.click(eleMap.analytics);
    browser.pause("5000");
    expect(browser.getAttribute("h2", "actionable-analytics")).to.exist;
    expect(browser.getText("#actionable-analytics")).to.equal("Actionable Analytics Overview");
  });
});
