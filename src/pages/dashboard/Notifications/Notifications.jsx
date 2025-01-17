import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CardLayout from "../../../components/layouts/CardLayout";
import { getRequest, postRequest } from "../../../utils/apicall";
import { apis, socket } from "../../../utils/connection";
import CustomImage from "../../../customs/CustomImage";
import { formatDate } from "../../../utils/formatter";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("notifications");
  const [allNotifications, setAllNotfications] = useState([]);
  const [allRequests, setAllRequests] = useState([]);

  const getAllNotifications = async (isSeen = true) => {
    const payload = {
      count: 1000,
      page: 1,
      markSeen: isSeen,
    };
    try {
      const response = await postRequest("emp/notification/list", payload);
      if (response.status) {
        setAllNotfications(response.data.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const getAllRequest = async () => {
    try {
      const response = await getRequest("emp/user/get-connection-request");
      if (response.status) {
        setAllRequests(response.data.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    if (activeTab === "notifications") {
      getAllNotifications();
    }
    if (activeTab === "request") {
      getAllRequest();
    }
  }, [activeTab]);
  useEffect(() => {
    socket.on("receive-connection-req", (data) => {
      console.log("Received connection", data);
    });
    socket.on("receive-notification", (data) => {
      console.log("data:===========>", data);
    });
    return () => {
      socket.off("receive-connection-req");
      socket.off("receive-notification");
    };
  }, []);

  const processNotifications = (notifications) => {
    return notifications?.map((notification) => {
      let processedContent = notification.content;

      if (
        processedContent.includes("#@connectionSender#") &&
        notification.connectionSender
      ) {
        processedContent = processedContent.replace(
          "#@connectionSender#",
          notification.connectionSender.name
        );
      }

      if (
        processedContent.includes("#@groupadder#") &&
        notification.groupAdder
      ) {
        processedContent = processedContent.replace(
          "#@groupadder#",
          notification.groupAdder.name
        );
      }

      return {
        ...notification,
        content: processedContent,
      };
    });
  };

  const processedNotifications = processNotifications(allNotifications);

  const acceptRequest = async (uuid) => {
    socket.emit("action-on-connection-req", { userId: uuid, action: "ACTIVE" });
    getAllRequest();
  };
  const rejectRequest = async (uuid) => {
    socket.emit("action-on-connection-req", {
      userId: uuid,
      action: "REJECTED",
    });
    getAllRequest();
  };

  return (
    <div className="w-full h-full max-h-screen  flex flex-col gap-8 p-6 bg-gray-100">
      {/* Tab Navigation */}
      <div className="flex ">
        <div className="flex  w-auto items-center rounded-full shadow-lg  gap-4 ">
          {["notifications", "request"].map((tab) => (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-mainColor text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab === "notifications" ? "Notifications" : "Requests"}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-full max-w-4xl mx-auto overflow-y-auto">
        {activeTab === "notifications" && (
          <CardLayout>
            <div>
              {processedNotifications?.length > 0 ? (
                processedNotifications.map((data) => (
                  <div
                    key={data?.dataId || data?.name}
                    className={`flex items-center p-4 mt-3 rounded-lg cursor-pointer ${
                      !data?.isSeen ? "bg-blue-50" : "bg-white"
                    } hover:bg-gray-50 shadow-sm transition-all duration-200`}
                  >
                    {/* Avatar */}
                    <div className="relative  w-14 h-12 rounded-full border border-gray-300 shadow-md">
                      <CustomImage
                        src={data?.avatar}
                        alt={data?.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                      <div className="absolute bottom-0 right-[-4px] items-center flex justify-center text-white w-6 h-6 z-50 bg-gray-600 rounded-full">
                        @
                      </div>
                    </div>

                    {/* Notification Info */}
                    <div className="ml-6 flex flex-col w-full">
                      <div className="flex justify-between items-center w-full">
                        <span className="text-base font-medium text-gray-800">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: data.content,
                            }}
                          />
                        </span>
                        <span className="text-sm text-gray-500">
                          {data.time}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 mt-1">
                        {data.message}
                      </span>
                      <span className="text-sm text-gray-600 mt-1">
                        {formatDate(data?.createdAt, "proper")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-600 py-10">
                  No notifications to show.
                </div>
              )}
            </div>
          </CardLayout>
        )}

        {activeTab === "request" && (
          <CardLayout>
            <div>
              {allRequests?.length > 0 ? (
                allRequests.map((item) => (
                  <div
                    key={item?.user1?.uuid}
                    className="flex items-center p-4 mb-3 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-all"
                  >
                    {/* Avatar */}
                    <div className="relative w-14 h-12 rounded-full border border-gray-300 shadow-md">
                      <CustomImage
                        src={item?.image || item?.image?.path}
                        alt="User Avatar"
                        className="w-full h-full  object-cover rounded-full"
                      />
                    </div>

                    {/* Request Info */}
                    <div className="ml-6 flex flex-col w-full">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-800">
                          {item?.user1?.name}
                        </span>
                        {item?.status === "PENDING" && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => acceptRequest(item?.user1?.id)}
                              className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 shadow-md transition-all"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => rejectRequest(item?.user1?.id)}
                              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-md transition-all"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-600 mt-1">
                        {formatDate(item.sentAt, "proper")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-600 text-lg">No requests found.</p>
                  <p className="text-gray-400">
                    Please check back later or invite connections.
                  </p>
                </div>
              )}
            </div>
          </CardLayout>
        )}
      </div>
    </div>
  );
};

export default Notifications;
