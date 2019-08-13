import React from "react";
import {NavLink} from "react-router-dom";

export default class OrderDone extends React.Component {
  constructor(props) {
    super(props);
  }

  handlerButton = () => {
    this.props.history.push("/");
  };

  getPay = () => {
    switch (this.props.location.state.formField.paid) {
      case "card-online":
        return "Картой онлайн";
      case "card-courier":
        return "Картой курьеру";
      case "cash":
        return "Наличными курьеру";
      default:
        return "Картой курьеру";
    }
  }

  render() {
    return (
      <>
        <div className="wrapper order-wrapper">
          <div className="site-path">
            {/*todo: хлебные крошки*/}
            <ul className="site-path__items">
              <li className="site-path__item"><NavLink to="/">Главная</NavLink></li>
              <li className="site-path__item"><NavLink to="/cart">Корзина</NavLink></li>
              <li className="site-path__item"><NavLink to="/order">Оформление заказа</NavLink></li>
              <li className="site-path__item"><NavLink to="/orderdone">Заказ принят</NavLink></li>
            </ul>
          </div>
          <section className="order-done">
            <h2 className="order-done__title order-process__title">Заказ принят, спасибо!</h2>
            <div className="order-done__information order-info">
              <div className="order-info__item order-info__item_summ">
                <h3>Сумма заказа:</h3>
                <p>{this.props.location.state.sum} <i className="fa fa-rub" aria-hidden="true"></i></p>
              </div>
              <div className="order-info__item order-info__item_pay-form">
                <h3>Способ оплаты:</h3>
                <p>{this.getPay()}</p>
              </div>
              <div className="order-info__item order-info__item_customer-name">
                <h3>Имя клиента:</h3>
                <p>{this.props.location.state.formField.userName}</p>
              </div>
              <div className="order-info__item order-info__item_adress">
                <h3>Адрес доставки:</h3>
                <p>{this.props.location.state.formField.userAddress}</p>
              </div>
              <div className="order-info__item order-info__item_phone">
                <h3>Телефон:</h3>
                <p>{this.props.location.state.formField.userTel}</p>
              </div>
            </div>
            <p className="order-done__notice">Данные о заказе отправлены на адрес
              <span> {this.props.location.state.formField.userEmail}. </span>
            </p>
            <button className="order-done__continue" onClick={this.handlerButton}>продолжить покупки</button>
          </section>
        </div>
      </>
    )
  }
}
;

