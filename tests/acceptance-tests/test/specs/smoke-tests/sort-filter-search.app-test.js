"use strict";
const yaml = require("js-yaml");
const fs   = require("fs");
const expect = require("chai").expect;

// define variables used in the test
const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
const inputText = "o";

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Sort and Filter Search Results", function () {
  it("should filter the results by below $50", function () {
    browser.waitForExist(".product-grid-list.list-unstyled");
    browser.click(eleMap.search_test);
    browser.waitForExist("#search-input");
    browser.setValue("#search-input", inputText);
    browser.selectByIndex(eleMap.filter_dropdown, 1);
    browser.waitForExist(".cj-title");
    const results = browser.getText(".cj-title");
    expect(results).to.contain("BASIC REACTION PRODUCT");
    expect(results).to.not.contain("IPHONE 7");
    expect(results).to.not.contain("NOKIA 6");
  });

  it("should filter the results by $100 - $500", function () {
    browser.waitForExist(".product-grid-list.list-unstyled");
    browser.click(eleMap.search_test);
    browser.waitForExist("#search-input");
    browser.setValue("#search-input", inputText);
    browser.selectByIndex(eleMap.filter_dropdown, 3);
    browser.waitForExist(".cj-title");
    const results = browser.getText(".cj-title");
    expect(results).to.contain("IPHONE 7");
    expect(results).to.contain("NOKIA 6");
    expect(results).to.not.contain("BASIC REACTION PRODUCT");
  });

  it("should sort the results by Highest Price", function () {
    browser.waitForExist(".product-grid-list.list-unstyled");
    browser.click(eleMap.search_test);
    browser.selectByIndex(eleMap.sort_dropdown, 2);
    browser.waitForExist("#search-input");
    browser.setValue("#search-input", inputText);
    browser.waitForExist(".cj-title");
    const results = browser.getText(".cj-title");
    expect(results[0]).to.equal("IPHONE 7");
    expect(results[1]).to.equal("NOKIA 6");
  });
});
