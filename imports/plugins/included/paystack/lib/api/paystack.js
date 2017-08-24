import request from "request";

export const Paystack = {};

const paystackHeaders = (secret) => {
  return {
    "Authorization": `Bearer ${secret}`,
    "Content-Type": "application/json"
  };
};

Paystack.verify = (reference, secret, callback) => {
  const headers = paystackHeaders(secret);
  const url = `https://api.paystack.co/transaction/verify/${reference}`;
  request.get(url, { headers }, (error, response, body) =>  {
    const res = JSON.parse(body);
    if (res.status) {
      callback(null, res);
    } else {
      callback(res, null);
    }
  });
};
