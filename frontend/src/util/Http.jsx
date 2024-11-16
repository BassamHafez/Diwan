import axios from "axios";
const baseServerUrl = import.meta.env.VITE_Base_API_URL;

export const signFormsHandler = async ({ type, formData, method }) => {
  try {
    let response = null;
    if (method === "put") {
      response = await axios.put(
        `${baseServerUrl}auth/resetPassword`,
        formData
      );
    } else {
      response = await axios.post(`${baseServerUrl}auth/${type}`, formData);
    }
    return response;
  } catch (error) {
    if (error.response) {
      throw error.response;
    } else if (error.request) {
      throw error.request;
    }
    throw error.message;
  }
};

export const mainFormsHandlerTypeFormData = async ({ type, formData, method, token }) => {
  try {
    let response = null;
    if (method === "add") {
      response = await axios.post(`${baseServerUrl}${type}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    } else if (method === "patch") {
      response = await axios.patch(`${baseServerUrl}${type}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      response = await axios.get(`${baseServerUrl}${type}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return response.data;
  } catch (error) {
    console.log("from http", error);
    return error;
  }
};
