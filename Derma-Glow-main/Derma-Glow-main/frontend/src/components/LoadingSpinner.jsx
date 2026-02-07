import React from 'react';
import { Droplet } from 'lucide-react';

const SkinSmartLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-white to-[#F5F7F0] bg-opacity-90 flex items-center justify-center z-50">
      <div className="p-8 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm flex flex-col items-center">
        <Droplet size={36} className="text-[#A2AA7B] mb-4" />
        
        <div className="flex space-x-3 mb-2">
          <div className="w-3 h-3 bg-[#A2AA7B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-[#A2AA7B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-[#A2AA7B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <p className="text-lg font-medium text-[#5C6748]">Loading</p>
        <p className="text-xs text-[#5C6748]/60 mt-1">Preparing your skincare insights</p>
      </div>
    </div>
  );
};

export default SkinSmartLoader;