import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import RevolutCheckout from "@revolut/checkout";
import GetOrder from "./Requests/GetOrder";
import ConfirmOrder from "./Requests/ConfirmOrder";

const PaymentDev  = () => {
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
  let sum = useHistory().location.state.order_amount.value;
  let currency = useHistory().location.state.order_amount.currency;
  let body = useHistory().location.state;
  let location = useHistory().location;

  console.log("public_id-Dev", public_id);
  console.log("order_id-Dev", order_id);
  console.log("amount", sum);
  console.log("body", body);

  // PAY WITH POPUP
  const payWithPopup = () =>
    RevolutCheckout(public_id, "dev").then(function (instance) {
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
    RevolutCheckout(public_id, "dev").then(function (instance) {
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
      mode: "dev",// defaults to prod
      publicToken: "pk_K3RJM1uDOz7xvRldeyfO92tGhzEa61hwaAtNVU05RCxtU6LH" // merchant public token
    }).then((paymentInstance) => {
      const paymentOptions = {
        totalAmount: sum,
        currency: currency, // 3-letter currency code
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
      className="payment-live-page"
      style={{ display: "grid", gridTemplateColumns: "2fr 1fr" }}
    >
      <div>
        <Link className="pay-option-button" to="/">
          Home
        </Link>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            margin: " 10px auto",
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <label></label>
            <input
              name="full_name"
              placeholder="Full Name"
              style={{ width: "100%" }}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
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
            width: "60%",
          }}
        >
          <button className="pay-option-button" id="button-submit">
            Pay with Card
          </button>
          <button className="pay-option-button" onClick={() => payWithPopup()}>
            Pay with Popup
          </button>
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
        <div
          style={{
            width: "400px",
            margin: "10px auto",
            borderRadius: "10px",
            padding: "6px",
          }}
          id="revolut-payment-request"
        ></div>
      </div>
      <div id="order-div">
        <pre>
          <strong>Order</strong>: {JSON.stringify(body, undefined, 2)}
        </pre>
        <button
          className="pay-option-button"
          onClick={() => GetOrder("Dev", order_id, history)}
        >
          Update Order
        </button>
      </div>
    </div>
  );
};


export default PaymentDev