"use strict";
const yaml = require("js-yaml");
const fs   = require("fs");
const expect = require("chai").expect;

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Real Time Search", function () {
  it("should display all three products that meet the search criteria", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const inputText = "e";

    browser.waitForExist(".product-primary-images");
    browser.click(eleMap.search_test);
    browser.waitForExist("#search-input");
    browser.setValue("#search-input", inputText);
    browser.waitForExist("#suggestedTitle");
    expect(browser.getText("#suggestedTitle")).to.contain("BASIC REACTION PRODUCT");
    expect(browser.getText("#suggestedTitle")).to.contain("BETTER NAME");
    expect(browser.getText("#suggestedTitle")).to.contain("ADETOKUNBO");
  });
  it("should display all two products that meet the search criteria", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const inputText = "et";

    browser.waitForExist(".product-primary-images");
    browser.click(eleMap.search_test);
    browser.waitForExist("#search-input");
    browser.setValue("#search-input", inputText);
    browser.waitForExist("#suggestedTitle");
    expect(browser.getText("#suggestedTitle")).to.contain("BETTER NAME");
    expect(browser.getText("#suggestedTitle")).to.contain("ADETOKUNBO");
  });
  it("should display the only product that meet the search criteria", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const inputText = "ett";

    browser.waitForExist(".product-primary-images");
    browser.click(eleMap.search_test);
    browser.waitForExist("#search-input");
    browser.setValue("#search-input", inputText);
    browser.waitForExist("#suggestedTitle");
    expect(browser.getText("#suggestedTitle")).to.equal("BETTER NAME");
  });
});
