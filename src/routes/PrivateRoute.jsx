import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const AccessToken = sessionStorage.getItem("Softfix_Web_Token");
  if (!AccessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};
export default PrivateRoute;
