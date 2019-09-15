import React from "react";

import withFetcher from "../withFetcher/withFetcher";
import Category from "../Category/Category";

const CategoriesComponent = withFetcher({
  url: 'https://api-neto.herokuapp.com/bosa-noga/categories',
  collName: 'category'
})(Category);

export default CategoriesComponent;