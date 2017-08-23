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

    browser.pause("5000");
    browser.click(eleMap.login_dropdown_btn);
    browser.pause(5000);
    browser.setValue(getId.retId(eleIds.login_email_fld_id), email);
    browser.setValue(getId.retId(eleIds.login_pw_fld_id), password);
    browser.click(eleMap.login_btn);
    browser.pause("5000");


    browser.click(eleMap.product_click);
    browser.pause("5000");
    browser.scroll(-100, 1000);
    browser.pause("5000");
    browser.click(eleMap.star_click);
    browser.pause("1000");
    browser.setValue("#comment", "This is a review");
    browser.pause("2000");
    browser.click(eleMap.send_review);
    browser.pause("1000");
    expect(browser.getAttribute("div", "fb-integration")).to.exist;
  });
});
