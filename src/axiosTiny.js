import axios from "axios";

export default axios.create({
    baseURL: import.meta.env.VITE_TINY_URL || "http://127.0.0.1:27119",
    withCredentials: false
});