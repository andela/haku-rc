"use strict";
const yaml = require("js-yaml");
const fs = require("fs");
const expect = require("chai").expect;
const getId = require("../../../lib/get-elements.js");


beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Notification", () => {
  it("Should send an sms notification when a user makes an order", () => {
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));

    browser.waitForExist(".product-grid-list.list-unstyled");
    browser.click(eleMap.login_dropdown_btn);
    browser.waitForExist(".accounts-dropdown.open");
    browser.setValue(getId.retId(eleIds.login_email_fld_id), "tester@test.com");
    browser.setValue(getId.retId(eleIds.login_pw_fld_id), "tester");
    browser.click(eleMap.login_btn);
    browser.waitForExist(".product-grid-list.list-unstyled");

    browser.click("#how-to-shop");
    browser.waitForVisible(".h3", 5000);
    expect(browser.getText(".h3")).to.equal("Shopping Online With Reaction Commerce");
  });
});
