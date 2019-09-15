import React from 'react';

import {CategoriesContext, FavoriesContext} from "../App";
import CategoryNewProducts from "../CategoryNewProducts/CategoryNewProducts";
import SliderNewProducts from "../SliderNewProducts/SliderNewProducts";

const {Provider, Consumer} = React.createContext();

export default class NewProducts extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getFeaturedProducts();
  }

  isMenuItemActive = (value) => {
    return (value === this.props.isMainMenuActive) ? "main-menu__item_active" : "";
  };

  handlerCategory = (event) => {
    event.preventDefault();
    this.setState({categoryActive: event.target.getAttribute("data-category-id")});
  };

  getCategoryActive = (value) => {
    if (this.state) {
      return this.state.categoryActive;
    }
    this.setState({categoryActive: value.categories ? value.categories.data[0].id : ""});
  };

  getFeaturedProducts = () => {
    const url = 'https://api-neto.herokuapp.com/bosa-noga/featured';
    const params = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };
    return fetch(url, params)
      .then(response => response.json())
      .then(result => {
        this.setState({products: result})
      });
  };

  getProducts = () => {
    if ((this.state && this.state.categoryActive && this.state.products)) {
      return this.state.products.data.filter(product => {
        return parseInt(product.categoryId) === parseInt(this.state.categoryActive);
      })
    }
    return null;
  };

  handlerFavoriteClick = (product, event) => {
    event.preventDefault();
    //получаем значения из хранилица
    const returnObj = JSON.parse(localStorage.getItem("products"));
    if (!returnObj) {
      const productsList = {
        products: []
      };
      productsList.products.push(product);
      localStorage.setItem("products", JSON.stringify(productsList));
      return;
    }
    const existElement = returnObj.products.findIndex(element => {
      return element.id === product.id;
    });
    if (existElement === -1) {
      returnObj.products.push(product);
      localStorage.setItem("products", JSON.stringify(returnObj));
    } else {
      localStorage.removeItem("products");
      returnObj.products.splice(existElement, 1);
      localStorage.setItem("products", JSON.stringify(returnObj));
    }
  };

  isFavorite = (productId) => {
    const returnObj = JSON.parse(localStorage.getItem("products"));
    if (!returnObj) {
      return false;
    }
    const existElement = returnObj.products.findIndex(element => {
      return element.id === productId;
    });

    return existElement !== -1 ? true : false
  };


  render() {
    return (

      <section className="new-deals wave-bottom">
        <h2 className="h2">Новинки</h2>

        <CategoriesContext.Consumer>
          {(categories) => {
            return (
              <CategoryNewProducts
                category={{data: categories.categories ? categories.categories.data : categories.categories}}
                onClick={this.handlerCategory}
                categoryActive={this.getCategoryActive(categories)}
              />
            )
          }
          }
        </CategoriesContext.Consumer>
        <FavoriesContext.Consumer>
          {(isFavorite, toggleFavorite) => {
            return (

              <SliderNewProducts products={this.getProducts()}
                                 onFavoriteClick={(product, event) => {
                                   toggleFavorite(product.id, event)
                                 }}
                                 isFavorite={productId => isFavorite(productId)}/>
            )
          }}
        </FavoriesContext.Consumer>
      </section>

    )
  }
};

