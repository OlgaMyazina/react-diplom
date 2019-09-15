import React from "react";
import {Link} from "react-router-dom";

import FavoriteImage from "../../img/product-card-pics/product-card__favorite.png";
import FavoriteImageFill from "../../img/product-card-pics/product-card__favorite-fill.png";

import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import ProductImagesSlider from "../ProductImagesSlider/ProductImagesSlider";
import {CategoriesContext} from "../App";
import OverlookedSlider from "../OverlookedSlider/OverlookedSlider";
import SimilarSlider from "../SimilarSlider/SimilarSlider";
import {FavoriesContext} from "../App";

/*
* {
  "data": {
    "id": 25,
    "categoryId": 13,
    "title": "Туфли императрицы",
    "images": [
      "https://neto-api.herokuapp.com/bosa-noga/images5134523.jpg",
      "https://neto-api.herokuapp.com/bosa-noga/dolce-gabbana-red-tufli-3.jpg"
    ],
    "sku": "1000005",
    "brand": "Dolce & Gabbana",
    "color": "Бардо",
    "material": "Ткань",
    "reason": "Высокая мода",
    "season": "Лето",
    "heelSize": 8,
    "price": 15000,
    "sizes": [
      {
        "size": 15,
        "avalible": true
      },
      {
        "size": 18,
        "avalible": false
      }
    ]
  },
    "status": "ok"
}
*/

/**
 * При добавлении товара в корзину в localStorage проверяется наличие идентификатора корзины,
 * если он доступен, то запрос отправляется вместе в ним.
 *
 * В противном случае запрос отправляется без идентификатора,
 * полученный ответ сохраняется в localStorage.
 *
 * оздание корзины

 POST /cart/ — создать новую корзину.

 Формат данных при отправке json-объект. Пример запроса:

 {
  "id": 42,
  "size": 14,
  "amount": 12
}
 Тут:

 id — идентификатор товара на сервере, число;
 size — размер выбранного товара, число;
 amount — количество единиц выбранного товара, число;
 Указанный товар будет добавлен в корзину.

 В ответ приходит либо объект с описанием ошибки, либо идентификатор новой корзины.

 {
    "id": "-LGp7nXm_acnkzaFQU4Y",
    "status": "ok"
}

 * */

export default class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: "",
      quantity: 1,
      cartName: "В корзину",
    }

  }


  getProduct = () => {
    const id = this.props.match.params.id;

    const params = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    };
    const url = `https://api-neto.herokuapp.com/bosa-noga/products/${id}`;
    return fetch(url, params)
      .then(response => response.json())
      .then(result => {
        this.setState({product: result.data});
        sessionStorage.setItem(this.props.match.params.id, JSON.stringify(result.data));
      });

  };


  componentDidMount() {
    this.getProduct();
  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.getProduct();
    }
  }


  handlerSize = (event) => {
    event.preventDefault();
    this.setState({currentSize: event.target.innerText, cartName: "В корзину"})
  };

  handlerImagesClick = (event) => {
    event.preventDefault();
    const product = this.state.product;
    product.currentImage = event.target.src;
    this.setState({product})
  };

  handlerFavourite = (event) => {
    event.preventDefault();
    //получаем значения из хранилица
    const returnObj = JSON.parse(localStorage.getItem("products"));
    if (!returnObj) {
      const productsList = {
        products: []
      };
      productsList.products.push(this.state.product);
      localStorage.setItem("products", JSON.stringify(productsList));
      return;
    }
    const existElement = returnObj.products.findIndex(element => {
      return element.id === this.state.product.id;
    });
    if (existElement === -1) {
      returnObj.products.push(this.state.product);
      localStorage.setItem("products", JSON.stringify(returnObj));
    } else {
      localStorage.removeItem("products");
      returnObj.products.splice(existElement, 1);
      localStorage.setItem("products", JSON.stringify(returnObj));
    }
  };

  isBasketVisible = () => {
    return this.state.currentSize ? "" : "in-basket_disabled";
  };

  handlerMinus = () => {
    if (this.state.quantity === 1) return;
    this.setState({quantity: this.state.quantity - 1});
  };

  handlerPlus = () => {
    this.setState({quantity: this.state.quantity + 1});
  };

  handlerCart = (event) => {
    if (!this.state.currentSize) {
      this.setState({cartName: "Выберите размер!"});
      return;
    }
    this.props.onAddToCart(this.state.product.id, this.state.currentSize, this.state.quantity);
  };


  render() {
    return (
      <>
        {/*<!-- Карточка товара -->*/}
        {/*<!-- Breadcrumbs -->*/}
        <CategoriesContext.Consumer>
          {(categories) => <Breadcrumbs {...this.props}{...this.state} categories={categories}/>}
        </CategoriesContext.Consumer>

        {/*<!-- Тело карточки товара -->*/}
        <main className="product-card">
          <section className="product-card-content">
            <h2 className="section-name">{this.state.product.title}</h2>
            <section className="product-card-content__main-screen">
              {/*<!-- Слайдер выбранного товара -->*/}
              <ProductImagesSlider images={this.state.product.images} onClick={this.handlerImagesClick}/>
              {/*<!-- Изображение выбранного товара -->*/}
              <div className="main-screen__favourite-product-pic">
                <a href="#">
                  <img
                    src={this.state.product ? (this.state.product.currentImage ? this.state.product.currentImage : this.state.product.images[0]) : "#"}
                    alt=""
                    style={{width: "100%", height: "100%"}}/>
                </a>
                <a href="#" className="main-screen__favourite-product-pic__zoom"/>
              </div>
              {/*<!-- Блок информации о товаре -->*/}


              <div className="main-screen__product-info">
                <div className="product-info-title" key="productTitle"><h2>{this.state.product.title}</h2>
                  <div className="in-stock">В наличии</div>
                </div>
                <div className="product-features" key="productFeatures">
                  <table className="features-table">
                    <thead className="hidden">
                    <tr>
                      <th>Наименование аттрибута</th>
                      <th>Значение аттрибута</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td className="left-col">Артикул:</td>
                      <td className="right-col">{this.state.product.sku}</td>
                    </tr>
                    <tr>
                      <td className="left-col">Производитель:</td>
                      <td className="right-col">
                        <Link to={`/catalog?brand=${this.state.product.brand}`}>
                          <span className="producer">{this.state.product.brand}</span>
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td className="left-col">Цвет:</td>
                      <td className="right-col">{this.state.product.color}</td>
                    </tr>
                    <tr>
                      <td className="left-col">Материалы:</td>
                      <td className="right-col">{this.state.product.material}</td>
                    </tr>
                    <tr>
                      <td className="left-col">Сезон:</td>
                      <td className="right-col">{this.state.product.season}</td>
                    </tr>
                    <tr>
                      <td className="left-col">Повод:</td>
                      <td className="right-col">{this.state.product.reason}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <p className="size">Размер</p>
                <ul className="sizes"
                    style={{
                      top: "19px",
                      left: "130px",
                    }}>
                  {this.state.product ? this.state.product.sizes.map((sizeItem, index) => {
                    if (!sizeItem.available) return (<React.Fragment key={`sizes${index}`}></React.Fragment>);
                    return (
                      <li key={`sizes${sizeItem.size}${index}`} onClick={this.handlerSize}
                          className={`${parseInt(this.state.currentSize) === parseInt(sizeItem.size) ? "active" : ""}`}>
                        <a href="#">{sizeItem.size}</a>
                      </li>
                    )
                  }) : (<></>)}
                </ul>
                <div className="size-wrapper" style={{left: "105px"}} key="productSizes">
                  <a href="#"><span className="size-rule"/><p className="size-table">Таблица размеров</p></a>
                </div>
                <FavoriesContext.Consumer>
                  {({isFavorite, toggleFavorite}) => {
                    return (
                      <a href="#" className="in-favourites-wrapper">
                        <div className={isFavorite(this.state.product.id) ? "favourite favourite-fill": "favourite favourite-empty"}
                             onClick={(event) => toggleFavorite(this.state.product.id, event)}/>
                        <p className="in-favourites">В избранное</p>
                      </a>
                    )
                  }}
                </FavoriesContext.Consumer>
                <div className="basket-item__quantity" key="productBasket">
                  <div key="iconMinus" className="basket-item__quantity-change basket-item-list__quantity-change_minus"
                       onClick={this.handlerMinus}>-
                  </div>
                  {this.state.quantity}
                  <div key="iconPlus" className="basket-item__quantity-change basket-item-list__quantity-change_plus"
                       onClick={this.handlerPlus}>+
                  </div>
                </div>
                <div className="price" key="productPrice">{this.state.product.price} ₽</div>
                <button className={`in-basket in-basket-click ${this.isBasketVisible()}`}
                        onClick={this.handlerCart}>
                  {this.state.cartName}
                </button>
              </div>

            </section>
          </section>
        </main>
        {/*<!-- Слайдеры внизу карточки  -->*/}
        {/*<!-- Слайдер "Вы смотрели" -->*/}
        {/**
         todo: 3.4.5 Кроме информации о выбранном товаре на экране также есть два блока с информацией о других товарах:

         Блок «Вы смотрели», где выводятся все товары (но не больше 10), страницы которых посетил пользователь во время текущей сессии. Если товаров 5 или меньше, то стрелочки «Назад» и «Вперёд» не отображаются. Если пользователь не смотрел никаких товаров, то блок не отображается.
         Блок «Похожие товары», где выводятся товары, чей Тип и Цвет совпадают с Типом и Цветом текущего товара. Если похожих товаров нет, то блок не отображается. Если товаров 3 или меньше, то стрелочки «Назад» и «Вперёд» не отображаются.
         */}
        <OverlookedSlider/>

        {/*<!-- Слайдер "Похожие товары" -->*/}
        <SimilarSlider productType={this.state.product.type} productColor={this.state.productColor}/>
      </>
    )
  }
}
;


