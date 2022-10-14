var express = require("express");
var router = express.Router();
var axios = require("axios");

var API_KEY_SANDBOX = process.env.API_KEY_SANDBOX;
var API_KEY_LIVE = process.env.API_KEY_LIVE;

/* Test call */

router.post("/", async function (req, res, next) {
  let data = req.body;
  console.log("request to backend reached with following req.body", data)
  res.json(data);
});

/* SANDBOX */
/* New Order Sandbox */

router.post("/newOrderSandbox", async function (req, res, next) {
  let data = req.body;
  let response = await axios.post(
    "https://sandbox-merchant.revolut.com/api/1.0/orders",
    data,
    {
      headers: {
        Authorization: `Bearer ${API_KEY_SANDBOX}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  );
  res.header("Access-Control-Allow-Origin","*");
  res.json(response.data);
});

/* Retrieve Order Sandbox */

router.post("/retrieveOrderSandbox", async function (req, res, next) {
  
  let order_id = req.body.order_id;
  axios.get(`https://sandbox-merchant.revolut.com/api/1.0/orders/${order_id}`, {
      headers: {
        Authorization: `Bearer ${API_KEY_SANDBOX}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    })
    .then((resp) => {
      console.log("Order retrieved successful ", resp.data);
      res.json(resp.data);
    })
    .catch((err) => {
      throw err;
    });
});

/* Confirm Order Sandbox */

router.post("/confirmOrderSandbox", async function (req, res, next) {
  let payment_method_id = req.body.payment_method_id;
  let order_id = req.body.order_id;
  let data = {  payment_method_id, initiator: "CUSTOMER" };
  axios.post(`https://sandbox-merchant.revolut.com/api/1.0/orders/${order_id}/confirm`, 
    data, {
      headers: {
        Authorization: `Bearer ${API_KEY_SANDBOX}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    })
    .then((resp) => {
      console.log(">>>>> OK ", resp.data);
      res.json(resp.data);
    })
    .catch((err) => {
      throw err;
    });
});

/* DEV */
/* New Order Dev */

router.post("/newOrderLive", async function (req, res, next) {
  let data = req.body;
  let response = await axios.post(
    "https://merchant.revolut.codes/api/1.0/orders",
    data,
    {
      headers: {
        Authorization: `Bearer ${API_KEY_LIVE}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  );
  res.json(response.data);
});

/* Update Order Live */

router.post("/updateOrderLive", async function (req, res, next) {
  let amount = req.body.amount;
  let currency = req.body.currency;
  let data = { amount, currency };
  let order_id = req.body.order_id;
  axios.patch(`https://merchant.revolut.codes/api/1.0/orders/${order_id}`, 
    data, {
      headers: {
        Authorization: `Bearer ${API_KEY_LIVE}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    })
    .then((resp) => {
      console.log(">>>>> OK ", resp.data);
      res.json(resp.data);
    })
    .catch((err) => {
      throw err;
    });
});


/* Retrieve Order Dev */

router.post("/retrieveOrderLive", async function (req, res, next) {
  
  let order_id = req.body.order_id;
  axios.get(`https://merchant.revolut.codes/api/1.0/orders/${order_id}`, {
      headers: {
        Authorization: `Bearer ${API_KEY_LIVE}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    })
    .then((resp) => {
      console.log("Order retrieved successful ", resp.data);
      res.json(resp.data);
    })
    .catch((err) => {
      throw err;
    });
});

module.exports = router;