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
export {
  ListCategoryAPI,
  AddCategoryAPI,
  ListOneCategoryAPI,
  UpdateOneCatogryAPI,
};
