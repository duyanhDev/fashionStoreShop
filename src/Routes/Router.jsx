// routes.js
import Create from "../components/AddProducts/Create";
import Admin from "../components/Admin/Admin";
import Category from "../components/Category/Category";
import Home from "../components/Home/Home";
import Products from "../components/Products/Product";
import UpLoad from "../components/UpLoadProducts/UpLoad";

export const RouterLayout = [
  {
    path: "/",
    element: <Home />,
    index: true,
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
    ],
  },
];
