import axios from "axios";

const { VITE_API_BASE } = import.meta.env;

const instance = axios.create({
  baseURL: VITE_API_BASE,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
  },
});

//이후 인터셉터 설정

export default instance;
