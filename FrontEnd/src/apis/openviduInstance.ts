import axios from "axios";

const { VITE_APP_API_URL } = import.meta.env;

const openviduInstance = axios.create({
  baseURL: VITE_APP_API_URL + "/api/video/",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
});

export default openviduInstance;
