import React, { useState } from 'react';
import { CheckCircle, Clock, Mail } from 'lucide-react';
import { failureToaster, successToaster } from '../../utils/swal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Forgot Password Component
export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format. e.g example@example.com");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`http://localhost:8000/api/auth/send/verify-link/${email}`);
      successToaster("Verification link sent successfully.");
      setSent(true);
      setResendTimer(30); // Start 30-second cooldown for resend

      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev === 1) clearInterval(interval);
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      failureToaster(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 bg-white border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#5C6748]">
            Forgot Password?
          </h2>
          <p className="mt-1 text-sm text-[#8C9669]">
            Enter your email to receive a password reset link
          </p>
        </div>

        <div className="px-6 py-6">
          {sent ? (
           <div className="bg-white border border-[#A2AA7B]/20 rounded-xl p-6 shadow-sm">
           <div className="flex items-center justify-center mb-4">
             <div className="bg-[#A2AA7B]/10 p-3 rounded-full">
               <CheckCircle className="h-8 w-8 text-[#A2AA7B]" />
             </div>
           </div>
           
           <h3 className="text-lg font-semibold text-[#5C6748] text-center mb-2">
             Reset Link Sent
           </h3>
           
           <div className="space-y-3">
             <div className="bg-[#F5F7F0] rounded-lg p-4 flex items-center">
               <Mail className="h-5 w-5 text-[#A2AA7B] mr-3 flex-shrink-0" />
               <p className="text-sm text-[#5C6748]">
                 A password reset link has been sent to <span className="font-semibold">{email}</span>
               </p>
             </div>
             
             <div className="space-y-2 text-sm">
               <p className="text-[#5C6748]">
                 Please check your inbox and follow the instructions in the email.
               </p>
               <p className="text-[#5C6748]/70 text-xs italic">
                 If you don't see it in your inbox, please check your spam folder.
               </p>
             </div>
             
             <div className="pt-2 border-t border-gray-100">
               <p className="text-sm text-[#5C6748] mb-2">Didn't receive an email?</p>
               
               {resendTimer > 0 ? (
                 <div className="flex items-center text-[#5C6748]/70 text-sm">
                   <Clock className="h-4 w-4 mr-2" />
                   <span>You can request again in <span className="font-medium">{resendTimer}s</span></span>
                 </div>
               ) : (
                 <button
                   onClick={handleSubmit}
                   disabled={loading}
                   className="w-full flex justify-center items-center py-2.5 rounded-lg text-sm font-medium text-white
                            bg-[#A2AA7B] hover:bg-[#8C9669] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A2AA7B] 
                            transition-colors"
                 >
                   {loading ? (
                     <div className="flex space-x-2">
                       <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                       <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                       <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                     </div>
                   ) : (
                     "Resend Link"
                   )}
                 </button>
               )}
             </div>
           </div>
         </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#5C6748] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#A2AA7B]" />
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#A2AA7B] focus:ring-2 focus:ring-[#A2AA7B] focus:border-[#A2AA7B] 
                           bg-white transition-colors hover:bg-gray-50 outline-none"
                    placeholder="Enter your email address"
                    
                  />
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
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
                  "Send Reset Link"
                )}
              </button>

              <p className="text-center text-sm text-[#5C6748]">
                Remember your password?{' '}
                <a href="/login" className="text-[#A2AA7B] hover:text-[#8C9669] font-medium">
                  Login here
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;