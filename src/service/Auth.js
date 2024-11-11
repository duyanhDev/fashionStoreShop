import axios from "./../untils/axios";
const LoginAuth = async (email, password) => {
  return await axios.post("http://localhost:9000/api/v1/login", {
    email,
    password,
  });
};

export { LoginAuth };
