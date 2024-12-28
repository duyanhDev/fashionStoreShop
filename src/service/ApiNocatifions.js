import axios from "./../untils/axios";

const FetcDataNocatifions = async (userId) => {
  return axios.get(`http://localhost:9000/api/v1/notification/${userId}`);
};
const UpdateDataNocatifions = async (id) => {
  return axios.post(`http://localhost:9000/api/v1/notification/${id}`);
};
export { FetcDataNocatifions, UpdateDataNocatifions };
