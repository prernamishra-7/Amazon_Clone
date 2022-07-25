import React, { useState } from 'react'
import CheckoutProduct from './CheckoutProduct';
import './Payment.css'
import { useStateValue } from "./StateProvider"
import { Link,useHistory } from "react-router-dom"
import CurrencyFormat from "react-currency-format"
import { getBasketTotal } from './reducer';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useEffect } from 'react';
import { Sync } from '@material-ui/icons';
import axios from "./axios";
import { db } from './firebase';


function Payment() {
    const [{ basket, user }, dispatch] = useStateValue();
    const history = useHistory();

    const stripe = useStripe();
    const elements = useElements();

    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState(true);

    useEffect(() => {
        //generate the special stripe secret which alllows us to charge a customer
        const getClientSecret = async () => {
            const response = await axios(
                {
                    method: 'post',
                    //stripe expects the total in a currencies sub units
                    url: `/payments/create?total=${getBasketTotal(basket)*100}`
                });
                setClientSecret(response.data.clientSecret);

      }
      getClientSecret();

}, [basket]);


const handleSubmit = async (event) => {
    //do all the fancy stripe stuff here...
    event.preventDefault();
    setProcessing(true);

    const payLoad = await stripe.confirmCardPayment(clientSecret,{
        payment_method:{
            card: elements.getElement(CardElement)
        }
    }).then(({paymentIntent})=>{
        //paymentIntent = payment confirmation

        db
        .collection('users')
        .doc('user?.uid')
        .collection('orders')
        .doc(paymentIntent.amount)
        .set({
            basket: basket,
            amount: paymentIntent.amount,
            created: paymentIntent.created
        }) 

        setSucceeded(true);
        setError(null);
        setProcessing(false);

        dispatch({
            type: 'EMPTY_BASKET'
        })

        history.replace('/orders')
    })
}

const handleChange = event => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
}


return (
    <div className="payment">
        <div className="payment__container">

            <h1>
                Checkout{
                    <Link to="/checkout"> {basket?.length} items</Link>
                }
            </h1>

            {/* Payment section - delivery address */}
            <div className="payment__section">
                <div className="payment__title">
                    <h3>Delivery Address</h3>
                </div>
                <div className="payment__address">
                    <p>{user?.email}</p>
                    <p>Ract Lane</p>
                    <p>Los Angeles</p>
                </div>
            </div>

            {/* Payment section - Review item*/}
            <div className="payment__section">
                <div className="payment__title">
                    <h3>Review items and delivery</h3>
                </div>
                <div className="payment__items">
                    {basket.map(item => (
                        <CheckoutProduct
                            id={item.id}
                            title={item.title}
                            image={item.image}
                            price={item.price}
                            rating={item.rating}
                        />


                    ))}
                </div>


            </div>

            {/* Payment section - Payment method */}
            <div className="payment__section">
                <div className="payment__title">
                    <h3>Payment Method</h3>
                </div>
                <div className="payment__details">
                    {/* Strip magic will go*/}

                    <form onSubmit={handleSubmit}>
                        <CardElement onChange={handleChange} />
                        <div className='payment__priceContainer'>
                            <CurrencyFormat
                                renderText={(value) =>
                                (
                                    <>
                                        <p>
                                            <h3>Order total: {value}</h3>
                                        </p>
                                        {/* <small className="subtotal__gift">
                                                <input type="checkbox" />This order contains a gift
                                            </small> */}
                                    </>
                                )}
                                decimalScale={2}
                                value={getBasketTotal(basket)}
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"$"}
                            />
                            <button disabled={processing || disabled || succeeded}>
                                <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                            </button>
                        </div>
                        {/* Errors */}
                        {error && <div>{error}</div>}
                    </form>
                </div>


            </div>
        </div>
    </div>
)
}

export default Payment

// import React from 'react'
// import { useStateValue } from "./StateProvider"
// import CheckoutProduct from './CheckoutProduct';
// import { Link, useHistory } from "react-router-dom"
// import './Payment.css'

// // import { useStateValue } from "./StateProvider"
// // 
// function Payment() {

//     const [{ basket, user }, dispatch] = useStateValue();
//     return (
//         <div className="payment">
//             <div className="payment__container">

//                 <h1>
//                     Checkout{
//                         <Link to="/checkout"> {basket?.length} items</Link>
//                     }
//                 </h1>

//                 {/* Payment section - delivery address */}
//                 <div className="payment__section">
//                     <div className="payment__title">
//                         <h3>Delivery Address</h3>
//                     </div>
//                     <div className="payment__address">
//                         <p>{user?.email}</p>
//                         <p>Ract Lane</p>
//                         <p>Los Angeles</p>
//                     </div>
//                 </div>

//                 {/* Payment section - Review item*/}
//                 <div className="payment__section">
//                     <div className="payment__title">
//                         <h3>Review items and delivery</h3>
//                     </div>
//                     <div className="payment__items">
//                         {basket.map(item => (
//                             <CheckoutProduct
//                                 id={item.id}
//                                 title={item.title}
//                                 image={item.image}
//                                 price={item.price}
//                                 rating={item.rating}
//                             />


//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Payment
