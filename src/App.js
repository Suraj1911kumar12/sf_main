import React from "react";
import MainRoutes from "./routes/MainRoutes";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <MainRoutes />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};

export default App;
