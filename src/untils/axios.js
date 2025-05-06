import axios from "axios";
import NProgress from "nprogress";

import { store, persistor } from "./../redux/store";
import { login, logout } from "./../redux/actions/Auth";
import { RefreshTokenUser } from "./../service/Auth"; // api bạn vừa tạo
import { useNavigate } from "react-router-dom"; // Dùng cho v6

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
});

const instance = axios.create({
  baseURL: "http://localhost:9000/",
});

// const instance = axios.create({
//   baseURL: "https://fashionstoreshop.onrender.com/",
// });

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    NProgress.start();
    return config;
  },
  function (error) {
    // Do something with request error
    NProgress.done();
    console.error(error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Do something with response data
    NProgress.done();
    return response;
  },
  function (error) {
    // Do something with response error
    NProgress.done();
    console.error(error);
    return Promise.reject(error);
  }
);

// instance.interceptors.request.use(
//   async (config) => {
//     const now = Date.now();
//     const state = store.getState();
//     const {
//       token,
//       refreshToken,
//       accessTokenExpiredTime,
//       refreshTokenExpiredTime,
//     } = state.auth;

//     console.log(accessTokenExpiredTime, refreshTokenExpiredTime);

//     if (refreshTokenExpiredTime && now > refreshTokenExpiredTime) {
//       store.dispatch(logout());
//       await persistor.purge();
//       navigate("/login");
//       throw new Error("Refresh token expired");
//     }

//     if (accessTokenExpiredTime && now > accessTokenExpiredTime) {
//       try {
//         const res = await RefreshTokenUser();
//         const newToken = res.data.data.token;
//         const accessTokenExpiresIn = 60 * 60 * 1000; // 1 tiếng
//         const updatedNow = Date.now();

//         store.dispatch(
//           login(
//             newToken,
//             state.auth.user,
//             refreshToken,
//             updatedNow + accessTokenExpiresIn,
//             refreshTokenExpiredTime
//           )
//         );

//         config.headers["Authorization"] = `Bearer ${newToken}`;
//       } catch (error) {
//         store.dispatch(logout());
//         await persistor.purge();
//         navigate("/login");
//         throw error;
//       }
//     } else if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default instance;
