import { io } from "socket.io-client";

export const apis = {
  baseUrl: process.env.REACT_APP_BASE_URL,
  socketUrl: process.env.REACT_APP_SOCKET_URL,
  empUrl: process.env.REACT_APP_BASE_URL + "/emp",
};

export const token = () => {
  return sessionStorage.getItem("Softfix_Web_Token");
};

export const setTokens = (token) => {
  sessionStorage.setItem("Softfix_Web_Token", token);
};

export const removeTokens = () => {
  sessionStorage.removeItem("Softfix_Web_Token");
};

export const socket = io(
  `${process.env.REACT_APP_SOCKET_URL}?token=${token()}`
);
