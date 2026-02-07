import React, { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import axios from 'axios';
import { failureToaster, successToaster } from '../../utils/swal';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    fullName: '',
    age: '',
    location: '',
  });

  const [loading, setIsLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };


   const updateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.put('http://localhost:8000/api/user/update-profile', profileData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (response.data.data) {
        // Update localStorage with new data
        const updatedUserInfo = { ...JSON.parse(localStorage.getItem("userInfo")), ...profileData };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        
        // Update state
        setProfileData({
          fullName: profileData.fullName,
          email: profileData.email,
          phone: profileData.phone,
          skinTone: profileData.skinTone
        });
        
        // Show success message
        successToaster('Profile updated successfully');
        }
    } catch (error) {
      console.error('Error updating profile:', error);
      failureToaster(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
    };

    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem("userInfo"));        
      setProfileData({
          fullName: userData?.fullName || '',
          email: userData?.email || '',  
          age: userData?.age || '',
          location: userData?.location || '',
        });
      }
    , []);


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="px-6 py-6 bg-white border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#5C6748]">
            Profile Information
          </h2>
          <p className="mt-1 text-sm text-[#8C9669]">
            Update your personal information
          </p>
        </div>

        {/* Form Section */}
        <div className="px-6 py-6">
          <form onSubmit={updateProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#5C6748] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#A2AA7B] focus:ring-2 focus:ring-[#A2AA7B] focus:border-[#A2AA7B] 
                             bg-white transition-colors hover:bg-gray-50 outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5C6748] mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={profileData.age}
                    min={10}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#A2AA7B] focus:ring-2 focus:ring-[#A2AA7B] focus:border-[#A2AA7B] 
                             bg-white transition-colors hover:bg-gray-50 outline-none"
                    placeholder="Enter your age"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#5C6748] mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#A2AA7B] focus:ring-2 focus:ring-[#A2AA7B] focus:border-[#A2AA7B] 
                             bg-white transition-colors hover:bg-gray-50 outline-none"
                    placeholder="Enter your location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5C6748] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-[#A2AA7B]" />
                    </div>
                    <input
                    
                      readOnly
                      name="email"
                      value={profileData.email}
                    
                      className="w-full  pl-10 pr-4 py-3 rounded-lg border
                               bg-white transition-colors hover:bg-gray-50 outline-none"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Button Section - Full Width */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center items-center px-6 py-3 rounded-lg text-sm font-medium text-white
                         bg-[#A2AA7B] hover:bg-[#8C9669] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2AA7B] 
                         transition-colors shadow-sm"
              >
                {loading ? (
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                ) : (
                  'Update Profile'
                )}
                
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;