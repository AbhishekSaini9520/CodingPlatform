import { io } from "socket.io-client";
const BASE_URL = "https://codingplatform-3ipe.onrender.com";

// const URL = "http://localhost:4000";

export const socket = io(BASE_URL, {
  autoConnect: true,
  withCredentials: true
});