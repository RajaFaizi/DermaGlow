import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { successToaster } from "./../../utils/swal";
import  axios  from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = `Invalid email format\n e.g. example@gmail.com`;
    }
  
 
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!validateForm()) return;

      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        formData
      );
      successToaster("Login Successful");
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("userInfo", JSON.stringify(response.data.data));
       console.log("Response", response.data.data);
      if(response.data.data.role === "admin") {
        console.log("Admin");
        navigate("/admin");
      } else {
        console.log("User");
        navigate("/");
      }
    } catch (error) {
      console.log("Error", error);
      if (error.response && error.response.data) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target; // Extract name and value from the event
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear errors on change
  };
  
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#E6EAD3] via-white to-[#D1D9B3] opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#C5D1A5] rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-20 left-20 w-48 h-48 bg-[#D7E0BD] rounded-full blur-3xl opacity-40"></div>
      </div>
      <div className="relative z-10 grid grid-cols-2 gap-8 w-full max-w-5xl bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <div className="flex items-center justify-center">
          <img
            src="/src/assets/pic1.jpg"
            alt="AI Assistant"
            className="rounded-[20px] w-full"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#5C6748] mb-2">Derma Glow</h1>
          <p className="text-[#7C8A5F]">AI-Powered Skincare Companion</p>

          <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#5C6748] mb-2"
              >
                Email Address
              </label>
              <input
                type="text"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#A2AA7B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2AA7B]"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#5C6748] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                name="password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#A2AA7B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2AA7B]"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C8A5F]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {serverError && (
                <p className="text-red-500 text-xs mt-1">{serverError}</p>
              )}
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-[#7C8A5F]">
                Do not have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#5C6748] hover:text-[#A2AA7B] font-semibold"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/forgot-Password"
                className="text-sm text-[#5C6748] hover:text-[#A2AA7B]"
              >
                Forgot Password?
              </Link>
              <button
                type="submit"
                className="bg-[#A2AA7B] text-white py-2 px-4 rounded-lg hover:bg-[#8C9669] transition-colors"
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
