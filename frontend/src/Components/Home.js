import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Checkout from "./Requests/Checkout";
import RevolutCheckout from "@revolut/checkout";

function Home() {
  const [currency, setCurrency] = useState("USD");
  const [searchfield, setSearchfield] = useState("");
  const [cart, setCart] = useState([]);
  const [sum, setSum] = useState(0);
  const [refreshState, setRefreshState] = useState(false);

  const currencies = [
    "USD",
    "EUR",
    "GBP",
    "RON",
    "JPY",
    "CZK",
    "AUD",
    "CAD",
    "AED",
    "CHF",
    "DKK",
    "HKD",
    "NOK",
    "NZD",
    "PLN",
    "QAR",
    "SEK",
    "SGD",
    "TRY",
    "ZAR",
  ];
  const [result, setResult] = useState(null);
  let customer_id = '7e9b1c1d-6315-4a6c-b5a9-52805f2c25ce';

  const items = [
    { name: "Item 1", price: 10 },
    { name: "Item 2", price: 100 },
    { name: "Item 3", price: 1000 },
    { name: "Item 4", price: 150 },
    { name: "Item 5", price: 1500 },
    { name: "Item 6", price: 20 },
    { name: "Item 7", price: 200 },
    { name: "Item 8", price: 2000 },
    { name: "Item 9", price: 1000000 },
    { name: "Item 10", price: 10000 }
  ];

  let history = useHistory();

  useEffect(() => {
    const reducer = (prevVal, currVal) => prevVal + currVal;
    setSum(cart.map((item) => item.price).reduce(reducer, 0));
  }, [cart]);

  const addToCart = (item) => {
    setCart([...cart, items[item]]);
  };

  const removeFromCart = (item) => {
    cart.splice(item, 1);
    setCart([...cart]);
  };



  return (
    <div className="container">
      <h1> Revolut Shop </h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr" }}>
        <div className="items">
          <div className="itemsList" style={{ textAlign: "left" }}>
            <ul>
              <li
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "5px",
                }}
              >
                <input
                  style={{ display: "inline-block", margin: "1em 5px 5px 5px" }}
                  placeholder="Search item"
                  onChange={(event) => {
                    setSearchfield(event.target.value);
                  }}
                ></input>
                <select
                  className="pay-option-button"
                  style={{ padding: "0px 10px" }}
                  onChange={(event) => setCurrency(event.target.value)}
                  placeholder="USD"
                >
                  {currencies.map((currency) => (
                    <option key={currency}> {currency} </option>
                  ))}
                </select>
              </li>
              {items
                .filter((item) =>
                  item.name.toLowerCase().includes(searchfield.toLowerCase())
                )
                .map((item, i) => {
                  return (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "5px",
                      }}
                    >
                      {item.name} Price:{" "}
                      {currency === "USD"
                        ? Math.round(Number(item.price))
                        : currency === "GBP"
                        ? Math.round(Number(item.price) * 0.74)
                        : currency === "EUR"
                        ? Math.round(Number(item.price) * 0.87)
                        : currency === "JPY"
                        ? Math.round(Number(item.price) * 127, 12)
                        : Math.round(Number(item.price) * 4.28)}{" "}
                      {currency}
                      <button
                        className="pay-option-button"
                        onClick={() => {
                          addToCart(i);
                        }}
                      >
                        Add to cart
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
        <div className="Cart" style={{ textAlign: "center" }}>
          {cart.length > 0 ? (
            <div>
              <h2>Cart</h2>
              <ul style={{ listStyle: "none" }}>
                {cart.map((item, i) => {
                  return (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "40%",
                        margin: "0 auto",
                      }}
                    >
                      {item.name}
                      <button
                        className="pay-option-button"
                        onClick={() => removeFromCart(i)}
                        style={{ margin: "5px" }}
                      >
                        Remove from Cart
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button
                className="pay-option-button"
                onClick={() =>
                  Checkout(sum, currency, history, "Sandbox")
                }
              >
                {" "}
                Go to Checkout-Sandbox
              </button>
              <button
                className="pay-option-button"
                onClick={() => Checkout(sum, currency, history, "Live")}
              >
                {" "}
                Go to Checkout-Live
              </button>
              <p
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%)",
                }}
              >
                Total:{" "}
                {currency === "GBP"
                  ? Math.round(sum * 0.74)
                  : currency === "EUR"
                  ? Math.round(sum * 0.87)
                  : currency === "RON"
                  ? Math.round(sum * 4.28)
                  : Math.round(sum)}{" "}
                {currency}
              </p>
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
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;