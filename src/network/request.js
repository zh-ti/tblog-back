import axios from "axios";

const common = axios.create({
  baseURL: "http://localhost:8088/tblog/",
  timeout: 10000,
});

common.interceptors.response.use((result) => result.data);

export { common };
