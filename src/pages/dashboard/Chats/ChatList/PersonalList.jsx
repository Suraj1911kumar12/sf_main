import React, { useContext, useEffect, useState } from "react";
import { postRequest } from "../../../../utils/apicall";
import { apis, socket } from "../../../../utils/connection";
import CardLayout from "../../../../components/layouts/CardLayout";
import ListSkeletonLoader from "../../../../components/loaders/Skeletons/ListSkeletonLoader";
import UserContext from "../../../../context/userContext";
import { formatDate } from "../../../../utils/formatter";
import CustomImage from "../../../../customs/CustomImage";

const PersonalList = () => {
  const {
    setPersonalChat,
    personalListUpdated,
    personalListNotifications,
    setPersonalListNotifications,
  } = useContext(UserContext);
  const [personalChats, setPersonalChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPersonalChats = async () => {
    setIsLoading(true);
    const api = `${apis.empUrl}/user/log/list`;
    const payload = {
      count: 1000,
      page: 1,
      search: "",
    };

    try {
      const response = await postRequest(api, payload);
      if (response?.status) {
        const data = response.data?.data;
        setPersonalChats(data);
        data?.forEach((e) => {
          setPersonalListNotifications((prev) => [
            ...prev,
            {
              id: e?.userUUID,
              count: e?.unseenMsgCount,
            },
          ]);
        });
        // setPersonalChat(response?.data?.data?.[0]);
      } else {
        setPersonalChats([]);
        console.error(
          "Error while fetching personal chats",
          response?.data?.msg
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPersonalChats();
  }, []);

  useEffect(() => {
    socket.on("personal-list-updated", (data) => {
      setPersonalChats(data?.log);
    });
    return () => {
      socket.off("personal-list-updated");
    };
  }, []);

  return (
    <div className="h-full max-h-[500px]  overflow-y-auto ">
      <CardLayout className={"overflow-hidden"}>
        <h1 className="text-xl font-semibold">Personal Chats</h1>
        {isLoading ? (
          <ListSkeletonLoader />
        ) : (
          <div className="space-y-4 mt-4">
            {personalChats?.map((chat) => {
              const {
                id,
                finalPath,
                userName,
                lastMsg_Content,
                lastMsg_seenAt,
                userUUID,
              } = chat;
              const notification = personalListNotifications?.find(
                (notif) => notif?.id === userUUID
              );
              // console.log("notification", notification);

              return (
                <div
                  key={id}
                  onClick={() => {
                    setPersonalChat(chat);
                    setPersonalListNotifications((prev) =>
                      prev.map((notif) =>
                        notif.id === userUUID ? { ...notif, count: "0" } : notif
                      )
                    );
                  }}
                  className={`flex items-center justify-between p-4 cursor-pointer bg-white border-b`}
                >
                  {/* User Information */}
                  <div className="flex items-center gap-4">
                    <CustomImage
                      src={finalPath}
                      alt={userName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-700">
                        {userName}
                      </div>
                      <div
                        className="text-sm max-w-[400px]  overflow-hidden text-gray-500 truncate"
                        dangerouslySetInnerHTML={{
                          __html: lastMsg_Content || "",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Message Status */}
                  <div className="flex flex-col items-end justify-between">
                    <span className="text-sm text-gray-400">
                      {lastMsg_seenAt &&
                        `${formatDate(lastMsg_seenAt, "proper")}`}
                    </span>
                    {notification?.count > 0 && (
                      <span className="text-xs bg-orange size-5 flex items-center justify-center rounded-full text-white">
                        {notification?.count}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardLayout>
    </div>
  );
};

export default PersonalList;
