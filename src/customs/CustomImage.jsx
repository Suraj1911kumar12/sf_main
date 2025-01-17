import React, { useState } from "react";
import { motion } from "framer-motion";
import { GrClose } from "react-icons/gr";

const CustomImage = ({ src, alt, className }) => {
  const [openImage, setOpenImage] = useState(false);

  return (
    <>
      {openImage && (
        <motion.div
          className="fixed top-0 z-[10000] flex items-center  justify-center left-0 right-0 bottom-0 h-screen w-screen p-2 bg-black bg-opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div className="relative  max-w-[80%] max-h-[80%]">
            <motion.img
              src={src || "https://placehold.co/400"}
              alt={alt || "User"}
              className="rounded-xl border border-white bg-gray-800 p-8 object-contain w-full max-h-[600px] h-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpenImage(false)}
            />
            <button
              onClick={() => setOpenImage(false)}
              className="absolute -top-5 -right-5 p-3 rounded-full bg-white text-black hover:bg-gray-300 transition"
            >
              <GrClose size={20} />
            </button>
          </motion.div>
        </motion.div>
      )}

      <motion.img
        onClick={() => setOpenImage(!openImage)}
        src={src || "https://placehold.co/400"}
        alt={alt || "User"}
        className={
          className
            ? `${className}`
            : ` rounded-full h-14 w-14 object-cover cursor-pointer`
        }
        whileHover={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
};

export default CustomImage;
