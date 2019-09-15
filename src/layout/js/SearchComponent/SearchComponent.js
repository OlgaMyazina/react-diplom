import React from "react";

import withFetcher from "../withFetcher/withFetcher";
import Search from "../Search/Search";

const SearchComponent = withFetcher({
  url: 'https://api-neto.herokuapp.com/bosa-noga/search=Кэрри',
  collName: 'search'
})(Search);

export default CategoriesComponent;