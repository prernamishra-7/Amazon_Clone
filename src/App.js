import "./App.css";
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login"
import { auth } from './firebase';
import { useStateValue } from './StateProvider';
//import CheckoutProduct from "./CheckoutProduct";
import Checkout from "./Checkout"
import Payment from "./Payment";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";

const promise = loadStripe('pk_test_51Jm05cSHwcVk7iK8EyrlM9XS7VF8gXcRkWjBaSx2wKy8ospzkHGOnb0JhWYWvvdD8E8eS14qP5qI3L1XxvRJGtrh00aSkctuQK');

function App() {
  const [{ }, dispatch] = useStateValue();
  useEffect(() => {
    // will only run once when the app component loads...
    auth.onAuthStateChanged(authUser => {
      console.log("THE USER IS >>>", authUser);
      if (authUser) {
        //the user just logged in / the user has logged in
        dispatch({
          type: 'SET_USER',
          user: authUser
        })
      }
      else {
        //the user is logged out
        dispatch({
          type: 'SET_USER',
          user: null
        })
      }
    })
  }, [])
  return (
    <Router>
      <div className="app">


        <Switch>
          
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/checkout">
            <Header />
            <Checkout />
          </Route>
          <Route path="/payment">
          <Header/>
          <Elements stripe={promise}>
          <Payment/>
          </Elements>
          </Route>
          <Route path="/">
            <Header />
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>

  );
}
export default App;