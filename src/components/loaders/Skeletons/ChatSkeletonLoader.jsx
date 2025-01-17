import React from "react";

const ChatContentSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-white p-4 space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 border-b pb-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-300 animate-pulse rounded"></div>
          <div className="h-3 w-24 bg-gray-300 animate-pulse rounded"></div>
        </div>
      </div>

      {/* Chat Content Skeleton */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-start space-x-2">
          <div className="max-w-[60%] p-3 rounded-lg bg-gray-300 animate-pulse"></div>
        </div>
        <div className="flex justify-end space-x-2">
          <div className="max-w-[60%] p-3 rounded-lg bg-gray-300 animate-pulse"></div>
        </div>
      </div>

      {/* Input Section Skeleton */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-3">
          <div className="w-full h-10 bg-gray-300 animate-pulse rounded-lg"></div>
          <div className="w-20 h-10 bg-gray-300 animate-pulse rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatContentSkeleton;
