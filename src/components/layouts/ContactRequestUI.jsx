import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const ContactRequestUI = ({ personalChat, onSendRequest, status }) => {
  const [loading, setLoading] = useState(false);
  const [innerStatus, setInnerStatus] = useState(status);

  const handleSendRequest = () => {
    if (onSendRequest) {
      setLoading(true);
      onSendRequest(personalChat?.uuid);

      setTimeout(() => {
        setLoading(false);
        setInnerStatus("PENDING");
      }, 2000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-8 rounded-2xl shadow-lg max-w-lg mx-auto flex flex-col items-center justify-center space-y-6">
      {/* Avatar Section */}
      <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center mb-6 border-4 border-blue-500 shadow-lg transform transition-all hover:scale-105">
        <span className="text-blue-600 text-3xl font-semibold uppercase">
          {personalChat?.name ? personalChat.name[0] : "U"}
        </span>
      </div>

      {/* Request Status */}
      {innerStatus === "PENDING" ? (
        <div className="text-center">
          <p className="text-lg font-semibold text-white">Request Pending</p>
          <p className="text-sm text-white/80 mt-2">
            Please wait for the request to be accepted.
          </p>
        </div>
      ) : innerStatus === "NOT" ? (
        <div className="text-center">
          <p className="text-lg font-semibold text-white mb-4">
            Send Chat Request
          </p>

          {/* Send Request Button */}
          <button
            onClick={handleSendRequest}
            disabled={loading}
            className="flex items-center justify-center mt-4 bg-white text-blue-600 py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-t-4 border-blue-600 rounded-full animate-spin"></div>
            ) : (
              <FaPaperPlane className="mr-2 text-xl" />
            )}
            {loading ? "Sending..." : "Send Request"}
          </button>
        </div>
      ) : (
        <p className="text-white text-center mt-4">No action required.</p>
      )}
    </div>
  );
};

export default ContactRequestUI;
