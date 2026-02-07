import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { successToaster } from "../../utils/swal";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [userNameError, setUserNameError] = useState('');


  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePassword = (password) => {
    // Password should be at least 8 characters, contain a number, uppercase letter, and special character.
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordPattern.test(password)) {
      setPasswordError("Password must be at least 6 characters long, include a number, an uppercase letter, and a special character.");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match.");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  const validateUserName = (userName) => {
    if (userName === "") {
      setUserNameError("Please enter your full name.");
      return false;
    } else {
      setUserNameError("");
      return true;
    }
  };
  

  const handleSubmit = async(e) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    const isUserNameValid = validateUserName(name);

    if (isEmailValid && isPasswordValid && isConfirmPasswordValid && isUserNameValid) {
      const payload = {
        name,
        email,
        password,
      };
      try {
        
        const response = await axios.post(
          "http://localhost:8000/api/auth/signup",
          payload
        );
        console.log("Signup Successful", response.data);
        navigate("/login");
        successToaster("Signup Successful");
      } catch (error) {
        if (error.response && error.response.data) {
          setServerError(error.response.data.message);
        } else {
          setServerError("Something went wrong. Please try again.");
        }
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#E6EAD3] via-white to-[#D1D9B3] opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#C5D1A5] rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-20 left-20 w-48 h-48 bg-[#D7E0BD] rounded-full blur-3xl opacity-40"></div>
      </div>
      <div className="relative z-10 grid grid-cols-2 gap-8 w-full max-w-5xl bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <div>
          <div className="mb-8">
            <h1 className="text-xl font-bold text-[#5C6748] mb-2">Derma Glow</h1>
            <p className="text-[#7C8A5F]">Create Your Personalized Skincare</p>
          </div>

          <form onSubmit={handleSubmit}>

          <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-semibold text-[#5C6748] mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-md border-[#D1D9B3] focus:outline-none focus:ring-2 focus:ring-[#5C6748]"
                placeholder="Enter User Name"
           
              />
              {userNameError && <p className="text-red-500 text-xs mt-1">{userNameError}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold text-[#5C6748] mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md border-[#D1D9B3] focus:outline-none focus:ring-2 focus:ring-[#5C6748]"
                placeholder="Enter your email"
           
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-semibold text-[#5C6748] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded-md border-[#D1D9B3] focus:outline-none focus:ring-2 focus:ring-[#5C6748]"
                  placeholder="Enter your password"
                
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2 right-2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#5C6748] mb-2">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded-md border-[#D1D9B3] focus:outline-none focus:ring-2 focus:ring-[#5C6748]"
                placeholder="Confirm your password"
             
              />
              {confirmPasswordError && <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-[#5C6748] text-white rounded-md hover:bg-[#4B5D3D] focus:outline-none"
            >
              Create Account
            </button>
          </form>
          {serverError && <p className="text-red-500 text-xs text-center mt-1">{serverError}</p>}

          <div className="mt-4 text-center text-sm text-[#7C8A5F]">
            <p>Already have an account? <Link to="/login" className="text-[#5C6748] font-semibold">Login here</Link></p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <img src="/src/assets/pic3.jpg" alt="AI Assistant" className="rounded-[20px] w-90" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
