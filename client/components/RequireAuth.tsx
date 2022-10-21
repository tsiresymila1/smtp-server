import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth";
export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  let auth = useAuth();
  let location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!auth.access_token || location.pathname === "/logout") {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      navigate("/login", {
        replace: true,
      });
    }
  }, []);

  return children;
};
