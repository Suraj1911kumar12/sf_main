import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import ChatFullSearch from "../../../components/Searchs/ChatFullSearch";
import GroupList from "./ChatList/GroupList";
import PersonalList from "./ChatList/PersonalList";
import ChatContent from "../../../components/UIComponent/Chats_comp/ChatContent";
import UserContext from "../../../context/userContext";

const Chat = () => {
  const [activeTab, setActiveTab] = useState(1);
  const { totalCountForList, setTotalCountForList } = useContext(UserContext);

  const tabs = [
    {
      id: 1,
      title: `Chat ${
        totalCountForList?.list?.length > 0
          ? `(${totalCountForList.list?.length})`
          : ""
      }`,
    },
    {
      id: 2,
      title: `Group ${
        totalCountForList?.group?.length > 0
          ? `(${totalCountForList.group?.length})`
          : ""
      }`,
    },
  ];

  return (
    <>
      {/* <div className="w-full flex flex-col md:flex-row gap-5 px-2 h-full"> */}
      {/* Sidebar Section */}
      <div
        className="w-full  flex flex-col gap-4 "
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ChatFullSearch placeholder="Search..." />
        <ul className="flex gap-2">
          {tabs.map((tab) => (
            <li
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer text-sm font-medium px-6 py-2 rounded-full transition-colors duration-300 ${
                activeTab === tab.id
                  ? "bg-mainColor text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-mainColor/50 hover:text-white"
              }`}
            >
              {tab.title}
            </li>
          ))}
        </ul>
        <div
          className=" text-gray-700"
          key={activeTab}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 1 && <PersonalList />}
          {activeTab === 2 && <GroupList />}
        </div>
      </div>

      {/* Content Section */}
      {/* </div> */}
    </>
  );
};

export default Chat;
