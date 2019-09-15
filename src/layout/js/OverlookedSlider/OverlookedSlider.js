import React from "react";
import {Link} from "react-router-dom";

export default class OverlookedSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderProduct: [],
      renderStartIndex: 0
    };
  }

  componentDidMount() {
    this.getRenderProduct();

  }

  componentDidUpdate(prevProps, prevState, snapshot) {

  }

  getRenderProduct = () => {
    Object.keys(sessionStorage).map((id) => {
      if (this.state.renderProduct.length > 10) {
        return;
      }
      const product = JSON.parse(sessionStorage.getItem(id));
      if (typeof product !== "object") {
        return;
      }
      const productsForRender = this.state.renderProduct;
      productsForRender.push(product);
      this.setState({renderProduct: productsForRender})
    })
  };

  getVisibleArrowLeft = () => {
    let hidden = this.state.renderProduct.length <= 5;
    if (!hidden) {
      hidden = this.state.renderStartIndex === 0;
    }
    return hidden ? "hidden" : "";
  };

  getVisibleArrowRight = () => {
    let hidden = this.state.renderProduct.length <= 5;
    if (!hidden) {
      hidden = this.state.renderStartIndex >= 5;
    }
    return hidden ? "hidden" : "";
  };

  handleArrowLeft = () => {
    if (this.state.renderStartIndex >= 1) {
      this.setState({renderStartIndex: this.state.renderStartIndex - 1});
    }
  };

  handleArrowRight = () => {
    if (this.state.renderStartIndex <= 5) {
      this.setState({renderStartIndex: this.state.renderStartIndex + 1});
    }
  };

  render() {
    if (this.state.renderProduct.length === 0) {
      return (<></>)
    }
    return (
      <section className="product-catalogue__overlooked-slider">
        <h3>Вы смотрели:</h3>
        <div className="overlooked-slider">
          <div
            className={`overlooked-slider__arrow overlooked-slider__arrow_left arrow ${this.getVisibleArrowLeft()}`}
            onClick={this.handleArrowLeft}>
          </div>
          {this.state.renderProduct.map((product, index) => {
            if ((index < this.state.renderStartIndex) || (index > this.state.renderStartIndex + 4)) {
              return (<React.Fragment key={product.id}></React.Fragment>);
            }

            return (
              <div className={`overlooked-slider__item overlooked-slider__item-${index}`} key={product.id}>
                <Link to={`/product/${product.id}`}>
                  {console.log("overlooked img product", product.image)}
                  <img src={product.image ? (product.images.length >= 1 ? product.images[0] : "#") : "#"}
                       alt={`${product.title}`} style={{width: "100%", height: "100%"}}/>
                </Link>
              </div>
            )
          })}


          <div
            className={`overlooked-slider__arrow overlooked-slider__arrow_right arrow ${this.getVisibleArrowRight()}`}
            onClick={this.handleArrowRight}>
          </div>
        </div>
      </section>
    )

  }
}

