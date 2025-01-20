import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getRequest } from "../../../utils/apicall";
import CustomImage from "../../../customs/CustomImage";

const GroupDetails = ({ data, onClose }) => {
  const [groupDetails, setGroupDetails] = useState(null);

  useEffect(() => {
    if (data) {
      fetchGroupDetails();
    }
  }, [data]);

  const fetchGroupDetails = async () => {
    try {
      const response = await getRequest(`/emp/group/${data?.uuid}`);
      if (response?.status) {
        setGroupDetails(response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching group details:", error);
    }
  };

  if (!data) return null;

  return (
    <div className="absolute inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 70 }}
        className="absolute top-0 right-0 h-full w-full  bg-[#f0f0f0] shadow-lg overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#075E54] text-white flex justify-between items-center px-4 py-3 shadow-md z-10">
          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="text-white text-lg">
              ←
            </button>
            <h2 className="text-lg font-medium">
              {groupDetails?.name || "Group Details"}
            </h2>
          </div>
        </div>

        {/* Group Info */}
        <div className="px-4 py-4">
          <h3 className="text-base font-semibold text-gray-800">Description</h3>
          <p className="text-sm text-gray-600 mt-2">
            {groupDetails?.description || "No description available."}
          </p>
          <div className="mt-3">
            <span
              className={`px-3 py-1 text-xs rounded-lg font-medium ${
                groupDetails?.isActive
                  ? "bg-[#DCF8C6] text-[#075E54]"
                  : "bg-[#FFE6E6] text-[#FF3B3B]"
              }`}
            >
              {groupDetails?.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Members */}
        <div className="px-4 py-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            Members
          </h3>
          {groupDetails?.member?.length > 0 ? (
            <ul className="space-y-3">
              {groupDetails.member.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center p-3 bg-white shadow rounded-lg"
                >
                  <CustomImage
                    src={`${member?.user?.image?.path}`}
                    alt={member.user.name}
                    className="w-10 h-10 rounded-full object-cover mr-3 border"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {member.user.name}
                    </span>
                    <span className="text-xs text-gray-600">
                      {member.user.email}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      Added by: {member.addedBy.name} (
                      {new Date(member.addedAt).toLocaleDateString()})
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No members in this group.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default GroupDetails;
