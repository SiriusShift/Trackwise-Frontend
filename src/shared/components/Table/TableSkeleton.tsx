import React from "react";

const SkeletonTable = () => (
  <div className="animate-pulse space-y-4">
    <div className="border-b border-gray-200">
      {/* Table header skeleton */}
      <div className="flex space-x-4 p-4">
        <div className="w-32 h-4 bg-gray-300 rounded"></div>
        <div className="w-32 h-4 bg-gray-300 rounded"></div>
        <div className="w-32 h-4 bg-gray-300 rounded"></div>
        <div className="w-32 h-4 bg-gray-300 rounded"></div>
      </div>
    </div>

    {/* Table body skeleton */}
    {[...Array(5)].map((_, index) => (
      <div key={index} className="flex space-x-4 p-4">
        <div className="w-32 h-6 bg-gray-200 rounded"></div>
        <div className="w-32 h-6 bg-gray-200 rounded"></div>
        <div className="w-32 h-6 bg-gray-200 rounded"></div>
        <div className="w-32 h-6 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);

export default SkeletonTable;
