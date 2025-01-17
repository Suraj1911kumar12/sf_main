import { IoReturnUpForward } from "react-icons/io5";
import { MdContentCopy, MdDeleteOutline } from "react-icons/md";
import { VscReply } from "react-icons/vsc";
import { useEffect, useRef } from "react";

const MessageDetailsModal = ({ onClose, onClick, contextMenu }) => {
  const modalRef = useRef(null);

  const menuOptions = [
    {
      id: 1,
      title: "Forward",
      icon: <IoReturnUpForward className="text-lg mr-3 text-blue-500" />,
    },
    {
      id: 2,
      title: "Reply",
      icon: <VscReply className="text-lg mr-3 text-yellow-500" />,
    },
    {
      id: 3,
      title: "Copy",
      icon: <MdContentCopy className="text-lg mr-3 text-green-500" />,
    },
    {
      id: 4,
      title: "Remove",
      icon: <MdDeleteOutline className="text-lg mr-3 text-red-500" />,
    },
    // {
    //   id: 5,
    //   title: "Edit",
    //   icon: <MdEdit className="text-lg mr-3 text-purple-500" />,
    // },
    // {
    //   id: 6,
    //   title: "Download",
    //   icon: <FaSave className="text-lg mr-3 text-teal-500" />,
    // },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      className="absolute top-0 bg-white w-[150px] shadow-lg rounded-md z-[1000]"
    >
      <ul className="flex flex-col divide-y divide-gray-200">
        {menuOptions.map((option) => (
          <li
            key={option.id}
            className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onClick(option);
              onClose();
            }}
          >
            {option.icon}
            <span className="text-sm">{option.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageDetailsModal;
