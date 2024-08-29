import React from "react";

const GameBoard = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-[#563034] mb-5">Ludo Board</h1>
      <div className="grid grid-cols-[3fr_1.5fr_3fr] grid-rows-[3fr_1.5fr_3fr] w-[600px] h-[600px] border-4 border-black gap-0">
        {/* Green Base - Top Left */}
        <div className="flex items-center justify-center border-2 border-black bg-green-600">
          {/* Green Base */}
        </div>

        {/* Empty Space - Top Middle */}
        <div className="grid grid-cols-3 grid-rows-6 border-2 border-black gap-0">
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
        </div>

        {/* Yellow Base - Top Right */}
        <div className="flex items-center justify-center border-2 border-black bg-yellow-400">
          {/* Yellow Base */}
        </div>

        {/* Empty Space - Middle Left */}
        <div className="grid grid-cols-6 grid-rows-3 border-2 border-black gap-0">
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
        </div>

        {/* Center Area */}
        <div className="flex items-center justify-center border-2 border-black bg-purple-500 text-lg font-bold">
          Center Area
        </div>

        {/* Empty Space - Middle Right */}
        <div className="grid grid-cols-6 grid-rows-3 border-2 border-black gap-0">
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
        </div>

        {/* Red Base - Bottom Left */}
        <div className="flex items-center justify-center border-2 border-black bg-red-600">
          {/* Red Base */}
        </div>

        {/* Empty Space - Bottom Middle */}
        <div className="grid grid-cols-3 grid-rows-6 border-2 border-black gap-0">
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
          <div className="border border-black"></div>
        </div>

        {/* Blue Base - Bottom Right */}
        <div className="flex items-center justify-center border-2 border-black bg-blue-500">
          {/* Blue Base */}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
