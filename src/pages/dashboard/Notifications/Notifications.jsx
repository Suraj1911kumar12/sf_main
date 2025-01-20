import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CardLayout from "../../../components/layouts/CardLayout";
import { getRequest, postRequest } from "../../../utils/apicall";
import { apis, socket } from "../../../utils/connection";
import CustomImage from "../../../customs/CustomImage";
import { formatDate } from "../../../utils/formatter";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("notifications");
  const [allNotifications, setAllNotifications] = useState([]);
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
        setAllNotifications(response.data.data);
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
    } else if (activeTab === "request") {
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

  const processedContent = (data) => {
    return data?.map((content) => {
      let processedContent = content.content;

      if (processedContent.includes("#@groupAdder#") && content.groupAdder) {
        processedContent = processedContent.replace(
          "#@groupAdder#",
          content?.groupAdder?.name
        );
      }

      if (
        processedContent.includes("#@connectionSender#") &&
        content?.connectionSender
      ) {
        processedContent = processedContent.replace(
          "#@connectionSender#",
          content?.connectionSender?.name
        );
      }

      return {
        ...content,
        content: processedContent,
      };
    });
  };

  const processedList = processedContent(allNotifications);

  return (
    <div className="w-full h-full max-h-screen flex flex-col gap-8 p-6">
      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex w-auto items-center rounded-full shadow-lg gap-4 bg-white p-2">
          {["notifications", "request"].map((tab) => (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab === "notifications" ? "Notifications" : "Requests"}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        className="w-full max-w-4xl mx-auto overflow-y-auto"
        key={activeTab}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.5 }}
      >
        {activeTab === "notifications" && (
          <CardLayout>
            <div>
              {processedList?.length > 0 ? (
                processedList?.map((data) => (
                  <motion.div
                    key={data?.dataId || data?.name}
                    className={`flex items-center p-4 mb-3 rounded-lg cursor-pointer ${
                      !data?.isSeen
                        ? "bg-blue-50 border-l-4 border-blue-400"
                        : "bg-white"
                    } hover:bg-gray-50 shadow-sm transition-all duration-200`}
                    whileHover={{ scale: 1.0 }}
                  >
                    {/* Avatar */}
                    <div className="relative w-14 h-14 rounded-full border border-gray-300 shadow-md">
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
                        {formatDate(data?.createdAt, "proper")}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-gray-600 py-10">
                  <div className="text-4xl text-gray-300 mb-4">🔔</div>
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
                  <motion.div
                    key={item?.user1?.uuid}
                    className="flex items-center p-4 mb-3 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-all"
                    whileHover={{ scale: 1.0 }}
                  >
                    {/* Avatar */}
                    <div className="relative w-14 h-14 rounded-full border border-gray-300 shadow-md">
                      <CustomImage
                        src={item?.image || item?.image?.path}
                        alt="User Avatar"
                        className="w-full h-full object-cover rounded-full"
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
                            <motion.button
                              onClick={() => acceptRequest(item?.user1?.id)}
                              className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 shadow-md transition-all"
                              whileHover={{ scale: 1.1 }}
                            >
                              ✅
                            </motion.button>
                            <motion.button
                              onClick={() => rejectRequest(item?.user1?.id)}
                              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-md transition-all"
                              whileHover={{ scale: 1.1 }}
                            >
                              ❌
                            </motion.button>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-600 mt-1">
                        {formatDate(item.sentAt, "proper")}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10">
                  <div className="text-4xl text-gray-300 mb-4">📬</div>
                  <p className="text-gray-600 text-lg">No requests found.</p>
                  <p className="text-gray-400">
                    Please check back later or invite connections.
                  </p>
                </div>
              )}
            </div>
          </CardLayout>
        )}
      </motion.div>
    </div>
  );
};

export default Notifications;
