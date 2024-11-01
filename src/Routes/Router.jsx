// routes.js
import Admin from "../components/Admin/Admin";
import Home from "../components/Home/Home";
import Products from "../components/Products/Product";

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
      { path: "products", element: <Products /> },
    ],
  },
];
