import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addChat } from '../../store/chatSlice';
import { useDispatch } from 'react-redux';
import axios from "axios";
import { startSession } from "../../utils/api";

import { addSession } from '../../store/sessionSlice';

const SkinAssessment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ formData, setFormData ] = useState( {
    // Basic Skin Profile
    skinType: '',
    mainConcern: '',
    specificSkinIssues: [],

    // Lifestyle Factors
    workEnvironment: '',
    stressLevel: '',
    sleepQuality: '',
    exerciseFrequency: '',
    dietType: '',

    // Sun Protection (Unisex)
    sunscreenUsage: '',

    // Environmental Exposure
    sunExposure: '',
    climateType: '',

    // Skincare Habits
    currentRoutine: '',
    productUsageFrequency: '',
    skincareBudget: '',

    // Health & Wellness
    waterIntake: '',
    alcoholConsumption: '',
    smokingStatus: '',

    // Detailed Inputs
    additionalSkinConcerns: '',
    skinTextureDescription: ''
  } );

  const handleRadioChange = ( e ) => {
    const { name, value } = e.target;
    setFormData( prev => ( { ...prev, [ name ]: value } ) );
  };

  const handleCheckboxChange = ( e ) => {
    const { value, checked } = e.target;
    setFormData( prev => ( {
      ...prev,
      specificSkinIssues: checked
        ? [ ...prev.specificSkinIssues, value ]
        : prev.specificSkinIssues.filter( item => item !== value )
    } ) );
  };

  const handleInputChange = ( e ) => {
    const { name, value } = e.target;
    setFormData( prev => ( { ...prev, [ name ]: value } ) );
  };

  const submitAssessment = async ( e ) => {
    e.preventDefault();
    try {
      // Create session and get initial assistant message in one call
      const session = await startSession(formData);

      // Add session to redux store
      dispatch( addSession( session ) );

      // Navigate to chat
      navigate( `/chat/${session.id}`, {
        state: { sessionId: session.id }
      } );
    } catch ( error ) {
      console.error( "Error saving session:", error );
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-6xl  shadow-lg rounded-xl p-4 max-h-[85vh] overflow-y-auto">
        <h1 className="text-lg font-bold text-[#5C6748] mb-4 text-center">Skin Assessment</h1>

        <form className="space-y-4 px-4 md:px-6" onSubmit={submitAssessment}>
          {/* Skin Type & Concerns Section */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[#5C6748] mb-2">Skin Profile</h2>

            {/* Skin Type */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-[#5C6748] mb-1">
                Skin Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[ 'Oily', 'Dry', 'Combination', 'Normal' ].map( type => (
                  <label
                    key={type}
                    className={`p-2 text-center border rounded-lg cursor-pointer ${formData.skinType === type
                      ? 'bg-[#A2AA7B] text-white'
                      : 'border-[#A2AA7B] text-[#5C6748]'
                      }`}
                  >
                    <input
                      type="radio"
                      name="skinType"
                      value={type}
                      checked={formData.skinType === type}
                      onChange={handleRadioChange}
                      className="hidden"
                    />
                    {type}
                  </label>
                ) )}
              </div>
            </div>

            {/* Main Concerns */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-[#5C6748] mb-1">
                Primary Skin Concern
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[ 'Aging', 'Acne', 'Uneven Tone', 'Sensitivity', 'Oiliness' ].map( concern => (
                  <label
                    key={concern}
                    className={`p-2 text-center border rounded-lg cursor-pointer ${formData.mainConcern === concern
                      ? 'bg-[#A2AA7B] text-white'
                      : 'border-[#A2AA7B] text-[#5C6748]'
                      }`}
                  >
                    <input
                      type="radio"
                      name="mainConcern"
                      value={concern}
                      checked={formData.mainConcern === concern}
                      onChange={handleRadioChange}
                      className="hidden"
                    />
                    {concern}
                  </label>
                ) )}
              </div>
            </div>

            {/* Specific Skin Issues */}
            <div>
              <label className="block text-sm font-medium text-[#5C6748] mb-1">
                Specific Skin Issues
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[ 'Blackheads', 'Whiteheads', 'Dark Circles', 'Fine Lines', 'Irritation' ].map( issue => (
                  <label
                    key={issue}
                    className={`p-2 flex items-center border rounded-lg cursor-pointer ${formData.specificSkinIssues.includes( issue )
                      ? 'bg-[#A2AA7B] text-white'
                      : 'border-[#A2AA7B] text-[#5C6748]'
                      }`}
                  >
                    <input
                      type="checkbox"
                      value={issue}
                      checked={formData.specificSkinIssues.includes( issue )}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    {issue}
                  </label>
                ) )}
              </div>
            </div>
          </div>

          {/* Sun Protection Section (Unisex) */}
          <div className="mb-4">
            <div className="mb-3">
              <label className="block text-sm font-medium text-[#5C6748] mb-1">
                How often do you use sunscreen?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[ 'Daily', 'Most Days', 'Occasionally', 'Rarely/Never' ].map( usage => (
                  <label
                    key={usage}
                    className={`p-2 text-center border rounded-lg cursor-pointer ${formData.sunscreenUsage === usage
                      ? 'bg-[#A2AA7B] text-white'
                      : 'border-[#A2AA7B] text-[#5C6748]'
                      }`}
                  >
                    <input
                      type="radio"
                      name="sunscreenUsage"
                      value={usage}
                      checked={formData.sunscreenUsage === usage}
                      onChange={handleRadioChange}
                      className="hidden"
                    />
                    {usage}
                  </label>
                ) )}
              </div>
            </div>
          </div>

          {/* Work Environment Section */}
          <div className="mb-4">
            <div className="mb-3">
              <label className="block text-sm font-medium text-[#5C6748] mb-1">
                Work Environment
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[ 'Indoor', 'Outdoor', 'Mixed' ].map( env => (
                  <label
                    key={env}
                    className={`p-2 text-center border rounded-lg cursor-pointer ${formData.workEnvironment === env
                      ? 'bg-[#A2AA7B] text-white'
                      : 'border-[#A2AA7B] text-[#5C6748]'
                      }`}
                  >
                    <input
                      type="radio"
                      name="workEnvironment"
                      value={env}
                      checked={formData.workEnvironment === env}
                      onChange={handleRadioChange}
                      className="hidden"
                    />
                    {env}
                  </label>
                ) )}
              </div>
            </div>
          </div>

          {/* Open-Ended Additional Information */}
          <div className="mb-4">
            <label htmlFor="additionalSkinConcerns" className="block text-sm font-medium text-[#5C6748] mb-1">
              Additional Skin Concerns or Notes
            </label>
            <textarea
              id="additionalSkinConcerns"
              name="additionalSkinConcerns"
              rows={2}
              value={formData.additionalSkinConcerns}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-[#A2AA7B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2AA7B]"
              placeholder="Share any additional skin concerns or specific requirements..."
            />
          </div>

        <div className='mb-4'>
          <button
            type="submit"
            className="w-full bg-[#A2AA7B] text-white py-2 rounded-lg hover:bg-[#8C9669] transition-colors mb-4"
          >
            Derma Glow's Solution
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkinAssessment;