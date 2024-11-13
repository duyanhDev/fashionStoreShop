// routes.js
import Create from "../components/AddProducts/Create";
import Admin from "../components/Admin/Admin";
import CartProducts from "../components/CartProducts/CartProducts";
import Category from "../components/Category/Category";
import Details from "../components/Details/Details";
import Home from "../components/Home/Home";
import Products from "../components/Products/Product";
import UpLoad from "../components/UpLoadProducts/UpLoad";
import View from "../components/VỉewProducts/View";

export const RouterLayout = [
  {
    path: "/",
    element: <Home />,
    index: true,
  },
  {
    path: "/product/:id",
    element: <Details />,
  },
  {
    path: "/cart",
    element: <CartProducts />,
  },
];

export const RouterAdmin = [
  {
    path: "admin",
    element: <Admin />,
    children: [
      { index: true, element: <Products /> },
      { path: "addproduct", element: <Create /> },
      { path: "category", element: <Category /> },
      { path: "uploadproducts/:id", element: <UpLoad /> },
      { path: "viewproduct/:id", element: <View /> },
    ],
  },
];
