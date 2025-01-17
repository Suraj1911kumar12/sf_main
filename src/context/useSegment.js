import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const usePathSegment = () => {
  const location = useLocation();
  const [pathValue, setPathValue] = useState("");

  useEffect(() => {
    const pathname = location.pathname.split("/");
    const lastSegment = pathname[pathname.length - 1];
    setPathValue(lastSegment);
  }, [location]);

  return pathValue;
};

export default usePathSegment;
