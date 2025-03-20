import axios from "axios";
import { Environment } from "../environments/environment.js";

const AuthService = {
  googleAuth: async (token) => {
    const response = await axios.post(
      `${Environment.BASE_API}/api/user/googleauth`,
      { token }
    );
    return response.data;
  },
};

export default AuthService;
