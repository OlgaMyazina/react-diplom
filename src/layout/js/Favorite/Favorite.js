import React, {useState} from "react";

import Pagination from "../Pagination/Pagination";
import ProductList from "../ProductList/ProductList";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import {FavoriesContext} from "../App";

export default class Favorite extends React.Component {
  constructor(props) {
    super(props);
    const products = JSON.parse(localStorage.getItem("products"));
    this.state = {
      favorite: products ? products.products : [],
      products: [],
      sortFavoriteProduct: "popular",
    }
  }

  componentDidMount() {
    this.props.productIds.map(productId => this.getProduct(productId));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.productIds !== this.props.productIds) {
      this.props.productIds.map(productId => this.getProduct(productId));
    }
  }

  getProduct = (id) => {
    const params = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };
    const url = `https://api-neto.herokuapp.com/bosa-noga/products/${id}`;
    return fetch(url, params)
      .then(response => response.json())
      .then(result => {
        const products = this.state.products;
        products.push(result.data);
        return this.setState({products: products})
      });
  };


  isEmpty = () => {
    if (!this.state.favorite)
      return true;
    return this.state.favorite.length <= 0;
  };

  handleSort = (event) => {
    if (event.target.value === "price") {
      this.setState({sortFavoriteProduct: "price"});
    }
    if (event.target.value === "popular") {
      this.setState({sortFavoriteProduct: "popular"});
    }
  };

  sortAsc = () => {
    return this.state.products.sort((elem1, elem2) => {
      return elem1.price - elem2.price;
    });
  };

  sortDesc = () => {
    return this.state.products.sort((elem1, elem2) => {
      return elem2.price - elem1.price;
    });
  };


  render() {
    console.log("render favorite -> products ",this.state.sortFavoriteProduct, this.state.sortFavoriteProduct=== "popular", this.sortFavoriteProduct === "popular" ? this.sortDesc() : this.sortAsc());
    return (

      <>
        <div className="wrapper wrapper_favorite">
          <div className="site-path">
            {/*todo: breadcrumbs*/}
            <Breadcrumbs {...this.props}/>
          </div>
          <FavoriesContext.Consumer>
            {({isFavorite, toggleFavorite}) => {
              return (
                <main className="product-catalogue product-catalogue_favorite">
                  <section className="product-catalogue__head product-catalogue__head_favorite">
                    <div className="product-catalogue__section-title">
                      <h2
                        className="section-name">{this.isEmpty() ? "В вашем избранном пока ничего нет" : "В вашем избранном"}</h2>
                      <span
                        className={`${this.isEmpty() ? "hidden" : ""} amount amount_favorite`}> {`${this.props.productIds ? this.props.productIds.length : 0} товаров`}</span>
                    </div>
                    <div className={`${this.isEmpty() ? "hidden" : ""} product-catalogue__sort-by`}>
                      <p className="sort-by">Сортировать</p>
                      <select id="sorting" name="" value={this.state.sortFavoriteProduct} onChange={this.handleSort}>
                        <option value="price">по цене</option>
                        <option value="popular">по популярности</option>
                      </select>
                    </div>
                  </section>
                  <section className="product-catalogue__item-list product-catalogue__item-list_favorite">
                    {!this.isEmpty() &&
                    <ProductList products={this.state.sortFavoriteProduct === "popular" ? this.sortDesc() : this.sortAsc()}/>}
                  </section>
                  <div
                    className={`${this.state ? (this.state.products.length > 16 ? "" : "hidden") : "hidden"} product-catalogue__pagination`}>
                    <Pagination/>
                  </div>
                </main>)
            }}
          </FavoriesContext.Consumer>
        </div>
      </>
    )

  };
}