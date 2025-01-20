import React, { useState } from "react";
import UserContext from "./userContext";

const UserContextProvider = ({ children }) => {
  const [personalChat, setPersonalChat] = useState(null);
  const [isContactListUpdated, setIsContactListUpdated] = useState(null);
  const [groupChat, setGroupChat] = useState(null);
  const [personalListUpdated, setPersonalListUpdated] = useState(null);
  const [personalListNotifications, setPersonalListNotifications] = useState([
    {
      id: null,
      count: null,
    },
  ]);

  const [totalCountForList, setTotalCountForList] = useState({
    list: [],
    group: [],
  });

  return (
    <UserContext.Provider
      value={{
        personalChat,
        setPersonalChat,

        personalListNotifications,
        setPersonalListNotifications,

        personalListUpdated,
        setPersonalListUpdated,

        groupChat,
        setGroupChat,

        isContactListUpdated,
        setIsContactListUpdated,

        totalCountForList,
        setTotalCountForList,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
