import MarkdownRenderer from "../../components/MarkdownRenderer";
import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import html2pdf from "html2pdf.js";
import { BeatLoader } from "react-spinners";

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // Get report data from location state
  const { report, sessionId } = location.state || { report: null, sessionId: null };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F8FAF5]">
        <div className="text-xl font-medium mb-4">No report data available</div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#A2AA7B] text-white rounded-lg hover:bg-sage-700 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }


  const handleDownloadPDF = async () => {
    setIsExporting(true);
    const element = reportRef.current;
    
    try {
      // Create a clone of the report content for PDF export
      // This removes height restrictions that could cause content truncation
      const clonedElement = element.cloneNode(true);
      const container = document.createElement('div');
      container.appendChild(clonedElement);
      
      // Remove any height/overflow restrictions from the cloned element
      clonedElement.style.maxHeight = 'none';
      clonedElement.style.height = 'auto';
      clonedElement.style.overflow = 'visible';
      
      // Find any scrollable containers in the clone and remove their restrictions
      const scrollableElements = clonedElement.querySelectorAll('[class*="overflow-y-auto"], [class*="overflow-auto"]');
      scrollableElements.forEach(el => {
        el.style.maxHeight = 'none';
        el.style.height = 'auto';
        el.style.overflow = 'visible';
      });

      const opt = {
        margin: [15, 15],
        filename: "skincare-report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          scrollY: 0,
          // Ensure complete content capture
          logging: true,
          letterRendering: true,
          windowHeight: Math.max(
            document.body.scrollHeight, 
            document.body.offsetHeight, 
            document.documentElement.clientHeight, 
            document.documentElement.scrollHeight, 
            document.documentElement.offsetHeight
          )
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      };

      await html2pdf().from(clonedElement).set(opt).save();
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsExporting(false);
    }
  };


  const handleBackToChat = () => {
    navigate(-1);
  };

  return (
    <div className="bg-[#F8FAF5] py-8 px-4 print:bg-white print:p-0">
      {/* Header actions - hidden when printing */}
      <div className="mx-auto mb-6 print:hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button
            onClick={handleBackToChat}
            className="flex items-center gap-2 text-sage-700 hover:text-sage-900 transition-all"
          >
            <ArrowLeft size={20} />
            <span>Back to Chat</span>
          </button>
          
          <div className="flex flex-wrap gap-3 items-center">
            <h1 className="fw-800 text-[#A2AA7B] fs-32">
              Report Summary
            </h1>
           
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-[#A2AA7B] text-white rounded-lg hover:bg-[#8A9665] transition-all disabled:opacity-50"
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <BeatLoader color="#ffffff" size={8} />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        {/* Changed this to be height-auto for PDF downloading */}
        <div 
          ref={reportRef}
          className="bg-white shadow-xl rounded-xl w-full overflow-hidden mx-auto print:shadow-none print:rounded-none pdf-container"
        >
          {/* Viewing container with scrollable height */}
          <div className="max-h-[70vh] overflow-y-auto p-2 sm:p-8">
            <MarkdownRenderer content={report} />
          </div>
        </div>
      </div>
      
      {/* Footer - hidden when printing */}
      <div className="w-full mb-4 text-center text-gray-500 text-sm print:hidden">
        <p>Generated on {new Date().toLocaleDateString()} | Keep this report for your skincare journey</p>
      </div>
    </div>
  );
};

export default Report;