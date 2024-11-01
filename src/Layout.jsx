// MainLayout.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { RouterLayout, RouterAdmin } from "./Routes/Router";
import App from "./App";
function MainLayout() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          {RouterLayout.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>
        {RouterAdmin.map((adminRoute, index) => (
          <Route
            key={index}
            path={adminRoute.path}
            element={adminRoute.element}
          >
            {adminRoute.children?.map((childRoute, childIndex) => (
              <Route
                key={childIndex}
                path={childRoute.path}
                element={childRoute.element}
                index={childRoute.index || undefined}
              />
            ))}
          </Route>
        ))}
      </Routes>
    </Router>
  );
}

export default MainLayout;
