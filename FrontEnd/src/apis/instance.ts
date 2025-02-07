import axios from "axios";

const { VITE_APP_API_URL } = import.meta.env;

const instance = axios.create({
  baseURL: VITE_APP_API_URL, // 프로덕션 환경
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
  },
});

export default instance;
