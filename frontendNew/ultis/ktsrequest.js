import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const ktsRequest = axios.create({
  baseURL: apiBaseUrl,
});

export default ktsRequest;
