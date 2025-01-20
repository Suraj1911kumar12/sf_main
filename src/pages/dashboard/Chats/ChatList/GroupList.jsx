import React, { useContext, useEffect, useState } from "react";
import { getRequest } from "../../../../utils/apicall";
import { apis } from "../../../../utils/connection";
import CardLayout from "../../../../components/layouts/CardLayout";
import UserContext from "../../../../context/userContext";
import CustomImage from "../../../../customs/CustomImage";
import ChatContentSkeleton from "../../../../components/loaders/Skeletons/ChatSkeletonLoader";

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    setPersonalChat,
    setGroupChat,
    totalCountForList,
    setTotalCountForList,
  } = useContext(UserContext);

  const [notif_cont, setNotif_count] = useState([
    {
      id: null,
      count: 0,
    },
  ]);

  const getGroups = async () => {
    const api = `${apis.empUrl}/group/list`;
    try {
      setIsLoading(true);
      const response = await getRequest(api);
      if (response?.status) {
        setGroups(response?.data?.data);
        setPersonalChat(null);
        response?.data?.data.forEach((e) => {
          setNotif_count((prev) => {
            const existingIndex = prev.findIndex(
              (item) => item.id === e?.group?.uuid
            );

            if (existingIndex !== -1) {
              const updatedNotifCount = [...prev];
              updatedNotifCount[existingIndex] = {
                ...updatedNotifCount[existingIndex],
                count: e?.unseen,
              };
              return updatedNotifCount;
            } else {
              return [
                ...prev,
                {
                  id: e?.group?.uuid,
                  count: e?.unseen,
                },
              ];
            }
          });
        });

        const listTotal = response?.data?.data?.filter((e) => e?.unseen > 0);
        setTotalCountForList((prev) => ({ ...prev, group: listTotal || 0 }));
      } else {
        setGroups([]);
        console.error("Error while fetching groups", response?.data?.msg);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(notif_cont, "not");

  useEffect(() => {
    getGroups();
  }, []);

  const convertMsg = (content, from, to) => {
    let data = content;
    data = data.replaceAll("#@from#", from);
    data = data.replaceAll("#@to#", to);
    return data;
  };

  return (
    <CardLayout className="p-4 bg-gray-50 ">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Group List</h1>
      {isLoading ? (
        <ChatContentSkeleton />
      ) : groups.length > 0 ? (
        <ul className="space-y-4">
          {groups?.map((groupData) => {
            const { group, unseen, lastMessage, addedBy } = groupData;
            return (
              <li
                key={group.uuid}
                onClick={() => {
                  setPersonalChat(null);
                  setGroupChat(groupData);
                }}
                className="p-4 bg-white border-b  flex gap-2 items-center  cursor-pointer justify-between"
              >
                <div className=" flex items-center gap-2">
                  <CustomImage
                    src={group?.image?.path}
                    alt={group.name}
                    className={"w-12 h-12 rounded-full object-cover"}
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700">
                      {group.name}
                    </h2>

                    {lastMessage && (
                      <div className="mt-2">
                        <div
                          className="text-sm text-gray-700"
                          dangerouslySetInnerHTML={{
                            __html: convertMsg(
                              lastMessage.content,
                              lastMessage?.from?.name,
                              lastMessage?.to?.name
                            ),
                          }}
                        ></div>
                        {/* <p className="text-xs text-gray-500">
                        {new Date(lastMessage.createdAt).toLocaleString()}
                      </p> */}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {/* {unseen > 0 ? (
                    <span className="inline-block bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                      {unseen} New
                    </span>
                  ) : (
                    1
                  )} */}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-center text-gray-600">No groups found.</p>
      )}
    </CardLayout>
  );
};

export default GroupList;
