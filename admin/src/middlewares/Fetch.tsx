import axios from "axios";

const token = localStorage.getItem("token");

export const Fetch = axios.create({
  baseURL: "http://localhost:4000/api/",
  headers: {
    Authorization: token,
  },
});
