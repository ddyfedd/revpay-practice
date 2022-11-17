import './App.css';
import React from "react"
import { ReactDOM } from 'react-dom';
import RevolutCheckout from '@revolut/checkout';

function RevolutPay() {

  RevolutCheckout.payments({
    locale: 'en',
    mode: 'sandbox',
    publicToken: 'pk_t57IdWMw6olEbAd1ftm4qcfQ3UmVbzM3sc63Qq1weJVH2hlr'
  }).then((paymentInstance) => {
    

    const paymentOptions = {
      currency: 'GBP',
      totalAmount: 5000,
      buttonStyle: { variant: 'dark' },

      createOrder: async () => {
        const order = await fetch(`/card/newOrderSandbox`, {
          method: "POST",
          body: JSON.stringify({ amount: paymentOptions.totalAmount, currency: paymentOptions.currency }),
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          },
        })
        .then((res) => res.json())
        .then((data) => {return data})

        console.log(order)
        return ({ publicId: order.public_id })
      }
      
    };

    const revolutPay = paymentInstance.revolutPay;

    revolutPay.mount(
      document.getElementById('revolut-pay'),
      paymentOptions
    );

    revolutPay.on('payment', (event) => {
      switch (event.type) {
        case 'cancel': 
          window.alert(`User cancelled at: ${event.dropOffState}`);
          break;
        
        case 'success':
          window.alert('Payment was successful');
          break;
        
        case 'error':
          window.alert(`Something went wrong: ${event.error.toString()}`);
          break;
        
        default:
          console.log(event);
      }
    })
  })

  return (
    <div id="revolut-pay"></div>
  )
}


function App() {
  return (
    <div className="App">
     <RevolutPay />
    </div>
  );
}

export default App;
