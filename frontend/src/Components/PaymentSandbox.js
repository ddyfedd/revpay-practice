import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import RevolutCheckout from "@revolut/checkout";
import GetOrder from "./Requests/GetOrder";
import ConfirmOrder from "./Requests/ConfirmOrder";

const PaymentSandbox  = () => {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [billingAddress, setBillingAddress] = useState({
    countryCode: "",
    region: "",
    city: "",
    streetLine1: "",
    streetLine2: "",
    postcode: "",
  });

  console.log(billingAddress);
  const getBillingAddress = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setBillingAddress({ ...billingAddress, [name]: value });
  };
  
  let history = useHistory();
  let public_id = useHistory().location.state.public_id;
  let order_id = useHistory().location.state.id;
  let body = useHistory().location.state;
  let state = useHistory().location.state.state;
  let orderAmount = useHistory().location.state.order_amount.value;
  let orderCurrency = useHistory().location.state.order_amount.currency;
  let for_merchant = "";
  let for_customer = "7e9b1c1d-6315-4a6c-b5a9-52805f2c25ce";


  // PAY WITH POPUP
  const payWithPopup = () =>
    RevolutCheckout(public_id, "sandbox").then(function (instance) {
      instance.payWithPopup({
        onSuccess() {
          window.alert("Thank you! Payment was succesful");
        },
        onError(message) {
          window.alert(`Popup trigger :( ${message}.`);
        },
        name,
        email,
        billingAddress,
        savePaymentMethodFor: "merchant",
      });
    });

    // PAY WITH CARD FIELD
    RevolutCheckout(public_id, "sandbox").then(function (instance) {
      var card = instance.createCardField({
        target: document.getElementById("card-field"),
        onSuccess() {
          setTimeout(() => {
            window.alert("Thank you! Payment completed");
          }, 1000);
        },
        onError(message) {
          window.alert(`Cardfield trigger :( ${message}.`);
        },
      });
  
      document
        .getElementById("button-submit")
        .addEventListener("click", function () {
          card.submit({
            name,
            email,
            billingAddress,
          });
        });
    });

    RevolutCheckout.payments({
      locale: 'en',
      mode: "sandbox",// defaults to prod
      publicToken: "pk_t57IdWMw6olEbAd1ftm4qcfQ3UmVbzM3sc63Qq1weJVH2hlr" // merchant public token
    }).then((paymentInstance) => {
      const paymentOptions = {
        totalAmount: orderAmount,
        currency: orderCurrency, // 3-letter currency code
        buttonStyle: { variant: "dark" },

        createOrder: () => ({ publicId: public_id }),
    };
    
    const revolutPay = paymentInstance.revolutPay
    
    revolutPay.mount(
      document.getElementById("revolut-pay2.0"),
      paymentOptions
      );
      
    revolutPay.on("payment", (event) => {
      switch (event.type) {
        case "cancel": {
          window.alert(`User cancelled at: ${event.dropOffState}`);
          break;
        }
        case "success":
          window.alert("Payment with Revpay2 successful");
          break;
    
        case "error":
          window.alert(
            `Something went wrong with RevolutPay 2.0: ${event.error.toString()}`
          );
          break;
        default: {
          console.log(event);
        }
      }
    })
  });

  return (
    <div
      className="payment-sandbox-page"
      style={{ display: "grid", gridTemplateColumns: "2fr 1fr" }}
    >
      <div>
        <Link className="pay-option-button" to="/">
          Home
        </Link>
        <div>
          <p>Use the folowing test cards for succesful payments:</p>
          <p>Visa: 4929420573595709</p>
          <p>Mastercard: 5281438801804148</p>
          <p>
            For expiry date use any future date, and for CVV any numbers you
            wish
          </p>
        </div>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            margin: "10px auto",
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <div style={{ display: "flex", alignItems: "stretch" }}>
            <label></label>
            <input
              name="full_name"
              placeholder="Full name"
              style={{ width: "100%" }}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
            }}
          >
            <label></label>
            <input
              name="email"
              placeholder="customer@example.com"
              style={{ width: "100%" }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label></label>
            <div name="card"></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Billing Address</label>

            <input
              name="countryCode"
              placeholder="Country Code"
              onChange={getBillingAddress}
            />
            <input
              name="region"
              placeholder="Region"
              onChange={getBillingAddress}
            />
            <input
              name="city"
              placeholder="City"
              onChange={getBillingAddress}
            />
            <input
              name="streetLine1"
              placeholder="Address line 1"
              onChange={getBillingAddress}
            />
            <input
              name="streetLine2"
              placeholder="Address line 2"
              onChange={getBillingAddress}
            />
            <input
              name="postcode"
              placeholder="Postal Code"
              onChange={getBillingAddress}
            />
          </div>
        </form>
        <div
          style={{
            width: "400px",
            margin: "10px auto",
            border: "solid black 3px",
            borderRadius: "10px",
            padding: "6px",
            background: "#fff",
          }}
          id="card-field"
        ></div>
        <div
          className="payButtons"
          style={{
            margin: "10px auto",
            display: "flex",
            justifyContent: "space-between",
            width: "40%",
          }}
        >
          <button className="pay-option-button" id="button-submit">
            Pay with Card
          </button>
          <button className="pay-option-button" onClick={() => payWithPopup()}>
            Pay with Popup
          </button>
          <button
            className="pay-option-button"
            title="For paying with saved payment method"
            onClick={() => ConfirmOrder(for_customer, order_id)}
          >
            {" "}
            Confirm Order
          </button>{" "}
        </div>
        <div
          style={{
            width: "400px",
            margin: "10px auto",
            borderRadius: "10px",
            padding: "6px",
          }}
          id="revolut-pay"
        ></div>
        <div
          style={{
            width: "400px",
            margin: "10px auto",
            borderRadius: "10px",
            padding: "6px",
          }}
          id="revolut-pay2.0"
        ></div>
        <div id="revolut-payment-request"></div>
      </div>
      <div id="order-div">
        <pre>
          <strong>Order</strong>: {JSON.stringify(body, undefined, 2)}
        </pre>
        <button
          className="pay-option-button"
          onClick={() => GetOrder("Sandbox", order_id, history)}
        >
          Update Order
        </button>
      </div>
    </div>
  );
};

export default PaymentSandbox