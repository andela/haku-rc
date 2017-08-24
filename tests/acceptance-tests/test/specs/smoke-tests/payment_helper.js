exports.paymentHelper = (eleMap, eleIds, getId, browser) => {
  const cardNumber = "4084 0840 8408 4081";
  const expiryDate = "0120";
  const cvv = "408";

  const frameCount = browser.selectorExecuteAsync("//iframe", function (frames, message, callback) {
    const paystackIframe = document.getElementsByTagName("iframe");
    const IframeName = paystackIframe[0].name;
    callback(IframeName);
  }, " iframe on the page");
  browser.pause("10000");
  browser.frame(frameCount);
  browser.waitForExist("#cardnumber");
  browser.setValue("#cardnumber", cardNumber);
  browser.pause("1000");
  browser.setValue("#expiry", expiryDate);
  browser.pause("1000");
  browser.setValue("#cvv", cvv);
  browser.pause("1000");
  browser.click("#pay-btn");
  browser.pause("6000");
};

exports.startUp = (eleMap, eleIds, getId, usrData, browser) => {
  const guestEmail = process.env.REACTION_EMAIL || usrData.guest_email;
  const guestPassword = process.env.REACTION_AUTH || usrData.guest_pw;
  browser.waitForExist(eleMap.login_dropdown_btn);
  browser.click(eleMap.login_dropdown_btn);
  browser.waitForExist(".login-form");
  browser.setValue(getId.retId(eleIds.login_email_fld_id), guestEmail);
  browser.setValue(getId.retId(eleIds.login_pw_fld_id), guestPassword);
  browser.click(eleMap.login_btn);
  browser.waitForExist(".product-grid-list.list-unstyled");
};
