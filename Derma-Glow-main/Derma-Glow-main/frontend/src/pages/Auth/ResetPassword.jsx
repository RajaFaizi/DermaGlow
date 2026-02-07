import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { successToaster, failureToaster } from "../../utils/swal";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password) => {
    // Password should be at least 6 characters, contain a number, uppercase letter, and special character
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordPattern.test(password)) {
      setPasswordError("Password must be at least 6 characters long, include a number, an uppercase letter, and a special character.");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const validateConfirmPassword = () => {
    if (passwordData.confirmPassword !== passwordData.newPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isPasswordValid = validatePassword(passwordData.newPassword);
    const isConfirmPasswordValid = validateConfirmPassword();

    if (isPasswordValid && isConfirmPasswordValid) {
      setLoading(true);

      try {
        const response = await axios.post(
          `http://localhost:8000/api/auth/reset-password/${token}`,
          { password: passwordData.newPassword }
        );
  
        console.log("Response received:", response);
        successToaster("Password reset successfully! Redirecting...");
        
        setTimeout(() => navigate("/login"), 1000);
      } catch (error) {
        console.error("Request error:", error);
        failureToaster(error.response?.data?.message || "Something went wrong.");
        setErrors({ apiError: error.response?.data?.message || "Something went wrong." });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 bg-white border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#5C6748]">Reset Password</h2>
          <p className="mt-1 text-sm text-[#8C9669]">Enter your new password</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-8">
          {/* New Password */}
          <div className="relative">
            <label htmlFor="newPassword" className="block text-sm font-medium text-[#5C6748] mb-2">New Password</label>
            <div className="mt-1 flex items-center">
              <div className="relative w-full">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleChange}
                  onBlur={() => validatePassword(passwordData.newPassword)}
                  className="block w-full px-4 py-2 border border-[#A2AA7B] rounded-lg focus:ring-[#5C6748] focus:border-[#5C6748]"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#5C6748] mb-2">Confirm Password</label>
            <div className="mt-1 flex items-center">
              <div className="relative w-full">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleChange}
                  onBlur={validateConfirmPassword}
                  className="block w-full px-4 py-2 border border-[#A2AA7B] rounded-lg focus:ring-[#5C6748] focus:border-[#5C6748]"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                >
                  {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {confirmPasswordError && <p className="text-xs text-red-500 mt-1">{confirmPasswordError}</p>}
          </div>

          {/* API Error */}
          {errors.apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errors.apiError}
            </div>
          )}

          {/* Submit Button */}
          <div className="space-y-4">
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
                  "Reset Password"
                )}
              </button>

              <p className="text-center text-sm text-[#5C6748]">
                Back to{' '}
                <a href="/login" className="text-[#A2AA7B] hover:text-[#8C9669] font-medium">
                  Login
                </a>
              </p>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;