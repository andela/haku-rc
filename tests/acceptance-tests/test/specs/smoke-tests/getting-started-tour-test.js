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

describe("Getting Started Tour", function () {
  it("should give a getting-started tour", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));

    const email = "andela15@y.com";
    const password = "andela15";

    browser.waitForExist(".product-primary-images");
    browser.click(eleMap.login_dropdown_btn);
    browser.waitForExist(".login-form");
    browser.click(eleMap.signup);
    browser.setValue(getId.retId(eleIds.login_email_fld_id), email);
    browser.setValue(getId.retId(eleIds.login_pw_fld_id), password);
    browser.click(eleMap.register);
    browser.pause("5000");
    expect(browser.getText(".introjs-helperNumberLayer")).to.equal("1");
    expect(browser.getText(".text-center")).to.contain("Welcome to Haku RC");
    browser.click(eleMap.skip);
  });
  it("should give a getting-started tour2", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));

    browser.pause(2000);
    browser.click(eleMap.tour_test);
    expect(browser.getText(".introjs-helperNumberLayer")).to.equal("1");
    expect(browser.getText(".text-center")).to.contain("Welcome to Haku RC");
  });
});
