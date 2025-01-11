import { FILTER_TYPES } from "./type";

import { CategoryProductsGender } from "../../service/ApiCategory";

export const setLoading = (status) => ({
  type: FILTER_TYPES.SET_LOADING,
  payload: status,
});

export const setProducts = (products) => ({
  type: FILTER_TYPES.SET_PRODUCTS,
  payload: products,
});

export const setTotalPages = (total) => ({
  type: FILTER_TYPES.SET_TOTAL_PAGES,
  payload: total,
});

export const fetchProducts = (params) => async (dispatch) => {
  console.log(params.sortDate);

  dispatch(setLoading(true));
  try {
    const response = await CategoryProductsGender(
      params.gender,
      params.category,
      params.minPrice,
      params.maxPrice,
      params.sortName,
      params.sortPrice,
      params.sortDate,
      params.currentPage
    );

    if (response?.data?.EC === 0) {
      setTimeout(() => {
        dispatch(setProducts(response.data.data));
        dispatch(setTotalPages(response.data.totalPages));
        dispatch(setLoading(false));
      }, 3000);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    dispatch(setLoading(false));
  }
};
