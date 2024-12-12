import axios from "./../untils/axios";

const ListCategoryAPI = async () => {
  return await axios.get("http://localhost:9000/api/v1/category");
};

const AddCategoryAPI = async (name, description) => {
  return await axios.post("http://localhost:9000/api/v1/category", {
    name,
    description,
  });
};

const ListOneCategoryAPI = async (id) => {
  return await axios.get(`http://localhost:9000/api/v1/category/${id}`);
};

const UpdateOneCatogryAPI = async (id, name, description) => {
  return await axios.put(`http://localhost:9000/api/v1/category/${id}`, {
    name,
    description,
  });
};

const DeleteOneCategoryAPI = async (id) => {
  return await axios.delete(`http://localhost:9000/api/v1/category/${id}`);
};

const CategoryProductsGender = async (gender) => {
  return axios.get(`http://localhost:9000/api/v1/categoryProducts/${gender}`);
};
export {
  ListCategoryAPI,
  AddCategoryAPI,
  ListOneCategoryAPI,
  UpdateOneCatogryAPI,
  DeleteOneCategoryAPI,
  CategoryProductsGender,
};
