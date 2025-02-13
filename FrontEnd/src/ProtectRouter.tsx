import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "./stores/authStore";

export const ProtectRouter = () => {
  const { userId } = useAuthStore();

  console.log("protect router userId :", userId);

  if (userId) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};
