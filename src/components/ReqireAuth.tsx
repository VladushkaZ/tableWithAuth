import { useLocation, Navigate } from "react-router-dom";
import { type JSX } from "react";
import useStore from "../store";
import Cookies from "js-cookie";

interface RequireAuthProps {
  children: JSX.Element;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuth} = useStore();
  const location = useLocation();
  const token = Cookies.get("token");

  if (!isAuth && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
