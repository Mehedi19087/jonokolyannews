"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function LiveTrackerWidget() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="w-full my-4 bg-white border border-gray-300 rounded-md shadow-sm overflow-hidden">
      {/* Widget Header Banner */}
      <div className="bg-[#1e293b] text-white px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-red-500 font-bold text-sm sm:text-base">
          <span className="text-xl">★</span>
          <span>রিপাবলিকান পার্টি</span>
        </div>

        <div className="text-center font-bold text-white text-sm sm:text-lg flex items-center space-x-2">
          <span>যুক্তরাষ্ট্রের মধ্যবর্তী নির্বাচন ২০২৬</span>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-white ml-2 p-0.5 rounded"
            title={isCollapsed ? "প্রদর্শন করুন" : "সংকোচন করুন"}
          >
            {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>

        <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm sm:text-base">
          <span>ডেমোক্র্যাটিক পার্টি</span>
          <span className="text-xl">★</span>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-3 sm:p-4 bg-white space-y-4 text-sm">
          {/* House of Representatives */}
          <div className="border border-gray-200 rounded p-2.5 bg-gray-50/50">
            <div className="flex items-center justify-between mb-1.5 font-bold">
              <span className="text-2xl sm:text-3xl font-black text-red-600">
                ১৯৬
              </span>
              <div className="text-center">
                <div className="text-gray-800 text-xs sm:text-sm font-bold">
                  প্রতিনিধি পরিষদ (৪৩৫ আসনের সবগুলোতে ভোট)
                </div>
                <div className="text-[11px] text-gray-500 font-normal">
                  সংখ্যাগরিষ্ঠতার জন্য দরকার ২১৮ আসন
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-blue-600">
                ২২৫
              </span>
            </div>

            {/* Split Progress Bar */}
            <div className="relative h-3 w-full bg-gray-200 rounded overflow-hidden flex">
              <div
                className="bg-red-600 h-full transition-all duration-500"
                style={{ width: "45%" }}
              ></div>
              <div
                className="bg-gray-200 h-full border-x border-gray-400"
                style={{ width: "3%" }}
              ></div>
              <div
                className="bg-blue-600 h-full transition-all duration-500"
                style={{ width: "52%" }}
              ></div>
            </div>
          </div>

          {/* Senate */}
          <div className="border border-gray-200 rounded p-2.5 bg-gray-50/50">
            <div className="flex items-center justify-between mb-1.5 font-bold">
              <span className="text-2xl sm:text-3xl font-black text-red-600">
                ৪৩
              </span>
              <div className="text-center">
                <div className="text-gray-800 text-xs sm:text-sm font-bold">
                  সিনেট (১০০ আসনের মধ্যে ৩৫টিতে ভোট)
                </div>
                <div className="text-[11px] text-gray-500 font-normal">
                  সংখ্যাগরিষ্ঠতার জন্য দরকার ৫১ আসন
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-blue-600">
                ৫৪
              </span>
            </div>

            {/* Split Progress Bar */}
            <div className="relative h-3 w-full bg-gray-200 rounded overflow-hidden flex">
              <div
                className="bg-red-600 h-full transition-all duration-500"
                style={{ width: "43%" }}
              ></div>
              <div
                className="bg-gray-200 h-full border-x border-gray-400"
                style={{ width: "3%" }}
              ></div>
              <div
                className="bg-blue-600 h-full transition-all duration-500"
                style={{ width: "54%" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
