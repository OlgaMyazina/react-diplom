import React from "react";
import {Link, NavLink} from "react-router-dom";
import PropTypes from "prop-types"

export default class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sum: 0,
      paid: "card-courier",
      userName: "",
      userTel: "",
      userEmail: "",
      userAddress: "",
    };
    this.handlerChangeForm = this.handlerChangeForm.bind(this);
    this.handlerForm = this.handlerForm.bind(this);
    this.handlerPaid = this.handlerPaid.bind(this);
  }


  componentDidMount() {
    if (this.props.products.length === 0) return;
    this.props.products.map(product => {
      this.getProduct(product.id);
    });
  }

  deepEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.products.length === 0) {
      return;
    }

    this.props.products.map(product => {
      if (this.state && (!this.state[product.id])) {
        this.getProduct(product.id);
      }
    });

    if ((prevProps.products.length === this.props.products.length) && this.deepEqual(prevState, this.state)) {
      return;
    }

    if (prevProps.products.length !== this.props.products.length) {
      this.props.products.map(product => {
        this.getProduct(product.id);
      });
    }
  }

  getMetod(url, columnName) {
    const params = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    };
    return fetch(url, params)
      .then(response => response.json())
      .then(result => {
          this.setState({
            [columnName]: result.data,
            sum: this.state.sum + parseInt(result.data.price) * parseInt(this.props.products.find(product => {
              return product.id === result.data.id
            }).amount),
          })
        }
      )
      ;
  }

  getProduct = (id) => {
    const url = `https://api-neto.herokuapp.com/bosa-noga/products/${id}`;
    this.getMetod(url, id);
  };

  handleAdd = (product) => {
    this.props.onAdd(product.id, product.size, product.amount + 1);
  };

  handleRemove = (product) => {
    this.props.onRemove(product.id, product.size, product.amount - 1);
  };

  handlerChangeForm = (event) => {
    this.setState({[event.target.name]: event.target.value})
  };

  handlerForm = (event) => {
    event.preventDefault();
    const formField = [], formElement = event.target;
    Array.from(formElement).forEach(element => {
      if (!element) return;
      if (!element.name) return;
      if ((element.type === 'radio') && (!element.checked)) {
        return;
      }
      formField[element.name] = element.value;
    });

    this.props.history.push('/orderdone', {formField: formField, sum: this.state.sum})


  };

  handlerPaid = (event) => {
    this.setState({
      paid: event.target.value,
    });
  };

  getVisible = () => {
    let result;
    result = this.state.userName !== "";
    if (result) {
      result = this.state.userTel !== "";
    } else {
      return "order-process__form-submit_disabled";
    }
    if (result) {
      result = this.state.userEmail !== "";
    } else {
      return "order-process__form-submit_disabled";
    }
    if (result) {
      result = this.state.userAddress !== "";
    } else {
      return "order-process__form-submit_disabled";
    }
    return result ? "" : "order-process__form-submit_disabled";
  };


  render() {

    return (
      <>
        <div className="wrapper order-wrapper">
          {/*todo: breadcrumbs*/}
          <div className="site-path">
            <ul className="site-path__items">
              <li className="site-path__item"><NavLink to="/">Главная</NavLink></li>
              <li className="site-path__item"><NavLink to="/cart">Корзина</NavLink></li>
              <li className="site-path__item"><NavLink to="/order">Оформление заказа</NavLink></li>
            </ul>
          </div>
          <section className="order-process">
            <h2 className="order-process__title">Оформление заказа</h2>
            <div className="order-process__basket order-basket">
              <div className="order-basket__title">в вашей корзине:</div>
              <div className="order-basket__item-list">
                {
                  this.props.products.map(product => {
                    if (!this.state) return (<React.Fragment key={`${product.id}-${product.size}`}/>);
                    if (!this.state[product.id]) {
                      return (<React.Fragment key={`${product.id}-${product.size}`}/>);
                    }

                    return (
                      <div className="basket-item" key={`${product.id}-${product.size}`}>
                        <Link to={{pathname: `/product/${product.id}`}}>
                          <div className="basket-item__pic">
                            <img src={this.state[product.id] ? this.state[product.id].images[0] : "#"}
                                 alt={this.state[product.id].title}
                                 style={{height: "100%",}}/>
                          </div>
                        </Link>
                        <div className="basket-item__product">
                          <div className="basket-item__product-name"><a href="#">{this.state[product.id].title}</a>
                          </div>
                          <div className="basket-item__product-features">
                            <div className="basket-item__size">Размер: <span>{product.size}</span></div>
                            <div className="basket-item__producer">Производитель: <span>Albano</span></div>
                            <div className="basket-item__color">Цвет: <span>Черный</span></div>
                          </div>
                        </div>
                        <div className="basket-item__quantity" style={{top: "0"}}>
                          <div className="basket-item__quantity-change basket-item-list__quantity-change_minus"
                               onClick={() => this.handleRemove(product)}>-
                          </div>
                          {product.amount}
                          <div className="basket-item__quantity-change basket-item-list__quantity-change_plus"
                               onClick={() => this.handleAdd(product)}>+
                          </div>
                        </div>
                        <div className="basket-item__price">{this.state[product.id].price}
                          <i className="fa fa-rub" aria-hidden="true"/>
                        </div>
                      </div>
                    )
                  })
                }
              </div>

              <div className="order-basket__summ">Итого:
                <span>{this.state.sum} <i className="fa fa-rub" aria-hidden="true"/></span>
              </div>
            </div>
            <div className="order-process__confirmed">
              <form onSubmit={this.handlerForm}>
                <div className="order-process__delivery">
                  <h3 className="h3">кому и куда доставить?</h3>
                  <div className="order-process__delivery-form">
                    <label className="order-process__delivery-label">
                      <div className="order-process__delivery-text">Имя</div>
                      <input className="order-process__delivery-input"
                             type="text"
                             name="userName"
                             placeholder="Представьтесь, пожалуйста"
                             value={this.state.userName}
                             onChange={this.handlerChangeForm}
                             required/>
                    </label>
                    <label className="order-process__delivery-label">
                      <div className="order-process__delivery-text">Телефон</div>
                      <input className="order-process__delivery-input"
                             type="tel"
                             name="userTel"
                             value={this.state.userTel}
                             onChange={this.handlerChangeForm}
                             placeholder="Номер в любом формате"
                             required/>
                    </label>
                    <label className="order-process__delivery-label">
                      <div className="order-process__delivery-text">E-mail</div>
                      <input className="order-process__delivery-input"
                             type="email"
                             name="userEmail"
                             value={this.state.userEmail}
                             onChange={this.handlerChangeForm}
                             placeholder=" Укажите E-mail"
                             required/>
                    </label>
                    <label className="order-process__delivery-label order-process__delivery-label_adress">
                      <div className="order-process__delivery-text">Адрес</div>
                      <input className="order-process__delivery-input order-process__delivery-input_adress"
                             type="text"
                             value={this.state.userAddress}
                             onChange={this.handlerChangeForm}
                             name="userAddress"
                             placeholder="Ваша покупка будет доставлена по этому адресу"
                             required/>
                    </label>
                  </div>
                  <p>Все поля обязательны для заполнения. Наш оператор свяжется с вами для уточнения деталей
                    заказа.</p>
                </div>
                <div className="order-process__paid">
                  <h3 className="h3">хотите оплатить онлайн или курьеру при получении?</h3>
                  <div className="order-process__paid-form">
                    <label className="order-process__paid-label">
                      <input className="order-process__paid-radio"
                             type="radio"
                             name="paid"
                             value="card-online" onChange={this.handlerPaid}
                             checked={this.state.paid === "card-online"}/>
                      <span className="order-process__paid-text">Картой онлайн</span>
                    </label>
                    <label className="order-process__paid-label">
                      <input className="order-process__paid-radio"
                             type="radio"
                             name="paid"
                             value="card-courier"
                             onChange={this.handlerPaid}
                             checked={this.state.paid === "card-courier"}/>
                      <span className="order-process__paid-text">Картой курьеру</span>
                    </label>
                    <label className="order-process__paid-label">
                      <input className="order-process__paid-radio"
                             type="radio"
                             name="paid"
                             value="cash"
                             onChange={this.handlerPaid}
                             checked={this.state.paid === "cash"}/>
                      <span className="order-process__paid-text">Наличными курьеру</span>
                    </label>
                  </div>
                </div>
                <button className={`order-process__form-submit order-process__form-submit_click
                 ${this.getVisible()}`}>
                  Подтвердить заказ
                </button>
              </form>
            </div>
          </section>
        </div>
      </>
    )
  }
};

Order.propTypes = {
  products: PropTypes.array,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
};
