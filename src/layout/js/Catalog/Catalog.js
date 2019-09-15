import React, {Component} from "react";

import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import Sidebar from "../Sidebar/Sidebar";
import SidebarComponents from "../SidebarComponent/SidebarComponent";
import OverlookedSlider from "../OverlookedSlider/OverlookedSlider";
import Pagination from "../Pagination/Pagination";
import ProductList from "../ProductList/ProductList";
import {CategoriesContext} from "../App";
import ScrollToTop from "../ScrollToTop/ScrollToTop";


const {Provider, Consumer} = React.createContext();

export default class Catalog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters:
        {
          sortBy: 'popularity',
          page: 1,
        }
      ,
    };
    if (this.props.products) {
      this.state = {...this.state, products: this.props.products}
    }

    this.handleSort = this.handleSort.bind(this);
    this.handlePage = this.handlePage.bind(this);
  }


  componentDidMount() {

    if (this.props.match.params.id === 'featured') {
    }

    if (this.state.filters.length === 0) {
      this.getProduct(this.props.location.search);
      return;
    }


    let path = "", url = "";
    if (this.props.match.params.id === 'featured') {
      url = 'featured';
    }
    for (let filter in this.state.filters) {
      path += `&${filter}=${this.state.filters[filter]}`;
    }

    if (this.props.location.search.split('?').length <= 1) {
      this.getProduct(url, `${this.props.location.search}?${path}`);
      return;
    }

    this.getProduct(url, `${this.props.location.search}${path}`);
  };

  componentDidUpdate(prevProps, prevState) {

    if ((this.state.filters === prevState.filters) &&
      (this.props.isMainMenuActive === prevProps.isMainMenuActive) &&
      (this.props.location === prevProps.location)) {
      return;
    }
    let path = "";
    for (let filter in this.state.filters) {
      path += `&${filter}=${this.state.filters[filter]}`;
    }

    let url = "";
    if (this.props.match.params.id === 'featured') {
      url = 'featured';
    }
    if (this.props.location.search.split('?').length <= 1) {
      this.getProduct(url, `${this.props.location.search}?${path}`);
      return;
    }
    this.getProduct(url, `${this.props.location.search}${path}`);
  }

  handlerSidebarFilter = (paramArray) => {
    if (paramArray.length === 0) {
      return;
    }
    const paramObj = {};
    const value = paramArray.map(element => {
      return paramObj[element.param] = element.value;
    });

    this.setState({
      filters: {...this.state.filters},
    })

  };

  getProduct = (url, urlPath) => {
    let newUrl = 'https://api-neto.herokuapp.com/bosa-noga/';
    newUrl += url ? url : 'products';

    if (urlPath) {
      newUrl += urlPath;
    }


    const params = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };
    return fetch(newUrl, params)
      .then(response => response.json())
      .then(result => {
        this.setState({products: result})
      });
  };

  handleSort = (event) => {
    this.setState({
      filters: {
        ...this.state.filters,
        sortBy: event.target.value
      }
    });
    this.getProduct('', `sortBy=${this.state.filters.sortBy}`);
  };

  handlePage = (event) => {
    event.preventDefault();

    if (event.target.getAttribute("name") == "forward") {
      this.setState({
        filters: {
          ...this.state.filters,
          page: this.state.products.page + 1
        }
      })
    } else {


      if (event.target.getAttribute("name") == "back") {
        this.setState({
          filters: {
            ...this.state.filters,
            page: this.state.products.page - 1
          }
        });
      } else {
        if (event.target.getAttribute("name")) {
          this.setState({
            filters: {
              ...this.state.filters,
              page: event.target.getAttribute("name"),
            }
          });
        }
      }
    }
  };

  getHeader = () => {
    if (this.props.location.search.includes("search")) {
      return "Результаты поиска";
    }
    if (this.props.location.pathname.includes("featured")) {
      return "Новинки";
    }
    return this.props.isMainMenuActive;
  };

  render() {

    return (
      <>
        {/*<!-- Каталог товаров -->*/}
        <ScrollToTop>
          {/*<!-- Breadcrumbs -->*/}
          <CategoriesContext.Consumer>
            {(categories) =>
              <Breadcrumbs item={this.props.isMainMenuActive}{...this.props} categories={categories}/>
            }
          </CategoriesContext.Consumer>
          {/*<!-- Тело каталога с сайдбаром -->*/}
          <main className="product-catalogue" style={{width: "100%",}}>
            {/*<!-- Сайдбар -->*/}
            <SidebarComponents {...this.state} {...this.props}/>
            {/*<!-- Основной контент каталога -->*/}
            <section className="product-catalogue-content">
              {/*<!-- Голова каталога с названием раздела и сортировкой -->*/}
              <section className="product-catalogue__head">
                <div className="product-catalogue__section-title">
                  <h2 className="section-name">{this.getHeader()}</h2>
                  <span
                    className="amount">{this.state.products ? (this.state.products.goods ? `${this.state.products.goods} товаров` : "") : ""}</span>
                </div>
                <div className="product-catalogue__sort-by">
                  <p className="sort-by">Сортировать</p>
                  <select name="" value={this.state.sort} id="sorting" onChange={this.handleSort}>
                    <option value="popularity">по популярности</option>
                    <option value="price">по цене</option>
                  </select>
                </div>
              </section>
              {/*<!-- Список товаров каталога -->*/}
              {/*<!-- Товары -->*/}
              <section className="product-catalogue__item-list">

                <ProductList products={this.state.products ? this.state.products.data : []}/>
              </section>


              {/*<!-- Пагинация под каталогом -->*/}
              <div className="product-catalogue__pagination">
                <Pagination page={this.state.products ? this.state.products.page : ""}
                            pages={this.state.products ? this.state.products.pages : ""}
                            onChange={this.handlePage}
                />
              </div>
            </section>
          </main>
          {/*<!-- Слайдер внизу каталога  -->*/}
          <OverlookedSlider/>
        </ScrollToTop>
      </>
    )
  }
}