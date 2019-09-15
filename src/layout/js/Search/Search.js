import React from "react";
import {Switch, Route, Link} from "react-router-dom"
import Catalog from "../Catalog/Catalog";

/*
* Поисковый запрос

Для реализации поиска доступен запрос GET /products c параметром search, в который передается значение для поиска, вида:

GET /products?search=Кэрри

В ответ приходит либо сообщение об ошибке, либо JSON-объект со списком товаров удовлетворяющих поисковому запросу.

Структура ответа аналогична таковой при получении списка товаров.

Поиск работает по товарам целиком, поэтому, если вы будете искать товар по слову красный, то попадут в выдачу товары, у которых цвет красный.
*/

const Search = ({history, ...rest}) => {
  const handlerSubmit = (event) => {
    event.preventDefault();
    const formField = [], formElement = event.target;
    Array.from(formElement).forEach(element => {
      if (!element) return;
      if (!element.name) return;
      formField[element.name] = element.value;
    });

    history.push({
      pathname: '/catalog',
      search: `?search=${formField["search"]}`
    });
  };

  return (
    <>
      <form className={`header-main__search ${rest.isSearchActive}`} onSubmit={handlerSubmit}>
        <input placeholder="Поиск" name="search">

        </input>
        <i className="fa fa-search" aria-hidden="true"></i>

      </form>


    </>
  )
};

export default Search;
