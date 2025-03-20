import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import StoreContextProvider from "./context/StoreContext.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { Environment } from "./environments/environment.js";
// const clientId = Environment.GG_CLIENT_ID;
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId="602355913957-mtrjdl9igl71ibo30gu19fut4fm0l7cf.apps.googleusercontent.com">
    <BrowserRouter>
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
