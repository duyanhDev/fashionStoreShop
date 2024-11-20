import axios from "./../untils/axios";

const fetchTotalProductsSoldAPI = async () => {
  return await axios.get(
    `http://localhost:9000/api/v1/get-total-products-sold`
  );
};

export { fetchTotalProductsSoldAPI };
