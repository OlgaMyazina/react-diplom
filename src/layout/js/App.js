import React, {Component} from "react";
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import HeaderComponent from "./HeaderComponent/HeaderComponent";
import Footer from "./Footer/Footer";
import Home from "./Home/Home";
import Catalog from "./Catalog/Catalog";
import Product from "./Product/Product";
import ProductList from "./ProductList/ProductList";
import Order from "./Order/Order";
import Favorite from "./Favorite/Favorite";
import About from "./About/About";
import Cart from "./Cart/Cart";
import OrderDone from "./OrderDone/OrderDone";
import ScrollToTop from "./ScrollToTop/ScrollToTop";
//import ProductComponent from "./ProductComponent/ProductComponent";

export const CategoriesContext = React.createContext({
    categories: []
  }
);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    }
  }

  componentDidMount() {
    const urlCategories = "https://api-neto.herokuapp.com/bosa-noga/categories";
    const cartId = localStorage.getItem("cartId") ? JSON.parse(localStorage.getItem("cartId")) : '';
    const urlCart = `https://api-neto.herokuapp.com/bosa-noga/cart/${cartId}`;


    const params = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };
    fetch(urlCategories, params)
      .then(response => response.json())
      .then(result => this.setState({categories: result}));
    if (cartId) {
      fetch(urlCart, params)
        .then(response => response.json())
        .then(result => {
          this.setState({products: result.data ? result.data.products : this.state.products})
        })
    }
  }

  handlerAddToCart = (id, size, amount) => {
    const obj = localStorage.getItem("cartId");
    const cartId = (obj && obj != "undefined") ? JSON.parse(localStorage.getItem("cartId")) : '';
    const currentProduct = {
      "id": parseInt(id),
      "size": parseInt(size),
      "amount": parseInt(amount)
    };
    const params = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        ...currentProduct
      })
    };
    const url = `https://api-neto.herokuapp.com/bosa-noga/cart/${cartId ? cartId : ""}`;
    fetch(url, params)
      .then(response => response.json())
      .then(result => {
        if (result.data) {
          localStorage.setItem("cartId", JSON.stringify(result.data.id));
        }
        const products = this.state.products ? this.state.products : [];
        const productIndex = products.findIndex(product => {
          return product.id === currentProduct.id
        });
        if (productIndex === -1) {
          //такого товара нет
          products.push(currentProduct);
        } else {
          products[productIndex] = currentProduct;
        }
        this.setState({products: products});

      })
  };

  handlerRemoveFromCart = (id, size, amount) => {
    const obj = localStorage.getItem("cartId");
    const cartId = (obj && obj != "undefined") ? JSON.parse(localStorage.getItem("cartId")) : '';

    const params = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        "id": parseInt(id),
        "size": parseInt(size),
        "amount": parseInt(amount)
      })
    };
    const url = `https://api-neto.herokuapp.com/bosa-noga/cart/${cartId ? cartId : ""}`;
    fetch(url, params)
      .then(response => response.json())
      .then(result => {
        localStorage.setItem("cartId", JSON.stringify(result.data.id));
        this.setState({products: result.data.products})
      })
      .catch(reason => {
        localStorage.removeItem("cartId");
        this.setState({products: []})
      });

  };

  render() {
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <ScrollToTop>

        <CategoriesContext.Provider value={this.state}>
          <HeaderComponent onRemoveFromCart={this.handlerRemoveFromCart} products={this.state.products}/>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/cart" render={(props) => (<Cart {...props} products={this.state.products}/>)}/>
              <Route path="/product/:id?" render={(props) => (
                <Product {...props} onAddToCart={this.handlerAddToCart}/>
              )}/>
              <Route path="/catalog/:id?" render={(props) => (
                <Catalog {...props} />
              )}/>
              <Route path="/productlist" component={ProductList}/>
              <Route path="/order" component={(props) => (<Order {...props}
                                                                 products={this.state.products}
                                                                 onAdd={this.handlerAddToCart}
                                                                 onRemove={this.handlerRemoveFromCart}/>)}/>
              <Route path="/orderdone" component={OrderDone}/>
              <Route path="/favorite" component={Favorite}/>
              <Route path="/about" component={About}/>

            </Switch>
          <Footer/>
        </CategoriesContext.Provider>
        </ScrollToTop>

      </BrowserRouter>
    )
  }
}


