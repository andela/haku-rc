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

    browser.waitForExist(".product-grid-list.list-unstyled");
    browser.click(eleMap.login_dropdown_btn);
    browser.waitForExist(".accounts-dropdown.open");
    browser.setValue(getId.retId(eleIds.login_email_fld_id), "tester@test.com");
    browser.setValue(getId.retId(eleIds.login_pw_fld_id), "tester");
    browser.click(eleMap.login_btn);
    browser.waitForExist(".product-grid-list.list-unstyled");

    browser.click("#BCTMZ6HTxFSppJESk");
    browser.waitForExist(".pdp.header");
    browser.scroll(0, 300);
    browser.click(eleMap.red_option);
    browser.pause(1000);
    browser.click(".js-add-to-cart");
    browser.waitForVisible(".cart-alert");
    browser.click(".cart-alert-checkout");
    browser.waitForExist(".checkout-progress");
    browser.scroll(0, 500);
    browser.pause(1000);
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
