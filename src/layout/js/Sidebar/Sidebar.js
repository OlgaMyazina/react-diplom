import React from "react";
import {Link} from "react-router-dom";

import PriceSlider from "../PriceSlider/PriceSlider";
import urlToFilter from "../filters/urlToFilters";
import filtersToUrl from "../filters/filtersToUrl";

/**

 filters:{…}
 data:{…}
 brand:Array[38]
 color:Array[18]
 heelSize:Array[10]
 reason:Array[3]
 season:Array[2]
 sizes:Array[8]
 type:Array[8]
 status:"ok"

 **/

export default class Sidebar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      minValueRub: 1000,
      maxValueRub: 30000,
      minRub: 0,
      maxRub: 100000,
      typeDivisionOpen: true,
      priceDivisionOpen: true,
      colorDivisionOpen: true,
      sizeDivisionOpen: true,
      heelSizeDivisionOpen: false,
      reasonDivisionOpen: true,
      seasonDivisionOpen: false,
    };
    this.handlerMinPrice = this.handlerMinPrice.bind(this);
    this.handlerMaxPrice = this.handlerMaxPrice.bind(this);
  }

  componentDidMount() {

  }

  getSyncPrice = () => {
    const filters = urlToFilter(this.props.location.search);


    if ((!!filters.minPrice) && (filters.minPrice != this.state.minValueRub)) {
      this.setState({minValuePrice: filters.minPrice});
    }
    if (!filters.minPrice) {
      this.props.history.push(this.getUrl("minPrice", parseInt(this.state.minValueRub)));
    }
    if ((filters.maxPrice) && (filters.maxPrice != this.state.maxValueRub)) {
      this.setState({maxValueRub: filters.maxPrice});
    }
    if (!filters.maxPrice) {
      this.props.history.push(this.getUrl("maxPrice", parseInt(this.state.maxValueRub)));
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

  }


  parseQueryString = (url) => {
    const paramString = url.substring(1),
      paramArray = paramString.split("&"),
      parseArray = [];
    paramArray.map(element => {
      if (!element) return;
      const parseElement = element.split("=");
      parseArray.push({
        param: parseElement[0],
        value: decodeURIComponent(parseElement[1])
      })
    });
    return parseArray;
  };

  getParam = (url, param) => {
    const value = urlToFilter(url);
    const paramArray = this.parseQueryString(url);
    const paramElement = paramArray.find((element) => {
      return element.param === param;
    });
    return paramElement;
  };

  getClassColor = (nameColor) => {

    switch (nameColor) {
      case "Черный":
        return "black-sabbath";
      case "Беж":
      case "Бежевый":
        return "beige";
      case "Белый":
        return "whitesnake";
      case "Голубой":
      case "Синий":
        return "shocking-blue";
      case "Жёлтый":
        return "yellow";
      case "Алый":
      case"Розовый":
      case "Красный":
        return "king-crimson";
      case "Фиолетовый":
        return "deep-purple";
        break;
      default:
        return "beige";
    }
  }


  parseUrl = (param, value) => {
    const result = urlToFilter(this.props.location.search);
    if (Array.isArray(result[param])) {
      return result[param].includes(parseInt(value));
    }
    return result[param] === value;
  };

  getUrl = (param, element) => {
    const filters = urlToFilter(this.props.location.search);
    filters[param] = element;
    const newResult = filtersToUrl(filters);
    return `${this.props.location.pathname}?${newResult}`;
  };

  handlerMinPrice = (value) => {
    this.props.history.push(this.getUrl("minPrice", parseInt(value)));
    this.setState({minValueRub: value})
  };
  handlerMaxPrice = (value) => {
    this.props.history.push(this.getUrl("maxPrice", parseInt(value)));
    this.setState({maxValueRub: value})
  };
  handlerSizeChecked = (event) => {
    const filters = urlToFilter(this.props.location.search);
    const indexSizeFilters = filters.size.findIndex(elem => parseInt(elem) === parseInt(event.target.name));
    if (indexSizeFilters === -1) {
      filters.size.push(parseInt(event.target.name));
    } else {
      //todo: удаляем элемент из массива объектов, снимаем флаг и убираем из url
      filters.size.splice(indexSizeFilters, 1);
    }
    const url = this.getUrl("size", filters.size);
    this.props.history.push(url);
  };

  handlerHeelSizeChecked = (event) => {
    console.log("click heelSize");
    const filters = urlToFilter(this.props.location.search);
    const indexHeelSizeFilters = filters.heelSize.findIndex(elem => parseInt(elem) === parseInt(event.target.name));
    if (indexHeelSizeFilters === -1) {
      filters.heelSize.push(parseInt(event.target.name));
    } else {
      //todo: удаляем элемент из массива объектов, снимаем флаг и убираем из url
      filters.heelSize.splice(indexHeelSizeFilters, 1);
    }
    const url = this.getUrl("heelSize", filters.heelSize);
    this.props.history.push(url);
  };

  handlerOpenerClick = (param) => {
    this.setState({[`${param}DivisionOpen`]: !this.state[`${param}DivisionOpen`]});
  };

  getResetUrl = () => {
    const categoryId = urlToFilter(this.props.location.search).categoryId;
    return categoryId ? `catalog/products?categoryId=${categoryId}` : "/catalog";
  };

  handlerSearchBrand = (event) => {
    event.preventDefault();
    const formField = [], formElement = event.target;
    Array.from(formElement).forEach(element => {
      if (!element) return;
      if (!element.name) return;
      formField[element.name] = element.value;
    });


    this.props.history.push({
      pathname: '/catalog',
      search: `${this.props.location.search}&brand=${formField["searchBrand"]}`
    });
  };

  render() {
    if (!this.props.data.data) {
      return (<></>);
    }
    return (
      <section className="sidebar">
        <section className="sidebar__division">
          <div className="sidebar__catalogue-list">
            <div className="sidebar__division-title">
              <h3>Каталог</h3>
              <div className={this.state.typeDivisionOpen ? "opener-down" : "opener-up"}
                   onClick={() => this.handlerOpenerClick("type")}/>
            </div>
            <ul className={this.state.typeDivisionOpen ? "" : "hidden"}
                style={{display: this.state.typeDivisionOpen ? "inherit" : "none"}}>
              {this.props.data.data.type.map((typeElement) => {
                return (
                  <li className={this.parseUrl("type", typeElement) ? "chosen" : ""} key={typeElement}>
                    <Link
                      to={this.getUrl("type", typeElement)}>{typeElement}</Link>
                  </li>)
              })}
            </ul>
          </div>
        </section>
        <div className="separator-150 separator-150-1"/>
        <section className="sidebar__division">
          <div className="sidebar__price">
            <div className="sidebar__division-title">
              <h3>Цена</h3>
              <div className={this.state.priceDivisionOpen ? "opener-down" : "opener-up"}
                   onClick={() => this.handlerOpenerClick("price")}/>
            </div>
            <PriceSlider minRub={this.state.minRub}
                         maxRub={this.state.maxRub}
                         minValueRub={this.state.minValueRub}
                         maxValueRub={this.state.maxValueRub}
                         handlerMinPrice={this.handlerMinPrice}
                         handlerMaxPrice={this.handlerMaxPrice}
                         style={{display: this.state.priceDivisionOpen ? "inherit" : "none"}}/>
          </div>
        </section>
        <div className="separator-150 separator-150-2"/>
        <section className="sidebar__division">
          <div className="sidebar__color">
            <div className="sidebar__division-title">
              <h3>Цвет</h3>
              <div className={this.state.colorDivisionOpen ? "opener-down" : "opener-up"}
                   onClick={() => this.handlerOpenerClick("color")}/>
            </div>
            <ul className={this.state.colorDivisionOpen ? "" : "hidden"}
                style={{display: this.state.colorDivisionOpen ? "inherit" : "none"}}>
              {this.props.data.data.color.map(colorElement => {
                return (
                  <li className={this.parseUrl("color", colorElement) ? "chosen" : ""} key={colorElement}>
                    <Link to={this.getUrl("color", colorElement)} key={colorElement}>
                      <div className={`color ${this.getClassColor(colorElement)}`}/>
                      <span className="color-name">{colorElement}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
        <div className="separator-150 separator-150-3"/>
        <section className="sidebar__division">
          <div className="sidebar__size">
            <div className="sidebar__division-title">
              <h3> Размер </h3>
              <div className={this.state.sizeDivisionOpen ? "opener-down" : "opener-up"}
                   onClick={() => this.handlerOpenerClick("size")}/>
            </div>
            <ul style={{display: this.state.sizeDivisionOpen ? "" : "none"}}>
              <div className="list-1">
                {this.props.data.data.sizes.map(sizeElement => {
                  if (sizeElement % 4 === 0) {
                    return (
                      <li key={sizeElement}><label>
                        <input type="checkbox"
                               className="checkbox"
                               name={sizeElement}
                               onChange={this.handlerSizeChecked}
                               checked={this.parseUrl("size", sizeElement)}/>
                        <span className="checkbox-custom"/> <span className="label">{sizeElement}</span>
                      </label>
                      </li>
                    )
                  }
                })}
              </div>
              <div className="list-2">
                {this.props.data.data.sizes.map(sizeElement => {
                  if (sizeElement % 4 !== 0) {
                    return (
                      <li key={sizeElement}><label>
                        <input type="checkbox"
                               className="checkbox"
                               name={sizeElement}
                               onChange={this.handlerSizeChecked}
                               checked={this.parseUrl("size", sizeElement)}/>
                        <span className="checkbox-custom"/> <span className="label"> {sizeElement}</span>
                      </label>
                      </li>
                    )
                  }
                })}
              </div>
            </ul>
          </div>
        </section>
        <div className="separator-150 separator-150-4"/>
        <section className="sidebar__division">
          <div className="sidebar__heel-height">
            <div className="sidebar__division-title">
              <h3> Размер каблука </h3>
              <div className={this.state.heelSizeDivisionOpen ? "opener-down" : "opener-up"}
                   onClick={() => this.handlerOpenerClick("heelSize")}/>
            </div>
            <ul style={{display: this.state.heelSizeDivisionOpen ? "" : "none"}}>
              <div className="list-1">
                {this.props.data.data.heelSize.map(heelSizeElement => {
                  if (heelSizeElement % 2 !== 0) {
                    return (
                      <li key={heelSizeElement}><label>
                        <input type="checkbox"
                               className="checkbox"
                               name={heelSizeElement}
                               onChange={this.handlerHeelSizeChecked}
                               checked={this.parseUrl("heelSize", heelSizeElement)}/>
                        <span className="checkbox-custom"/> <span className="label">{heelSizeElement}</span>
                      </label>
                      </li>
                    )
                  }
                })}

              </div>
              <div className="list-2">
                {this.props.data.data.heelSize.map(heelSizeElement => {
                  if (heelSizeElement % 2 === 0) {
                    return (
                      <li key={heelSizeElement}><label>
                        <input type="checkbox"
                               className="checkbox"
                               name={heelSizeElement}
                               onChange={this.handlerSizeChecked}
                               checked={this.parseUrl("heelSize", heelSizeElement)}/>
                        <span className="checkbox-custom"/> <span className="label"> {heelSizeElement}</span>
                      </label>
                      </li>
                    )
                  }
                })}
              </div>
            </ul>
          </div>
        </section>
        <div className="separator-150 separator-150-5"/>
        <section className="sidebar__division">
          <div className="sidebar__occasion">
            <div className="sidebar__division-title">
              <h3> Повод </h3>
              <div className={this.state.reasonDivisionOpen ? "opener-down" : "opener-up"}
                   onClick={() => this.handlerOpenerClick("reason")}/>
            </div>
            <ul style={{display: this.state.reasonDivisionOpen ? "" : "none"}}>
              {this.props.data.data.reason.map(reasonElement => {
                return (
                  <li className={this.parseUrl("reason", reasonElement) ? "chosen" : ""} key={reasonElement}>
                    <Link to={this.getUrl("reason", reasonElement)}>{reasonElement}</Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
        <div className="separator-150 separator-150-6"/>
        <section className="sidebar__division">
          <div className="sidebar__season">
            <div className="sidebar__division-title">
              <h3> Сезон </h3>
              <div className={this.state.seasonDivisionOpen ? "opener-down" : "opener-up"}
                   onClick={() => this.handlerOpenerClick("season")}/>
            </div>
            <ul style={{display: this.state.seasonDivisionOpen ? "" : "none"}}>
              {this.props.data.data.season.map(seasonElement => {
                return (
                  <li className={this.parseUrl("season", seasonElement) ? "chosen" : ""} key={seasonElement}>
                    <Link to={this.getUrl("season", seasonElement)}>{seasonElement}</Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
        <div className="separator-150 separator-150-7"/>
        <section className="sidebar__division">
          <div className="sidebar__brand">
            <h3> Бренд </h3>
            <form className="brand-search" onSubmit={this.handlerSearchBrand}>
              <input type="search" name="searchBrand" className="brand-search" id="brand-search" placeholder="Поиск"/>
              <input type="submit" name="" value="" className="submit"/>
            </form>
          </div>

          <label><input type="checkbox" className="checkbox" name="checkbox-disc"/><span
            className="checkbox-discount"/> <span
            className="text-discount">Со скидкой</span></label>

          <div className="separator-240"/>
        </section>

        <section className="sidebar__division">
          <div className="drop-down">
            <Link to={this.getResetUrl()}>
              <span className="drop-down-icon"/>Сбросить</Link>
          </div>
        </section>
      </section>
    )
  };
};

