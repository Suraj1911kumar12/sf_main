import React, { useContext, useEffect, useState } from "react";
import { getRequest } from "../../../../utils/apicall";
import { apis } from "../../../../utils/connection";
import CardLayout from "../../../../components/layouts/CardLayout";
import UserContext from "../../../../context/userContext";
import CustomImage from "../../../../customs/CustomImage";

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setPersonalChat, setGroupChat } = useContext(UserContext);

  const getGroups = async () => {
    const api = `${apis.empUrl}/group/list`;
    try {
      setIsLoading(true);
      const response = await getRequest(api);
      if (response?.status) {
        setGroups(response?.data?.data);
        setPersonalChat(null);
        setGroupChat(response?.data?.data?.[0]);
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
        <div className="flex justify-center items-center h-32">
          <div className="loader border-t-4 border-blue-500 rounded-full w-10 h-10 animate-spin"></div>
        </div>
      ) : groups.length > 0 ? (
        <ul className="space-y-4">
          {groups.map((groupData) => {
            const { group, unseen, lastMessage, addedBy } = groupData;
            return (
              <li
                key={group.uuid}
                onClick={() => {
                  setPersonalChat(null);
                  setGroupChat(group);
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
                  {unseen > 0 ? (
                    <span className="inline-block bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                      {unseen} New
                    </span>
                  ) : (
                    1
                  )}
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
