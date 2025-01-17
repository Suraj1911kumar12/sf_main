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
import {
  copyToClipboard,
  FileType,
  findExtension,
} from "../../../utils/defaults";
import { RxCross2, RxCrossCircled } from "react-icons/rx";
import { HiOutlinePlus, HiReply } from "react-icons/hi";
import { useSelector } from "react-redux";
import ContactRequestUI from "../../layouts/ContactRequestUI";
import usePathSegment from "../../../context/useSegment";
import { formatDate, getDateLabel } from "../../../utils/formatter";
import { MdKeyboardArrowDown } from "react-icons/md";
import MsgDetails from "../MsgDetails";
import MessageDetailsModal from "../MsgDetails";
import { FaAngleDown } from "react-icons/fa";

const ChatContent = () => {
  const scrollableDiv = useRef(null);
  const containerRef = useRef();
  const lastSegment = usePathSegment();
  const userInfo = useSelector((state) => state?.userInfo);
  const { personalChat, setIsContactListUpdated, setPersonalListUpdated } =
    useContext(UserContext);
  const [personalLogs, setPersonalLogs] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [contextMenuSize, setContextMenuSize] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [repliedMsg, setRepliedMessage] = useState({
    data: null,
    isOpen: false,
  });
  const [isEdited, setIsEdited] = useState({
    isOpen: false,
    data: null,
  });

  // console.log("lastSegment", lastSegment);
  // console.log("personalChat", personalChat);

  const getPersonalLog = async () => {
    const api = apis.empUrl + "/user/log/details";
    const payload = {
      connectionId:
        lastSegment === "chat"
          ? personalChat?.id
          : lastSegment === "contacts"
          ? personalChat?.connectionId
          : null,
      count: 10000,
      lastSegment: 1,
      search: "",
      markSeen: true,
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
    console.log("socketMsgReceiveSelf", MsgDet);
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

    if (userInfo?.data?.uuid === MsgDet?.from?.uuid) {
      setPersonalLogs((prev) => [...prev, receiveSelfMsg]);
    }
  };

  // console.log("personalChat", personalChat);

  const socketMsgReceive = (data) => {
    const MsgDet = data?.log?.data;
    console.log("socketMsgReceive", MsgDet);
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
    // console.log("====================================");
    // console.log(personalChat);
    // console.log("========223222222222222=====================");
    // console.log(
    //   "personalChat?.userUUID === MsgDet?.from?.uuid",
    //   personalChat?.userUUID === MsgDet?.from?.uuid,
    //   personalChat?.userUUID,
    //   MsgDet?.from?.uuid
    // );

    if (personalChat?.userUUID === MsgDet?.from?.uuid) {
      setPersonalLogs((prev) => [...prev, newReceiveMsg]);
    }

    const notification = {
      userUUID: personalChat?.uuid,
      msgId: MsgDet?.id,
    };

    socket.emit("current-personal-chat-with-log", notification);
  };

  useEffect(() => {
    socket.on("self-message-in-personal", socketMsgReceiveSelf);
    socket.on("receive-message-in-personal", socketMsgReceive);

    socket.on("personal-list-updated", (data) => {
      setPersonalListUpdated(new Date());
    });
    return () => {
      socket.off("self-message-in-personal");
      socket.off("receive-message-in-personal");
      socket.off("personal-list-updated");
    };
  }, []);

  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emojiObject) => {
    console.log("emojiObject", emojiObject);
    setInputText((prev) => {
      return prev + emojiObject?.emoji;
    });
    setShowPicker(false);
  };

  useEffect(() => {
    if (personalChat) getPersonalLog();
  }, [personalChat]);

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

  if (!personalChat) {
    return (
      <div className="h-full flex items-center justify-center  text-gray-500">
        No chat selected.
      </div>
    );
  }

  const currentUserUUID = userInfo?.data?.uuid;
  const chatPartner = personalChat;

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
  // console.log("personalChat", personalChat);
  // console.log("selectedMessage?.data?.id", repliedMsg?.data);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const dataToSend = {
          toUUID: personalChat?.userUUID || personalChat?.uuid,
          msgType: "FILE",
          personalRepliedMsgId: null,
          content: inputText || "",
          file: files[i]?.id,
        };
        console.log("dataToSend", dataToSend);
        socket.emit("send-message-to-personal", dataToSend);
      }
      setFiles([]);
    } else {
      const payload = {
        toUUID: personalChat?.userUUID || personalChat?.uuid,
        msgType: "TEXT",
        content: inputText.trim(),
        repliedMsgId: repliedMsg?.data?.id || "",
      };
      socket.emit("send-message-to-personal", payload);
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
  const handleSendRequest = (uuid) => {
    console.log("uuid here", uuid);
    socket.emit("send-connection-req", { toUUID: uuid });
    const currentTime = new Date().getTime();
    setIsContactListUpdated(currentTime);
  };

  let dayChecks = [];
  const handleRightClick = (e, data) => {
    console.log(data);
    setShowModal(true);
    setSelectedMessage(data);
    setContextMenuSize({
      top: e.clientY,
      left: e.clientX,
    });
  };

  const handleClickMsgDetails = (data) => {
    console.log("handleClickMsgDetails", data);
    if (data?.id === 2) {
      setRepliedMessage({
        data: selectedMessage,
        isOpen: true,
      });
    }
    if (data?.id === 3) {
      copyToClipboard(selectedMessage?.content);
    }
    if (data?.id === 4) {
      const payload = {
        toUUID: selectedMessage?.to?.uuid,
        msgId: selectedMessage?.id,
      };
      socket.emit("delete-personal-log", payload);
      setPersonalLogs(
        personalLogs?.filter((log) => log?.id !== selectedMessage?.id)
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full bg-white p-6 rounded-lg shadow-lg shadow-blue-100  "
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex items-center justify-between border-b mb-4"
      >
        <motion.div className="flex items-center gap-4 pb-4">
          <CustomImage
            src={
              lastSegment === "contacts"
                ? chatPartner?.image?.path
                : chatPartner?.finalPath
            }
            alt={chatPartner?.name}
            className="w-12 h-12 rounded-full object-cover"
          />

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {lastSegment === "contacts"
                ? chatPartner?.name
                : chatPartner?.userName}
            </h2>
            <div className="text-sm flex items-center gap-2 text-gray-500">
              <span
                className={`h-2 w-2 rounded-full ${
                  chatPartner?.status === "ACTIVE"
                    ? "bg-green-500"
                    : "bg-yellow-700"
                }  `}
              />
              {chatPartner?.status}
            </div>
          </div>
        </motion.div>
        <motion.div className="flex gap-4 items-center ">
          <img src={callIocn} alt="Call" className=" h-5" />
          <img src={videocallIcon} alt="Video Call" className="h-5" />
          <img src={threeDot} alt="More Options" className=" h-5" />
        </motion.div>
      </motion.div>

      {lastSegment === "contacts" &&
      personalChat?.connectionStatus === "PENDING" ? (
        <ContactRequestUI status="PENDING" personalChat={personalChat} />
      ) : (lastSegment === "contacts" &&
          personalChat?.connectionStatus === "REJECTED") ||
        (personalChat?.connectionStatus === null &&
          personalChat?.connectionId === null) ? (
        <ContactRequestUI
          status="NOT"
          personalChat={personalChat}
          onSendRequest={handleSendRequest}
        />
      ) : (
        <motion.div
          className="flex-1 overflow-y-auto bg_chat_Image overflow-x-hidden relative p-4 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          ref={scrollableDiv}
        >
          {isLoading ? (
            <ChatContentSkeleton />
          ) : personalLogs.length > 0 ? (
            personalLogs.map((log) => {
              let lastDate = null;
              const isCurrentUser = log?.from?.uuid === currentUserUUID;
              const msgDateLabel = getDateLabel(log?.createdAt);

              if (!dayChecks.includes(msgDateLabel)) {
                lastDate = msgDateLabel;
              }
              dayChecks.push(msgDateLabel);

              return (
                <div className="">
                  {lastDate && (
                    <div className="flex items-center gap-4 justify-center">
                      <hr className="h-[1px] w-full bg-gray-100" />
                      {lastDate}
                      <hr className="h-[1px] w-full bg-gray-100" />
                    </div>
                  )}
                  <div key={log.id}>
                    {log?.type === "ACTION" ? (
                      <motion.div
                        className={`flex w-full `}
                        initial={{
                          opacity: 0,
                          x: isCurrentUser ? 50 : -50,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {log?.type === "ACTION" ? (
                          <div className=" flex items-center w-full gap-2">
                            <hr className="h-[1px] bg-gray-800 w-full" />
                            <div
                              className={`max-w-[60%] p-3 w-full text-nowrap rounded-lg
                            text-sm italic  text-gray-600
                            }`}
                              dangerouslySetInnerHTML={{
                                __html: log?.content,
                              }}
                            />
                            <hr className="h-[1px] bg-gray-800 w-full" />
                          </div>
                        ) : (
                          ""
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key={log.id}
                        className={`flex  `}
                        initial={{
                          opacity: 0,
                          x: isCurrentUser ? 50 : -50,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {log?.type === "ACTION" ? (
                          <div className=" flex items-center w-full gap-2">
                            <hr className="h-[1px] bg-gray-800 w-full" />
                            <div
                              className={`max-w-[60%] p-3 w-full text-wrap rounded-lg
                            text-sm italic  text-gray-600
                            }`}
                              dangerouslySetInnerHTML={{
                                __html: log?.content,
                              }}
                            />
                            <hr className="h-[1px] bg-gray-800 w-full" />
                          </div>
                        ) : log?.type === "MESSAGE" ? (
                          log?.msgType === "TEXT" ? (
                            <motion.div
                              key={log.id}
                              className={`flex w-full relative  ${
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
                                ref={containerRef}
                                onContextMenu={(e) => {
                                  e.preventDefault();
                                  handleRightClick(e, log);
                                }}
                                className={`max-w-[60%] px-4 py-2 text-base rounded-lg break-words shadow-md ${
                                  isCurrentUser
                                    ? "bg-mainColor text-white self-end"
                                    : "bg-gray-200 text-gray-800 self-start"
                                }`}
                              >
                                {log?.repliedTo ? (
                                  <div className="flex flex-col bg-gray-50 border-l-4 border-blue-500 pl-4 pr-2 py-2 rounded-lg shadow-sm mb-3">
                                    {/* Reply Header */}
                                    <div className="flex items-center gap-2 text-blue-500 mb-2">
                                      <HiReply className="text-xl" />
                                      <span className="text-sm font-semibold text-gray-800">
                                        {log?.repliedTo?.from?.name ||
                                          "Unknown"}
                                      </span>
                                    </div>

                                    {/* Content and Timestamp */}
                                    <div className="flex justify-between items-center">
                                      {/* Content */}
                                      <div
                                        className="text-sm text-gray-800 leading-relaxed"
                                        dangerouslySetInnerHTML={{
                                          __html:
                                            log?.repliedTo?.content ||
                                            "No content",
                                        }}
                                      />
                                      {/* Timestamp */}
                                      <span className="text-xs text-gray-500 italic whitespace-nowrap ml-4">
                                        {formatDate(
                                          log?.repliedTo?.createdAt,
                                          "proper"
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                ) : null}

                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: log?.content || "",
                                  }}
                                />
                              </div>

                              {showModal && selectedMessage?.id === log?.id && (
                                <MsgDetails
                                  contextMenu={contextMenuSize}
                                  onClick={handleClickMsgDetails}
                                  onClose={() => {
                                    setShowModal(false);
                                    setSelectedMessage(null);
                                    setContextMenuSize(null);
                                  }}
                                />
                              )}
                            </motion.div>
                          ) : (
                            log?.msgType === "FILE" && (
                              <motion.div
                                key={log.id}
                                className={`flex w-full ${
                                  isCurrentUser
                                    ? "justify-end"
                                    : "justify-start"
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
                                    handleRightClick(e, log);
                                  }}
                                >
                                  <CustomImage
                                    src={log?.file?.path}
                                    alt={log?.file?.path}
                                    className="h-auto w-auto max-w-[200px] object-contain rounded-md max-h-[200px]"
                                  />
                                  {showModal &&
                                    selectedMessage?.id === log?.id && (
                                      <MsgDetails
                                        contextMenu={contextMenuSize}
                                        onClick={handleClickMsgDetails}
                                        onClose={() => {
                                          setShowModal(false);
                                          setSelectedMessage(null);
                                          setContextMenuSize(null);
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
                      </motion.div>
                    )}
                    {/* <MessageDetailsModal
                      isOpen={showModal}
                      message={selectedMessage}
                      onClose={() => setShowModal(false)}
                    /> */}
                  </div>
                  {/* <div
                    className={`absolute  ${
                      isCurrentUser ? "top-0 right-1" : " top-0 left-1"
                    }`}
                  >
                    <MdKeyboardArrowDown size={20} />
                  </div> */}
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500">No logs available.</div>
          )}
        </motion.div>
      )}

      {/* Input Section */}

      {lastSegment === "contacts" &&
      personalChat?.connectionStatus !== "ACTIVE" ? (
        ""
      ) : (
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
                            fileIcons[extension] ||
                            file?.url ||
                            fileIcons.default
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
                <motion.textarea
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 break-words text-wrap overflow-y-auto max-h-[100px] bg-blue-lightBlue focus:outline-none resize-none"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={1}
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

                  {/* Emoji Picker */}

                  {/* Image Upload Icon */}
                  {/* <img
                    src={uploadImageIcon}
                    alt="Upload Image"
                    className="h-5 w-5 cursor-pointer"
                  /> */}
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
      )}
    </motion.div>
  );
};

export default ChatContent;
