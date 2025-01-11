import axios from "./../untils/axios";
const LoginAuth = async (email, password) => {
  return await axios.post("http://localhost:9000/api/v1/login", {
    email,
    password,
  });
};

const UserAuth = async () => {
  return await axios.get("http://localhost:9000/api/v1/users");
};

const get_profile_user = async (id) => {
  return await axios.get(`http://localhost:9000/api/v1/profile-users`, {
    params: { id },
  });
};

const update_profileUser = async (
  id,
  name,
  city,
  district,
  ward,
  phone,
  gender,
  dateOfBirth,
  height,
  weight,
  avatar
) => {
  const data = new FormData();

  // Appending fields to the FormData object
  data.append("id", id);
  data.append("name", name);
  data.append("city", city);
  data.append("district", district);
  data.append("ward", ward);
  data.append("phone", phone);
  data.append("gender", gender);
  data.append("dateOfBirth", dateOfBirth);
  data.append("height", height);
  data.append("weight", weight);

  // Ensure avatar is either a file or null before appending
  if (avatar) {
    // If avatar is a file, append it
    data.append("avatar", avatar);
  }

  try {
    // Sending PUT request with FormData to the backend
    const response = await axios.put(
      `http://localhost:9000/api/v1/updateProfile`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure it's set to handle file uploads
        },
      }
    );
    return response.data; // Return response data for further use
  } catch (error) {
    // Handle error appropriately
    console.error("Error updating user profile:", error);
    throw error; // Optionally throw error or handle it with a custom message
  }
};

const ChanglePasswordAPI = async (id, currentPassword, newPassword) => {
  return await axios.put("http://localhost:9000/api/v1/changel-passsword", {
    id,
    currentPassword,
    newPassword,
  });
};
export {
  LoginAuth,
  UserAuth,
  get_profile_user,
  update_profileUser,
  ChanglePasswordAPI,
};
