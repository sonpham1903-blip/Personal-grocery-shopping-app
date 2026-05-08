import axios from "axios";

const ktsRequest = axios.create({
  baseURL: "http://localhost:3000/",
});

export default ktsRequest;
