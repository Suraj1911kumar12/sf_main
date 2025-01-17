import React, { useContext, useEffect, useState, useRef } from "react";
import { postRequest } from "../../../utils/apicall";
import { apis } from "../../../utils/connection";
import ChatFullSearch from "../../../components/Searchs/ChatFullSearch";
import CardLayout from "../../../components/layouts/CardLayout";
import ChatContentSkeleton from "../../../components/loaders/Skeletons/ChatSkeletonLoader";
import CustomImage from "../../../customs/CustomImage";
import { MdOutlinePermContactCalendar, MdOutlineTaskAlt } from "react-icons/md";
import { GoBlocked } from "react-icons/go";
import UserContext from "../../../context/userContext";

const Contacts = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeContactLetter, setActiveContactLetter] = useState("A");
  const { personalChat, setPersonalChat, isContactListUpdated } =
    useContext(UserContext);
  const [id, setId] = useState(null);
  const sectionRefs = useRef({});
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const getAllUsers = async () => {
    const api = apis.empUrl + `/user/list`;
    const payload = {
      count: 1000,
      page: 1,
      search: "",
    };
    try {
      const response = await postRequest(api, payload);
      if (response.status) {
        setAllUsers(response.data?.data);
        setPersonalChat(response?.data?.data?.[0]);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [isContactListUpdated]);

  const sortedData = allUsers?.sort((a, b) => a.name.localeCompare(b.name));

  const groupedUsers = sortedData?.reduce((acc, user) => {
    const firstLetter = user.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(user);
    return acc;
  }, {});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const letter = entry.target.getAttribute("data-letter");
          if (entry.isIntersecting) {
            setActiveContactLetter(letter);
          }
        });
      },
      {
        threshold: 1,
      }
    );

    Object.keys(groupedUsers).forEach((letter) => {
      if (sectionRefs.current[letter]) {
        observer.observe(sectionRefs.current[letter]);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [groupedUsers]);

  const handleLetterClick = (letter) => {
    setActiveContactLetter(letter);
    const section = sectionRefs.current[letter];
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 h-full relative">
      <ChatFullSearch />

      <CardLayout>
        {isLoading ? (
          <ChatContentSkeleton />
        ) : (
          <div className="flex gap-4  max-h-[80vh] relative overflow-y-auto">
            <div className="flex flex-col gap-4  w-full max-h-[80vh] relative overflow-y-auto">
              <h1 className="text-xl font-semibold">Contacts</h1>
              <div className="flex">
                <div className="flex w-full p-3 flex-col gap-4">
                  {allUsers?.length > 0 ? (
                    Object.keys(groupedUsers).map((letter) => (
                      <div
                        key={letter}
                        ref={(el) => (sectionRefs.current[letter] = el)}
                        data-letter={letter}
                        className="section"
                      >
                        <div className="flex items-center justify-start gap-4 w-full">
                          <h3 className="font-bold text-lg">{letter}</h3>
                        </div>
                        <div className="flex flex-col gap-2">
                          {groupedUsers[letter].map((user) => (
                            <div
                              key={user.id}
                              onClick={() => {
                                setPersonalChat(user);
                                setId(user?.connectionId);
                              }}
                              className="flex relative items-center gap-4 p-4 border rounded-lg shadow-md hover:bg-gray-50"
                            >
                              <CustomImage
                                src={user.image?.path}
                                alt={user.name}
                                className="w-8 h-8 rounded-full object-cover cursor-pointer"
                              />
                              <div className="flex flex-col cursor-pointer w-full">
                                <span className="font-medium text-sm">
                                  {user.name}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {user.email}
                                </span>
                              </div>
                              <div className="flex items-end justify-end w-[55px] gap-2 text-xs text-gray-400 absolute right-3 top-[35%]">
                                {!user?.connectionStatus ||
                                user?.connectionStatus === "REJECTED" ? (
                                  <MdOutlinePermContactCalendar size={24} />
                                ) : user?.connectionStatus === "PENDING" ? (
                                  "Requested"
                                ) : user?.connectionStatus === "Blocked" ? (
                                  <GoBlocked size={24} />
                                ) : (
                                  <MdOutlineTaskAlt size={22} />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>No User Found</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sticky top-0 z-10 text-xs">
              {alphabet.map((e) => (
                <div
                  key={e}
                  className={`uppercase ${
                    Object.keys(groupedUsers)?.includes(e)
                      ? "text-black font-bold cursor-pointer"
                      : "text-gray-500 cursor-not-allowed"
                  } size-8 flex items-center justify-center rounded-full ${
                    activeContactLetter === e
                      ? "bg-mainColor text-white"
                      : "bg-transparent "
                  }`}
                  onClick={() =>
                    Object.keys(groupedUsers)?.includes(e) &&
                    handleLetterClick(e)
                  }
                >
                  {e}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardLayout>
    </div>
  );
};

export default Contacts;
