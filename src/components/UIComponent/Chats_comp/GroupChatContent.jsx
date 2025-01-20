import React, { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import UserContext from "../../../context/userContext";
import { apis, socket } from "../../../utils/connection";
import { postRequest, uploadImage } from "../../../utils/apicall";
import ChatContentSkeleton from "../../loaders/Skeletons/ChatSkeletonLoader";

import callIocn from "../../../assets/icons/Call.png";
import videocallIcon from "../../../assets/icons/VidoeCall.png";
import threeDot from "../../../assets/icons/threeDot.png";
import CustomImage from "../../../customs/CustomImage";
import fileUplaodIcon from "../../../assets/icons/fileUpload.png";
import uploadImageIcon from "../../../assets/icons/CamIcon.png";
import recorder from "../../../assets/icons/bi_mic-fill.png";
import emojiIcon from "../../../assets/icons/emoji.png";
import CustomEmojiPicker from "../../../customs/CustomEmojiPicker";
import sendIcon from "../../../assets/icons/send message,.png";
import toast from "react-hot-toast";
import { FileType, findExtension } from "../../../utils/defaults";
import { RxCross2, RxCrossCircled } from "react-icons/rx";
import { HiOutlinePlus, HiReply } from "react-icons/hi";
import { useSelector } from "react-redux";
import ContactRequestUI from "../../layouts/ContactRequestUI";
import usePathSegment from "../../../context/useSegment";
import { formatDate } from "../../../utils/formatter";
import MessageDetailsModal from "../MsgDetails";
import MessageDetailsModalForGroup from "../MsgDetailsforGroup";
import GroupDetails from "../details/GroupDetails";

const GroupChatContent = () => {
  const { groupChat, setIsContactListUpdated } = useContext(UserContext);
  const userInfo = useSelector((state) => state?.userInfo);
  const scrollableDiv = useRef(null);
  const lastSegment = usePathSegment();
  const groupChatRef = useRef(groupChat);

  const [personalLogs, setPersonalLogs] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState({
    data: null,
    isOpen: false,
  });

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [repliedMsg, setRepliedMessage] = useState({
    data: null,
    isOpen: false,
  });

  // console.log("lastSegment", lastSegment);

  const getPersonalLog = async () => {
    const api = apis.empUrl + "/group/activity/logs";
    const payload = {
      groupId: groupChat?.group?.id,
      count: 10000,
      lastSegment: 1,
      search: "",
      // markSeen: true,
    };
    try {
      const response = await postRequest(api, payload);
      if (response.status) {
        setPersonalLogs(response.data.data);
      }
    } catch (error) {
      setPersonalLogs([]);
      console.error("Error while fetching personal logs", error);
    } finally {
      setIsLoading(false);
    }
  };

  const socketMsgReceiveSelf = (data) => {
    const MsgDet = data?.log?.data;
    const receiveSelfMsg = {
      content: MsgDet?.content,
      createdAt: MsgDet?.createdAt,
      editedAt: MsgDet?.editedAt,
      file: {
        extension: MsgDet?.extension,
        id: MsgDet?.id,
        path: MsgDet?.file,
      },
      from: {
        email: MsgDet?.from?.email,
        id: MsgDet?.from?.id,
        name: MsgDet?.from?.name,
        role: {
          id: MsgDet?.from?.role?.id,
          name: MsgDet?.from?.role?.name,
          strongId: MsgDet?.from?.role?.strongId,
        },
        uuid: MsgDet?.from?.uuid,
      },
      id: MsgDet?.id,
      isEdited: MsgDet?.isEdited,
      msgType: MsgDet?.msgType,
      repliedTo: MsgDet?.repliedTo,
      to: MsgDet?.to,
      type: MsgDet?.type,
    };

    setPersonalLogs((prev) => [...prev, receiveSelfMsg]);
  };

  useEffect(() => {
    groupChatRef.current = groupChat;
  }, [groupChat]);
  // console.log("groupChatRef.current", groupChatRef.current);

  const socketMsgReceive = (data) => {
    const MsgDet = data?.log?.data;
    console.log("data?.log?.data", data?.log?.data);
    const currentPersonalChat = groupChatRef?.current;

    const newReceiveMsg = {
      content: MsgDet?.content,
      createdAt: MsgDet?.createdAt,
      editedAt: MsgDet?.editedAt,
      file: {
        extension: MsgDet?.extension,
        id: MsgDet?.id,
        path: MsgDet?.file,
      },
      from: {
        email: MsgDet?.from?.email,
        id: MsgDet?.from?.id,
        name: MsgDet?.from?.name,
        role: {
          id: MsgDet?.from?.role?.id,
          name: MsgDet?.from?.role?.name,
          strongId: MsgDet?.from?.role?.strongId,
        },
        uuid: MsgDet?.from?.uuid,
      },
      id: MsgDet?.id,
      isEdited: MsgDet?.isEdited,
      msgType: MsgDet?.msgType,
      repliedTo: MsgDet?.repliedTo,
      to: MsgDet?.to,
      type: MsgDet?.type,
    };
    console.log(
      "MsgDet?.group?.uuid === currentPersonalChat?.group?.uuid",
      MsgDet?.group?.uuid === currentPersonalChat?.group?.uuid
    );
    if (MsgDet?.group?.uuid === currentPersonalChat?.group?.uuid) {
      setPersonalLogs((prev) => [...prev, newReceiveMsg]);
    }

    const notification = {
      userUUID: currentPersonalChat?.uuid,
      msgId: MsgDet?.id,
    };

    socket.emit("current-personal-chat-with-log", notification);
  };
  useEffect(() => {
    socket.on("self-message-for-group", socketMsgReceiveSelf);
    socket.on("receive-message-from-group", socketMsgReceive);

    socket.on("group-list-updated", (data) => {
      console.log("personaol", data);
    });

    return () => {
      socket.off("self-message-for-group");
      socket.off("receive-message-from-group");
      socket.off("group-list-updated");
    };
  }, []);

  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (event, emojiObject) => {
    setInputText((prev) => {
      return prev + emojiObject.emoji;
    });
    setShowPicker(false);
  };

  useEffect(() => {
    if (groupChat) getPersonalLog();
  }, [groupChat]);

  function scrollToBottom() {
    let scrollAbleDiv = scrollableDiv?.current;
    let bottomElm = scrollAbleDiv?.lastElementChild;
    setTimeout(() => {
      bottomElm?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  }

  useEffect(() => {
    scrollToBottom();
  }, [personalLogs]);

  if (!groupChat) {
    return (
      <div className="h-full flex items-center justify-center  text-gray-500">
        No group selected.
      </div>
    );
  }

  const currentUserUUID = userInfo?.data?.uuid;

  const FileHandler = async (e) => {
    console.log("e", e);
    const maxValue = 10;
    const UploadFile = Array.from(e.target.files);

    if (!UploadFile || UploadFile.length === 0) {
      toast.error("No files selected for upload");
      return;
    }

    if (files.length + UploadFile.length > maxValue) {
      toast.error(`You can only upload a maximum of ${maxValue} files.`);
      return;
    }

    UploadFile.forEach(async (file) => {
      try {
        const response = await uploadImage(file);
        console.log("response", response);
        const UploadedFiles = (await response?.data?.data) || [];
        const UploadFilesWithUrl = UploadedFiles.map((file) => ({
          id: file.id,
          url: file.url,
        }));
        setFiles((prev) => [...prev, ...UploadFilesWithUrl]);
      } catch (error) {
        console.error("Error: " + error);
      }
    });
  };
  // console.log("groupChat", groupChat);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const dataToSend = {
          roomId: groupChat?.group?.uuid,
          msgType: "FILE",
          personalRepliedMsgId: null,
          content: inputText || "",
          file: files[i]?.id,
        };
        console.log("dataToSend", dataToSend);
        socket.emit("send-message-in-group", dataToSend);
      }
      setFiles([]);
    } else {
      const payload = {
        roomId: groupChat?.group?.uuid,
        msgType: "TEXT",
        content: inputText.trim(),
        repliedMsgId: repliedMsg?.data?.id || "",
      };
      // console.log("payload", payload);
      socket.emit("send-message-in-group", payload);
      setInputText("");
      setSelectedMessage(null);
      setRepliedMessage({
        data: null,
        isOpen: false,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputText?.trim().length > 0) {
        handleSubmit(e);
      } else {
      }
    }
  };

  const removeFiles = (idxToRemove) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const processedContent = (data) => {
    return data?.map((content) => {
      let processedContent = content.content;

      if (processedContent.includes("#@from#") && content.from) {
        processedContent = processedContent.replace(
          "#@from#",
          content?.from?.name
        );
      }

      if (processedContent.includes("#@to#") && content?.to) {
        processedContent = processedContent.replace("#@to#", content?.to?.name);
      }

      return {
        ...content,
        content: processedContent,
      };
    });
  };

  const processedList = processedContent(personalLogs);

  // console.log("processedNotifications", processedList);

  const handleRightClick = (e, log, side = "right") => {
    console.log(log);
    setShowModal(true);
    setSelectedMessage(log);
    // setContextMenuSize({
    //   top: e.clientY,
    //   left: e.clientX,
    // });
  };

  const handleClickMsgDetails = (data) => {
    console.log("data", data);
    if (data?.id === 2) {
      setRepliedMessage({ data: selectedMessage, isOpen: true });
    }
    if (data?.id === 4) {
      const payload = {
        roomId: groupChat?.group?.uuid,
        msgId: selectedMessage?.id,
      };
      socket.emit("delete-message-in-group", payload);
      setPersonalLogs(
        personalLogs?.filter((log) => log?.id !== selectedMessage?.id)
      );
    }
  };

  const handleUserClick = () => {
    setDetailsModal({
      data: groupChat?.group,
      isOpen: true,
    });
  };
  const closeModal = () => {
    setDetailsModal({ data: null, isOpen: false });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="flex relative flex-col h-full bg-white p-6 rounded-lg shadow-lg shadow-blue-100  "
    >
      {detailsModal?.isOpen && (
        <GroupDetails data={detailsModal.data} onClose={closeModal} />
      )}
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex items-center justify-between border-b mb-4"
      >
        <motion.div
          onClick={handleUserClick}
          className="flex items-center cursor-pointer gap-4 pb-4"
        >
          <CustomImage
            src={groupChat?.group?.icon?.path}
            alt={groupChat?.group?.name}
            className="w-12 h-12 rounded-full object-cover"
          />

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {groupChat?.group?.name}
            </h2>

            <div className="text-sm flex items-center gap-2 text-gray-500">
              <span>
                {`${groupChat?.group?.totalMember} ${
                  groupChat?.group?.totalMember > 1 ? "members" : "member"
                } `}
              </span>
            </div>
          </div>
        </motion.div>
        <motion.div className="flex gap-4 items-center ">
          <img src={callIocn} alt="Call" className=" h-5" />
          <img src={videocallIcon} alt="Video Call" className="h-5" />
          <img src={threeDot} alt="More Options" className=" h-5" />
        </motion.div>
      </motion.div>

      <motion.div
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        ref={scrollableDiv}
      >
        {isLoading ? (
          <ChatContentSkeleton />
        ) : processedList?.length > 0 ? (
          processedList?.map((log, index) => {
            const isCurrentUser = log?.from?.uuid === currentUserUUID;

            const previousLog = processedList[index - 1];
            const isFromSameUser =
              previousLog?.from?.uuid === log?.from?.uuid &&
              new Date(log?.createdAt) - new Date(previousLog?.createdAt) <=
                60000;

            return (
              <div key={log.id}>
                {log?.type === "ACTION" ? (
                  <motion.div
                    className="flex w-full"
                    initial={{
                      opacity: 0,
                      x: isCurrentUser ? 50 : -50,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    onContextMenu={(e) => {
                      e?.preventDefault();
                      handleRightClick(e, log);
                    }}
                  >
                    <div className="flex items-center w-full gap-2">
                      <hr className="h-[1px] bg-gray-800 w-full" />
                      <div
                        className="max-w-[60%] p-3 w-full text-nowrap rounded-lg text-sm italic text-gray-600"
                        dangerouslySetInnerHTML={{
                          __html: log?.content,
                        }}
                      />
                      <hr className="h-[1px] bg-gray-800 w-full" />
                    </div>
                  </motion.div>
                ) : log?.type === "MESSAGE" ? (
                  log?.msgType === "TEXT" ? (
                    <motion.div
                      onContextMenu={(e) => {
                        e?.preventDefault();
                        handleRightClick(e, log);
                      }}
                      className={`flex w-full ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                      initial={{
                        opacity: 0,
                        x: isCurrentUser ? 50 : -50,
                      }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div
                        className={`flex w-full gap-2 ${
                          isCurrentUser ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {isFromSameUser ? (
                          <div className="invisible size-8"></div>
                        ) : (
                          <CustomImage
                            src={log?.image?.path}
                            alt={log?.image?.path}
                            className="size-8 rounded-full cursor-pointer"
                          />
                        )}

                        <div className="flex flex-col max-w-[60%]">
                          {isFromSameUser ? (
                            <span className="invisible h-0 text-[10px]"></span>
                          ) : (
                            <span
                              className={`${
                                isCurrentUser ? "text-end" : "text-start"
                              } text-[10px]`}
                            >
                              {log?.from?.name}
                              {`, ${formatDate(log?.createdAt, "time-12")}`}
                            </span>
                          )}
                          <div
                            className={`relative break-words p-3 rounded-lg ${
                              isCurrentUser
                                ? "bg-mainColor text-white"
                                : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            {log?.repliedTo && (
                              <div className="flex flex-col bg-gray-50 border-l-4 border-blue-500 pl-4 pr-2 py-2 rounded-lg shadow-sm mb-3">
                                <div className="flex items-center gap-2 text-blue-500 mb-2">
                                  <HiReply className="text-xl" />
                                  <span className="text-sm font-semibold text-gray-800">
                                    {log?.repliedTo?.from?.name || "Unknown"}
                                  </span>
                                </div>
                                <div
                                  className="text-sm text-gray-800 leading-relaxed"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      log?.repliedTo?.msgType === "FILE"
                                        ? " 📝 File"
                                        : log?.repliedTo?.content ||
                                          "No content",
                                  }}
                                />
                              </div>
                            )}
                            <div
                              dangerouslySetInnerHTML={{
                                __html: log?.content,
                              }}
                            />
                            {showModal && selectedMessage?.id === log?.id && (
                              <MessageDetailsModalForGroup
                                onClick={handleClickMsgDetails}
                                onClose={() => {
                                  setShowModal(false);
                                  setSelectedMessage(null);
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    log?.msgType === "FILE" && (
                      <motion.div
                        key={log.id}
                        className={`flex w-full relative ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        }`}
                        initial={{
                          opacity: 0,
                          x: isCurrentUser ? 50 : -50,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div
                          onContextMenu={(e) => {
                            e?.preventDefault();
                            handleRightClick(e, log);
                          }}
                        >
                          {isFromSameUser ? (
                            <span className="invisible h-0 text-[10px]"></span>
                          ) : (
                            <span
                              className={`${
                                isCurrentUser ? "text-end" : "text-start"
                              } text-[10px]`}
                            >
                              {log?.from?.name}
                              {`, ${formatDate(log?.createdAt, "time-12")}`}
                            </span>
                          )}

                          <CustomImage
                            src={log?.file?.path}
                            alt={log?.file?.path}
                            className="h-auto w-auto max-w-[200px] object-contain rounded-md max-h-[200px]"
                          />
                          {showModal && selectedMessage?.id === log?.id && (
                            <MessageDetailsModalForGroup
                              onClick={handleClickMsgDetails}
                              onClose={() => {
                                setShowModal(false);
                                setSelectedMessage(null);
                              }}
                            />
                          )}
                        </div>
                      </motion.div>
                    )
                  )
                ) : (
                  ""
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500">No logs available.</div>
        )}
      </motion.div>

      <motion.div
        className="border-t pt-4 relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="flex items-end  relative gap-3">
          {/* File Upload Icon */}
          {/* <div className="flex flex-col w-full"> */}

          <div className="flex flex-col justify-center w-full pr-3 py-1 pl-5 bg-blue-lightBlue shadow rounded-lg relative gap-3">
            {repliedMsg?.isOpen === true && (
              <div className="w-full    bottom-20 px-2 border-b border-gray-600 flex gap-1 flex-wrap  py-2 mb-3">
                <div className="h-full relative  w-full break-words flex flex-col gap-4 text-wrap bg-gray-300 p-4 rounded-xl">
                  <HiReply />
                  <div className="h-full  w-full break-words  text-wrap">
                    {repliedMsg?.data?.content}
                  </div>
                  <div className="flex bgimage items-center text-sm gap-2">
                    <span>{repliedMsg?.data?.from?.name},</span>
                    <span>
                      {formatDate(repliedMsg?.data?.createdAt, "proper")}
                    </span>
                  </div>

                  <RxCross2
                    className="size-5 hover:text-[#3a3836] absolute top-2 right-5 cursor-pointer"
                    onClick={() => {
                      setRepliedMessage({
                        isOpen: false,
                        data: null,
                      });
                    }}
                  />
                </div>
              </div>
            )}
            {files?.length > 0 && (
              <div className="w-full  bottom-20 px-2 border-b border-gray-600 flex gap-1 flex-wrap overflow-x-auto py-2 mb-3">
                {files?.map((file, idx) => {
                  const extension = findExtension(file?.url);
                  const fileIcons = {
                    jpg: file?.url,
                    png: file?.url,
                    gif: file?.url,
                    pdf: FileType.Pdf,
                    zip: FileType.Zip,
                    html: FileType.Html,
                    default: FileType.File,
                  };
                  // console.log("extension", extension);
                  // console.log("fileIcons[extension] ", fileIcons[extension]);

                  return (
                    <div
                      className="size-32 overflow-hidden rounded-md relative bg-zinc-400"
                      key={file.id || idx}
                    >
                      <img
                        src={
                          fileIcons[extension] || file?.url || fileIcons.default
                        }
                        alt={`Uploaded file ${file.id}`}
                        className="size-full  text-xs object-center"
                      />
                      <span
                        onClick={() => removeFiles(idx)}
                        className="absolute  right-1 top-1 cursor-pointer hover:scale-110"
                      >
                        <RxCrossCircled className="text-[#E2E2B6]" />
                      </span>
                    </div>
                  );
                })}

                <div className="justify-center flex items-center cursor-pointer bg-[#858686] rounded-md text-gray-200 px-4 h-[8rem] w-[4rem] ">
                  <input
                    hidden
                    type="file"
                    id="fileUpload"
                    multiple
                    onChange={FileHandler}
                  />
                  <label
                    htmlFor="fileUpload"
                    className="cursor-pointer text-white"
                  >
                    <HiOutlinePlus size={20} />
                  </label>
                </div>
              </div>
            )}
            <div className="flex items-center">
              <input
                hidden
                type="file"
                id="fileUpload"
                multiple
                onChange={FileHandler}
                className="border-2"
              />
              <label htmlFor="fileUpload">
                <img
                  src={fileUplaodIcon}
                  alt="File Upload"
                  className="h-5 w-5 cursor-pointer"
                />
              </label>

              {/* Text Input */}
              <motion.input
                onKeyPress={handleKeyPress}
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-blue-lightBlue focus:outline-none "
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />

              <div className="flex gap-3 relative ">
                {/* Emoji Picker Toggle */}
                <button
                  onClick={() => setShowPicker((prevState) => !prevState)}
                  className="relative"
                  aria-label="Toggle Emoji Picker"
                >
                  <img
                    src={emojiIcon}
                    alt="Emoji"
                    className="h-5 w-5 cursor-pointer"
                  />
                  {showPicker && (
                    <div className="absolute -top-[500px] right-0 z-10">
                      <CustomEmojiPicker
                        onEmojiClick={handleEmojiClick}
                        setShowPicker={setShowPicker}
                      />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
          {/* </div> */}

          {/* Conditional Button: Send or Recorder Icon */}
          <motion.button
            className={`${
              inputText
                ? " h-full text-white"
                : "  bg-mainColor/90 text-gray-600"
            } px-4 py-2 rounded-lg`}
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 0.95 }}
            // disabled={!inputText}
            onClick={handleSubmit}
          >
            {inputText || files?.length > 0 ? (
              <img
                src={sendIcon}
                alt="Recorder"
                className="h-6 w-6 text-white"
              />
            ) : (
              <img src={recorder} alt="Recorder" className="h-6 w-6" />
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GroupChatContent;
