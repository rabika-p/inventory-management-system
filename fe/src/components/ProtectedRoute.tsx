import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({  }) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    console.log("Logged in");
    return <Navigate to="/home" />;
  }
};
