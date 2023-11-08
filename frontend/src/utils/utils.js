import { Auth } from "aws-amplify";
import { HTTP_BACKEND_URL } from "./constants.js";
import { WS_BACKEND_URL } from "./constants.js";
import axios from "axios";

export async function fetchCurrentUser() {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user;
  } catch (err) {
    console.log("User not authenticated", err);
    return null;
  }
}

export async function fetchToken() {
  try {
    const user = await fetchCurrentUser();
    const jwtToken = user.signInUserSession.idToken.jwtToken;
    return jwtToken;
  } catch (err) {
    console.log("User not authenticated", err);
    return null;
  }
}

export async function getSocket() {
  const user = await fetchCurrentUser();
  const user_name = user.username;
  console.log(`Connecting to ${WS_BACKEND_URL}/ws/${user_name}`);
  const socket = new WebSocket(`${WS_BACKEND_URL}/ws/${user_name}`);

  return socket;
}

export async function getBookList() {
  const token = await fetchToken();
  try {
    const response = await axios.get(`${HTTP_BACKEND_URL}/books`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response: ", response);
    console.log("response.data: ", response.data);

    return response.data;
  } catch (err) {
    console.error("Error fetching book list", err);
  }
}

export async function uploadFile(data) {
  const token = await fetchToken();
  try {
    const response = await axios.post(`${HTTP_BACKEND_URL}/upload`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const message = await response.data;
    return message;
  } catch (err) {
    console.error("Error uploading file", err);
  }
}

export async function getBook(book_title) {
  const token = await fetchToken();
  try {
    const response = await axios.get(`${HTTP_BACKEND_URL}/book/${book_title}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });

    console.log("response: ", response);
    return response.data;
  } catch (err) {
    console.error("Error fetching book", err);
  }
}
