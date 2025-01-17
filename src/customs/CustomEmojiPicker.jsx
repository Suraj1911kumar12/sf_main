import React from "react";
import EmojiPicker from "emoji-picker-react";

const CustomEmojiPicker = ({ onEmojiClick, setShowPicker }) => {
  const handleEmojiClick = (emojiObject) => {
    console.log(emojiObject, "emojiobject");
    onEmojiClick(emojiObject);
  };

  return (
    <div className="bg-white p-3 rounded-md w-full shadow-lg border border-gray-200">
      <EmojiPicker onEmojiClick={handleEmojiClick} />
    </div>
  );
};

export default CustomEmojiPicker;
