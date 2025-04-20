import axios from "axios";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
} from "../reducers/authReducer";

const API_URL = "http://localhost:5000/api/auth";

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(registerStart());
    const response = await axios.post(`${API_URL}/register`, userData);
    dispatch(registerSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(registerFailure(error.response?.data?.message || error.message));
    throw error;
  }
};

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const response = await axios.post(`${API_URL}/login`, credentials);

    // Store the complete auth data
    localStorage.setItem(
      "profile",
      JSON.stringify({
        user: response.data.user,
        token: response.data.token,
      })
    );

    dispatch(loginSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(loginFailure(error.response?.data?.message || error.message));
    throw error;
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch(logout());
};

export const loadUser = () => async (dispatch, getState) => {
  const { token } = getState().auth;
  if (!token) return;

  try {
    // You might want to add an endpoint to fetch user data with token
    // const response = await axios.get(`${API_URL}/me`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // dispatch(loginSuccess({ user: response.data, token }));
  } catch (error) {
    dispatch(logout());
  }
};
