import { Auth } from "aws-amplify";
import { WS_BACKEND_URL } from "./constants.js";

export async function fetchCurrentUser() {
  console.log("Fetching current user");
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user;
  } catch (err) {
    console.log("User not authenticated", err);
    return null;
  }
}

export async function fetchToken() {
  console.log("Fetching token");
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
  console.log("Getting socket");
  const user = await fetchCurrentUser();
  const user_name = user.username;
  console.log(`Connecting to ${WS_BACKEND_URL}/ws/${user_name}`);
  const socket = new WebSocket(`${WS_BACKEND_URL}/ws/${user_name}`);

  return socket;
}
