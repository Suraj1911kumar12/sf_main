import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { apis } from "../utils/connection";
import { getRequest } from "../utils/apicall";
import { useDispatch } from "react-redux";
import {
  fetchInfoError,
  fetchInfoStart,
  fetchInfoSuccess,
} from "../redux/slices/UserInfoSlice";
import ChatContent from "../components/UIComponent/Chats_comp/ChatContent";
import usePathSegment from "../context/useSegment";
import GroupChatContent from "../components/UIComponent/Chats_comp/GroupChatContent";
import UserContext from "../context/userContext";

const MainLayout = () => {
  const dispatch = useDispatch();
  const [val, setVal] = useState("chat");
  const { personalChat } = useContext(UserContext);
  const pathsegment = usePathSegment();

  const getMyInformation = async () => {
    dispatch(fetchInfoStart());
    try {
      const response = await getRequest(`${apis.empUrl}/profile`);
      const result = await response?.data?.data;
      dispatch(fetchInfoSuccess(result));
    } catch (error) {
      dispatch(fetchInfoError(error));
      console.error(error);
    }
  };

  useEffect(() => {
    getMyInformation();
  }, []);

  useEffect(() => {
    setVal(pathsegment);
  }, [pathsegment]);

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="  h-[70px] md:h-full ">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Outlet Area */}
        <div className="flex-1 md:max-w-[55%] h-full overflow-auto p-4">
          <Outlet />
        </div>

        {/* Chat Section */}
        {(pathsegment === "contacts" ||
          pathsegment === "chat" ||
          pathsegment === "notifications") && (
          <div className="w-full md:w-[45%] max-w-[580px] h-full overflow-hidden p-4">
            {personalChat ? (
              <ChatContent page={val} />
            ) : (
              <GroupChatContent page={val} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
