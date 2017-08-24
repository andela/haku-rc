"use strict";
const yaml = require("js-yaml");
const fs = require("fs");
const expect = require("chai").expect;
const getId = require("../../../lib/get-elements.js");
const helper = require("./payment_helper");

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Fund wallet and Transfer fund", function () {
  it("User can successfully fund wallet and transfer to another wallet", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));
    const usrData = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/user-data.yml", "utf8"));

    const depositAmount = "5000";
    const transferAmount = "5000";
    const secondEmail = "joelakwes@gmail.com";

    helper.startUp(eleMap, eleIds, getId, usrData, browser);

    browser.waitForExist("#logged-in-display-name");
    browser.click("#logged-in-display-name");
    browser.waitForExist("#wallet");
    browser.click("#wallet");
    browser.pause("5000");
    browser.setValue(getId.customRetId(eleIds.deposit_amount_id), depositAmount);
    browser.pause("3000");
    browser.click(eleMap.fund_wallet_click);
    browser.pause("5000");
    helper.paymentHelper(eleMap, eleIds, getId, browser);
    browser.switchTab();

    browser.setValue("#transferAmount", transferAmount);
    browser.pause("3000");
    browser.setValue("#recipient", secondEmail);
    browser.pause("3000");
    browser.click("#transfer-money");
    browser.pause("3000");
    browser.click(".swal2-confirm");
    browser.pause("5000");

    expect(browser.getText("#logged-in-display-name")).to.equal("Guest");
  });
});
