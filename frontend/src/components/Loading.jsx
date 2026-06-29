import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/10 backdrop-blur-sm">
      <div className="relative flex items-center justify-center w-32 h-32">
        <span className="text-xl font-semibold tracking-wide text-slate-800">
          H₂Otronics
        </span>
        <span className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
      </div>
    </div>
  );
};

export default Loading;
