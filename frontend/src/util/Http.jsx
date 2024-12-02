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

export const mainFormsHandlerTypeFormData = async ({
  type,
  formData,
  method,
  token,
}) => {
  try {
    let response = null;
    if (method === "add") {
      response = await axios.post(`${baseServerUrl}${type}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    } else if (method === "patch") {
      response = await axios.patch(`${baseServerUrl}${type}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      if (!token) {
        console.log("Unauthorized");
        return null;
      }
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

export const mainFormsHandlerTypeRaw = async ({
  type,
  formData,
  method,
  token,
}) => {
  try {
    let response = null;
    if (method === "add") {
      response = await axios.post(`${baseServerUrl}${type}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else if (method === "patch") {
      response = await axios.patch(`${baseServerUrl}${type}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
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

export const mainDeleteFunHandler = async ({ id, token, type }) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_Base_API_URL}${type}/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const mainEmptyBodyFun = async ({ token, type, method }) => {
  let response;
  try {
    if (method === "post") {
      response = await axios.post(
        `${import.meta.env.VITE_Base_API_URL}${type}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else if (method === "patch") {
      response = await axios.patch(
        `${import.meta.env.VITE_Base_API_URL}${type}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
