import axios from "axios";
import { apis } from "./connection";

const AccessToken = () => {
  return sessionStorage.getItem("Softfix_Web_Token");
};

const apiClient = axios.create({
  baseURL: apis.baseUrl,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${AccessToken()}`,
  },
});
console.log("AccessToken", `Bearer ${AccessToken()}`);

// Handle GET request
export const getRequest = async (url) => {
  try {
    const response = await apiClient.get(url);
    return response;
  } catch (error) {
    console.error("Error in GET request:", error);
    throw error;
  }
};

// Handle POST request
export const postRequest = async (url, data) => {
  try {
    const response = await apiClient.post(url, data);
    return response;
  } catch (error) {
    console.error("Error in POST request:", error);
    throw error;
  }
};

// Handle PUT request
export const putRequest = async (url, data) => {
  try {
    const response = await apiClient.put(url, data);
    return response;
  } catch (error) {
    console.error("Error in PUT request:", error);
    throw error;
  }
};

// Handle DELETE request
export const deleteRequest = async (url) => {
  try {
    const response = await apiClient.delete(url);
    return response;
  } catch (error) {
    console.error("Error in DELETE request:", error);
    throw error;
  }
};

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      apis.baseUrl + "/common/upload-file",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${AccessToken()}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error in uploadImage request:", error);
    throw error;
  }
};
