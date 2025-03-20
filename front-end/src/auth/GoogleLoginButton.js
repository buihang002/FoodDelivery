import React from "react";
import { GoogleLogin } from "react-google-login";
import axios from "axios";

const GoogleLoginButton = ({ onLoginSuccess }) => {
  const handleSuccess = async (response) => {
    try {
      const { tokenId } = response;
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/google/callback`,
        { tokenId },
        { withCredentials: true }
      );

      if (res.status === 200) {
        onLoginSuccess(res.data);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleFailure = (response) => {
    console.error("Google Login Failed", response);
  };

  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      buttonText="Login with Google"
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GoogleLoginButton;
