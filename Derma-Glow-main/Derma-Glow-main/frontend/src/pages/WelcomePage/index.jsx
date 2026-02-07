import React from 'react';
import { Droplet } from 'lucide-react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#F5F7F0] ">
      <div className="w-full max-w-2xl mx-auto text-center">
        {/* Logo and Brand */}
        <div className="flex items-center justify-center mb-6">
          <Droplet size={36} className="text-[#A2AA7B] mr-2" />
          <h1 className="text-2xl md:text-3xl font-bold text-[#A2AA7B]">
            Derma Glow
          </h1>
        </div>

        {/* Welcome Message */}
        <div className="space-y-3 mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-[#5C6748]">
            Welcome to Your Personal Skin Care Assistant
          </h2>
          
          <p className="text-sm md:text-base text-[#5C6748]/80 max-w-2xl mx-auto leading-relaxed">
            Get personalized skincare advice, routines, and recommendations tailored 
            specifically to your skin type and concerns.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
            <h3 className="text-base font-semibold text-[#5C6748] mb-1">
              Personalized Analysis
            </h3>
            <p className="text-sm text-[#5C6748]/70">
              Detailed insights about your skin
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
            <h3 className="text-base font-semibold text-[#5C6748] mb-1">
              Smart Recommendations
            </h3>
            <p className="text-sm text-[#5C6748]/70">
              Tailored product suggestions
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
            <h3 className="text-base font-semibold text-[#5C6748] mb-1">
              Expert Guidance
            </h3>
            <p className="text-sm text-[#5C6748]/70">
              AI-powered expertise anytime
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <Link
            to="/assessment"
            className="inline-block px-6 py-3 text-base font-semibold text-white 
              bg-[#A2AA7B] hover:bg-[#8B936A] 
              rounded-xl shadow-lg hover:shadow-xl
              transform hover:-translate-y-0.5 
              transition-all duration-200 ease-in-out"
          >
            Start Conversation with Derma Glow →
          </Link>
          
          <Link
            to="/explore-clinics"
            className="inline-block px-6 py-3 text-base font-semibold text-[#5C6748]
              bg-white hover:bg-[#F5F7F0] border-2 border-[#A2AA7B]
              rounded-xl shadow-lg hover:shadow-xl
              transform hover:-translate-y-0.5 
              transition-all duration-200 ease-in-out"
          >
            Explore Clinics →
          </Link>
        </div>

        {/* Optional Subtle Footer Text */}
        <p className="text-xs text-[#5C6748]/60 mt-4">
          Your personal AI skincare companion, available 24/7
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;