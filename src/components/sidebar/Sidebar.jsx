import React from "react";
import softfixShort from "../../assets/images/softfixShort.png";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import HomeIcon from "../../assets/icons/Home.png";
import ChatIcon from "../../assets/icons/chat.png";
import BellIcon from "../../assets/icons/bell.png";
import contacts from "../../assets/icons/all_contact.png";
import { removeTokens } from "../../utils/connection";

const Sidebar = () => {
  const userInfo = useSelector((state) => state?.userInfo);

  const sidebarData = [
    {
      id: 1,
      name: "Home",
      path: "/",
      image: HomeIcon,
    },
    {
      id: 2,
      name: "Message",
      path: "/dashboard/chat",
      image: ChatIcon,
    },
    {
      id: 3,
      name: "Notifications",
      path: "/dashboard/notifications",
      image: BellIcon,
    },
    {
      id: 4,
      name: "Contacts",
      path: "/dashboard/contacts",
      image: contacts,
    },
  ];

  return (
    <div className="px-6 py-4 h-full">
      <div className="bg-mainColor text-white flex flex-col md:flex-col md:w-24 md:h-full w-full fixed bottom-0 left-0 z-50 shadow-lg md:relative rounded-t-xl md:rounded-2xl">
        <div className="hidden md:flex flex-col items-center justify-center p-4 mb-4">
          <div className="size-16 flex flex-col gap-3 items-center justify-center cursor-pointer rounded-full p-2">
            <img
              src={userInfo?.data?.image?.path || softfixShort}
              alt="Softfix Logo"
              className="w-full h-full object-fill rounded-full"
            />
          </div>
          <p>{userInfo?.data?.name}</p>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 w-full">
          <ul className="flex md:flex-col justify-evenly items-center md:space-y-1 w-full">
            {sidebarData.map((item) => (
              <li key={item.id} className="w-full py-2 md:transition">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-center w-full py-3  md:border-r-4  ${
                      isActive
                        ? "border-golden bg-black/20"
                        : "border-mainColor hover:bg-black/20 hover:border-golden"
                    }`
                  }
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-8 h-8 object-contain"
                  />
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout Section */}
        <div
          onClick={() => {
            removeTokens();
          }}
          className="hidden md:flex items-center justify-center p-4"
        >
          <a
            href="/"
            className="flex items-center justify-center w-full p-2 rounded-lg bg-red-500 hover:bg-red-700 transition"
          >
            <img
              src={require("../../assets/icons/logout.png")}
              alt="Logout"
              className="w-8 h-8 object-contain"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
