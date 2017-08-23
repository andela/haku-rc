"use strict";
const yaml = require("js-yaml");
const fs   = require("fs");
const expect = require("chai").expect;

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("facebook test", function () {
  it("verifies the facebook integration shows correctly", () => {
    //const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));

    // browser.pause("5000");
    // browser.click(eleMap.product_click);
    browser.waitForExist("#HRzqEH2K73FhZaakd");
    browser.click("#HRzqEH2K73FhZaakd");
    browser.pause("5000");
    browser.scroll(0, 1000);
    browser.pause("5000");
    expect(browser.getAttribute("div", "fb-integration")).to.exist;
  });
});
