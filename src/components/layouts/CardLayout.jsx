import React from "react";

const CardLayout = ({ children, className }) => {
  return (
    <div className={`bg-white rounded-xl p-4 ${className} `}>{children}</div>
  );
};

export default CardLayout;
