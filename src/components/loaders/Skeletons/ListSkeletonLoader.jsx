const ListSkeletonLoader = () => {
  const SkeletonLoader = () => (
    <div className="flex items-center p-2 rounded-md w-full gap-2">
      <div className="relative w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>

      <div className="flex flex-col justify-start flex-grow">
        <div className="flex items-center justify-between">
          <span className="h-4 bg-gray-200 rounded-md w-24 animate-pulse"></span>
          <span className="h-3 bg-gray-200 rounded-md w-16 animate-pulse"></span>
        </div>
        <span className="h-3 bg-gray-200 rounded-md w-32 animate-pulse mt-2"></span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonLoader key={index} />
      ))}
    </div>
  );
};

export default ListSkeletonLoader;
