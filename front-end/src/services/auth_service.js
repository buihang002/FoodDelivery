import { Environment } from "../enviroments/enviroment";
import axios from "axios";

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
