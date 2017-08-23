"use strict";
const yaml = require("js-yaml");
const fs = require("fs");
const expect = require("chai").expect;
const getId = require("../../../lib/get-elements.js");
const shopUser = require("../../../lib/user-shop-actions.js");


beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Notification", () => {
  it("Should send an sms notification when a user makes an order", () => {
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));

    browser.pause(5000);
    browser.click(eleMap.login_dropdown_btn);
    browser.pause(5000);
    browser.setValue(getId.retId(eleIds.login_email_fld_id), "tester@test.com");
    browser.setValue(getId.retId(eleIds.login_pw_fld_id), "tester");
    browser.click(eleMap.login_btn);
    browser.pause(5000);

    browser.click("#BCTMZ6HTxFSppJESk");
    browser.pause(6000);
    browser.scroll(0, 300);
    browser.pause(4000);
    browser.click(eleMap.red_option);
    browser.pause(1000);
    browser.click(".js-add-to-cart");
    browser.pause(2000);
    browser.click(".cart-alert-checkout");
    browser.pause(3000);
    browser.scroll(0, 500);
    browser.click(eleMap.free_shipping);
    browser.waitForEnabled(eleMap.example_payment, 5000);
    browser.click(eleMap.example_payment);
    shopUser.examplePaymentInfo();
    browser.waitForEnabled(eleMap.example_payment_complete_order_btn, 5000);
    browser.click(eleMap.example_payment_complete_order_btn);
    browser.waitForVisible("#order-status", 10000);
    expect(browser.getText("#order-status")).to.equal("Your order is now submitted.");
  });
});
