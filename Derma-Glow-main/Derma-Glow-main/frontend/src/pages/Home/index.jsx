import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, FileText, Shield, Sparkles, ChevronRight, Star, Check } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");

    if (token && userInfo) {
      setUser(JSON.parse(userInfo)); // Set user if logged in
    } else {
      setUser(null); // Set user to null if not logged in
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAF5]">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
          <div className="flex items-center justify-center py-4 mb-2">
                    <img
                        src="/src/assets/logo2.png"
                        alt="Derma Glow Logo"
                        className="h-12 object-contain"
                    />
                </div>
          </div>

          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-[#465635] hover:text-[#A2AA7B] transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-[#465635] hover:text-[#A2AA7B] transition-colors font-medium">How It Works</a>
          </div>

          <div className="flex space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/assessment")}
                  className="px-4 py-2 text-[#A2AA7B] font-medium border border-[#A2AA7B] rounded-lg hover:bg-[#A2AA7B] hover:text-white transition-all"
                >
                  Go to Dashboard
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-[#A2AA7B] font-medium border border-[#A2AA7B] rounded-lg hover:bg-[#A2AA7B] hover:text-white transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 bg-[#A2AA7B] text-white font-medium rounded-lg hover:bg-[#8A9665] transition-all shadow-md"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#465635] leading-tight">
              Your Personal <span className="text-[#A2AA7B]">Skincare Expert</span> Powered by AI
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              Discover personalized skincare routines, get expert advice, and receive comprehensive reports tailored to your unique skin needs.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {user ? (
                <button
                  onClick={() => navigate("/assessment")}
                  className="px-6 py-3 bg-[#A2AA7B] text-white font-medium rounded-lg hover:bg-[#8A9665] transition-all shadow-lg flex items-center justify-center"
                >
                  Start Your Free Assessment
                  <ChevronRight size={18} className="ml-1" />
                </button>
              ) : (
                <button
                  onClick={() => navigate("/signup")}
                  className="px-6 py-3 bg-[#A2AA7B] text-white font-medium rounded-lg hover:bg-[#8A9665] transition-all shadow-lg flex items-center justify-center"
                >
                  Start Your Free Assessment
                  <ChevronRight size={18} className="ml-1" />
                </button>
              )}
            </div>
            <div className="mt-8 flex items-center text-sm text-gray-600">
              <Check size={16} className="text-[#A2AA7B] mr-2" />
              <span>No credit card required</span>
              <span className="mx-3">•</span>
              <Check size={16} className="text-[#A2AA7B] mr-2" />
              <span>Free personalized assessment</span>
            </div>
          </div>
          <div className="lg:w-1/2 lg:pl-12">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-[#A2AA7B]/10 rounded-full z-0"></div>
              <div className="relative z-10 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-sage-100">
                <div className="p-2 bg-gray-50 border-b flex justify-between items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="text-xs font-medium text-gray-500">Derma Glow Chat</div>
                  <div className="w-12"></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-start mb-4">
                    <div className="max-w-[80%] bg-gray-100 rounded-2xl p-4 text-gray-700 text-sm rounded-tl-none">
                      Hello! I'm your AI skincare assistant. What skin concerns would you like help with today?
                    </div>
                  </div>
                  <div className="flex justify-end mb-4">
                    <div className="max-w-[80%] bg-[#A2AA7B] rounded-2xl p-4 text-white text-sm rounded-tr-none">
                      I've been dealing with occasional acne and dryness around my T-zone. Can you recommend a routine?
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[80%] bg-gray-100 rounded-2xl p-4 text-gray-700 text-sm rounded-tl-none">
                      Based on your combination skin, I recommend a gentle cleanser, alcohol-free toner, and hydrating moisturizer. Would you like me to create a full routine with specific product recommendations?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-xl md:text-2xl font-bold text-[#465635]">Our Key Features</h2>
            <p className="mt-4 text-gray-600 max-w-xl mx-auto">
              Discover how our AI-powered platform revolutionizes your skincare routine with personalized guidance and expert recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#F8FAF5] p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#A2AA7B] rounded-lg flex items-center justify-center mb-6">
                <MessageCircle size={24} className="text-white" />
              </div>
              <h3 className="text-base font-semibold text-[#465635] mb-3">AI Assistance</h3>
              <p className="text-gray-600">
                Chat with our AI skincare expert to get personalized advice, product recommendations, and solutions for your specific skin concerns.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F8FAF5] p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#A2AA7B] rounded-lg flex items-center justify-center mb-6">
                <FileText size={24} className="text-white" />
              </div>
              <h3 className="text-base font-semibold text-[#465635] mb-3">Detailed Reports</h3>
              <p className="text-gray-600">
                Receive comprehensive skincare reports with actionable insights, custom routines, and product recommendations based on your skin assessment.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F8FAF5] p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-[#A2AA7B] rounded-lg flex items-center justify-center mb-6">
                <Shield size={24} className="text-white" />
              </div>
              <h3 className="text-base font-semibold text-[#465635] mb-3">Science-Based Advice</h3>
              <p className="text-gray-600">
                Our AI is trained on dermatological research to provide evidence-based recommendations that are safe and effective for your skin type.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-[#F0F3EB]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-xl md:text-2xl font-bold text-[#465635]">How It Works</h2>
            <p className="mt-4 text-gray-600 max-w-xl mx-auto">
              Getting started with your personalized skincare journey is simple and quick.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-md z-10 relative h-full flex flex-col">
                <div className="w-12 h-12 bg-[#A2AA7B] rounded-full flex items-center justify-center text-white font-bold text-base mb-4">1</div>
                <h3 className="text-base font-semibold text-[#465635] mb-3">Complete Assessment</h3>
                <p className="text-gray-600 flex-grow">Answer a few questions about your skin type, concerns, and current routine.</p>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full w-16 h-0.5 bg-[#A2AA7B] transform -translate-y-1/2 z-0"></div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-md z-10 relative h-full flex flex-col">
                <div className="w-12 h-12 bg-[#A2AA7B] rounded-full flex items-center justify-center text-white font-bold text-base mb-4">2</div>
                <h3 className="text-base font-semibold text-[#465635] mb-3">Chat with AI</h3>
                <p className="text-gray-600 flex-grow">Interact with our AI assistant to refine recommendations and ask specific questions.</p>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full w-16 h-0.5 bg-[#A2AA7B] transform -translate-y-1/2 z-0"></div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="bg-white p-6 rounded-xl shadow-md z-10 relative h-full flex flex-col">
                <div className="w-12 h-12 bg-[#A2AA7B] rounded-full flex items-center justify-center text-white font-bold text-base mb-4">3</div>
                <h3 className="text-base font-semibold text-[#465635] mb-3">Get Your Report</h3>
                <p className="text-gray-600 flex-grow">Receive a personalized skincare report with detailed recommendations and routines.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#A2AA7B] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-6">Ready to Transform Your Skincare Routine?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of users who have discovered their perfect skincare routine with our AI assistant.
          </p>
          <button 
            onClick={() => navigate("/signup")}
            className="px-8 py-4 bg-white text-[#465635] font-medium rounded-lg hover:bg-gray-100 transition-all shadow-lg text-lg"
          >
            Start Your Free Assessment
          </button>
          <p className="mt-4 text-sm opacity-80">No credit card required. Start your journey to healthier skin today.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#465635] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
            <div className="flex items-center justify-center py-4 mb-2">
                    <img
                        src="/src/assets/logo2.png"
                        alt="Derma Glow Logo"
                        className="h-12 object-contain"
                    />
                </div>
              <p className="text-gray-300 mb-4">
                Personalized skincare recommendations powered by advanced AI technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
