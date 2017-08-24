"use strict";
const yaml = require("js-yaml");
const fs   = require("fs");
const expect = require("chai").expect;
const getId = require("../../../lib/get-elements.js");

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("review test", function () {
  it("verifies a review is made succesfully", () => {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));


    const email = "test@test.com";
    const password = "tester";

    browser.waitForExist(".product-grid-list.list-unstyled");
    browser.click(eleMap.login_dropdown_btn);
    browser.waitForExist(".accounts-dropdown.open");
    browser.setValue(getId.retId(eleIds.login_email_fld_id), email);
    browser.setValue(getId.retId(eleIds.login_pw_fld_id), password);
    browser.click(eleMap.login_btn);
    browser.waitForExist("#product-grid-list", 20000);

    browser.click("#BCTMZ6HTxFSppJESk");
    browser.pause(10000);
    browser.scroll(0, 1000);
    browser.pause(4000);
    browser.click(eleMap.star_click);
    browser.pause(2000);
    browser.setValue("#comment", "This is a test review");
    browser.pause(2000);
    browser.click(eleMap.send_review);
    expect(browser.getText("#review2")).to.contain("This is a test review");
  });
});
