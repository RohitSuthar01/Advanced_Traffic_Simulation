import React, { useState } from "react";

// --- Form Structure Configuration ---
const initialFormData = {
  // 1. Contact Info
  firstName: "",
  middleName: "",
  lastName: "", // Optional
  stationName: "",
  stationCode: "",
  postingCode: "",
  email: "",
  phoneNo: "",
  address: "",
  
  // 2. Document Verification (Store file paths or names here in a real app)
  aadharCard: null, 
  nativeCertificate: null,
  photo: null,
  postingLetter: null,
  
  // 3. Unique Code
  reportingCode: "", 
  password: "" // Add password field for final registration
};

// --- Component Definition ---
const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Track which steps are visually complete
  const [stepStatus, setStepStatus] = useState({
    1: false, // Contact Info
    2: false, // Document Verification
    3: false, // Unique Code
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    // Handle file inputs separately
    if (type === 'file') {
      // In a real app, you would upload this file to storage (e.g., Firebase Storage)
      setFormData(prev => ({
        ...prev,
        [name]: files[0] // Store file object for display/upload
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Check if current step data is valid enough to proceed
  const validateStep = () => {
    // Basic validation logic for mandatory fields
    switch (currentStep) {
      case 1: // Contact Info
        return (
          formData.firstName.trim() !== "" &&
          formData.stationName.trim() !== "" &&
          formData.email.trim() !== "" &&
          formData.phoneNo.trim() !== "" &&
          formData.address.trim() !== "" &&
          formData.stationCode.trim() !== "" &&
          formData.postingCode.trim() !== ""
        );
      case 2: // Document Verification (Checking if files are selected)
        return (
          formData.aadharCard !== null &&
          formData.nativeCertificate !== null &&
          formData.photo !== null &&
          formData.postingLetter !== null
        );
      case 3: // Unique Code
        return (
          formData.reportingCode.trim() !== "" &&
          formData.password.length >= 6 // Basic password length check
        );
      default:
        return false;
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep()) {
      setStepStatus(prev => ({ ...prev, [currentStep]: true })); // Mark current step as complete
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Final submission handler
        handleSubmit();
      }
    } else {
      alert("Kripya is section ke sabhi anivarya (required) fields bharain."); // Please fill out all required fields
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    // TODO: Yahaan par aapki final registration API call (e.g., createUserWithEmailAndPassword) hogi
    console.log("Final Data Submitted:", formData);
    
    // Simulate API call delay
    setTimeout(() => {
        setLoading(false);
        setIsSubmitted(true);
        setStepStatus(prev => ({ ...prev, 3: true }));
        // alert("Registration Complete! Welcome aboard."); // Alert removed as per system guidelines
    }, 2000);
  };
  
  // --- Rendering Functions ---

  const renderStepIndicator = (step, title) => {
    const isCompleted = stepStatus[step];
    const isActive = step === currentStep;
    
    return (
      <div 
        key={step} 
        className={`flex flex-col items-center space-y-1 cursor-pointer transition duration-300 ${isActive ? 'text-blue-500 font-bold' : isCompleted ? 'text-green-500' : 'text-gray-400'}`}
        onClick={() => { if (!loading && !isSubmitted && step < currentStep) setCurrentStep(step); }} // Allow jumping back if not loading
      >
        <div 
          className={`w-10 h-10 flex items-center justify-center rounded-full border-2 
            ${isCompleted ? 'bg-green-600 border-green-600 text-white' : isActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-gray-700 border-gray-400 dark:border-gray-500 text-gray-500 dark:text-gray-400'}`
          }
        >
          {isCompleted ? '✓' : step}
        </div>
        <span className="text-xs text-center hidden sm:inline">{title}</span>
        <span className={`h-1 w-full absolute top-1/2 left-full transform -translate-x-1/2 ${step < 3 ? 'block' : 'hidden'}`}></span>
      </div>
    );
  };

  const renderContactInfo = () => (
    <>
      <h3 className="text-xl font-semibold mb-4 text-gray-200 dark:text-white">1. Sampark Jaankari (Contact Info)</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input name="firstName" type="text" placeholder="First Name *" value={formData.firstName} onChange={handleChange} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600" />
        <input name="middleName" type="text" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input name="lastName" type="text" placeholder="Last Name (Optional)" value={formData.lastName} onChange={handleChange} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600" />
        <input name="stationName" type="text" placeholder="Station Name *" value={formData.stationName} onChange={handleChange} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <input name="stationCode" type="text" placeholder="Station Code *" value={formData.stationCode} onChange={handleChange} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600" />
        <input name="postingCode" type="text" placeholder="Posting Code *" value={formData.postingCode} onChange={handleChange} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600" />
        <input name="phoneNo" type="tel" placeholder="Phone No *" value={formData.phoneNo} onChange={handleChange} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600" />
      </div>
      
      <input name="email" type="email" placeholder="Email *" value={formData.email} onChange={handleChange} required className="w-full p-3 mb-4 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600" />
      
      <textarea name="address" placeholder="Address *" value={formData.address} onChange={handleChange} required rows="2" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 resize-none" />
    </>
  );

  const renderDocumentVerification = () => (
    <>
      <h3 className="text-xl font-semibold mb-6 text-gray-200 dark:text-white">2. Dastavez Satyaapan (Document Verification)</h3>
      <p className="text-sm text-gray-400 dark:text-gray-400 mb-4">Kripya zaroori dastavezon ki saaf scanned copy upload karein.</p>
      
      <div className="space-y-4">
        {['aadharCard', 'nativeCertificate', 'photo', 'postingLetter'].map((docName) => (
          <div key={docName} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-dashed rounded-lg dark:border-gray-600 bg-gray-700 dark:bg-gray-900">
            <label htmlFor={docName} className="block text-sm font-medium text-gray-200 dark:text-gray-300 capitalize mb-2 sm:mb-0">
              {docName.replace(/([A-Z])/g, ' $1').trim()} *
            </label>
            <input name={docName} id={docName} type="file" accept=".pdf,.jpg,.png" onChange={handleChange} required className="text-sm text-gray-300 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition" />
            {formData[docName] && <span className="text-green-500 text-lg ml-2 mt-1 sm:mt-0">✓</span>}
          </div>
        ))}
      </div>
    </>
  );

  const renderUniqueCode = () => (
    <>
      <h3 className="text-xl font-semibold mb-4 text-gray-200 dark:text-white">3. Unique Code & Password Set-up</h3>
      <p className="text-sm text-gray-400 dark:text-gray-400 mb-6">Apna unique reporting code daalain aur password set karein.</p>
      
      <input name="reportingCode" type="text" placeholder="Reporting Code *" value={formData.reportingCode} onChange={handleChange} required className="w-full p-3 mb-4 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600" />
      
      <input name="password" type="password" placeholder="Set Password (min 6 chars) *" value={formData.password} onChange={handleChange} required minLength="6" className="w-full p-3 mb-6 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600" />
    </>
  );
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderContactInfo();
      case 2:
        return renderDocumentVerification();
      case 3:
        return renderUniqueCode();
      default:
        return <p className="text-red-500">Error: Invalid Step</p>;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10 p-4">
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
        New User Registration 
      </h2>

      <div className="w-full max-w-lg mb-8 flex justify-around items-start relative bg-gray-700 dark:bg-gray-900 p-4 rounded-xl shadow-inner">
        {[
          { step: 1, title: "Contact Info" },
          { step: 2, title: "Verification" },
          { step: 3, title: "Final Code" }
        ].map(item => renderStepIndicator(item.step, item.title))}
      </div>

      <form onSubmit={handleNext} className="bg-gray-800 dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg border border-gray-700 dark:border-gray-700">

        {renderCurrentStep()}

        <div className="flex justify-between mt-8 pt-4 border-t dark:border-gray-700">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1 || loading || isSubmitted}
            className="px-6 py-3 bg-gray-700 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200 disabled:opacity-50 font-semibold shadow-md"
          >
            ← Piche (Back)
          </button>
          
          <button
            type="submit" // Submits the form to handleNext
            disabled={loading || isSubmitted}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-200 shadow-lg 
              ${currentStep === 3 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
              } disabled:opacity-50`}
          >
            {loading ? "Processing..." : (currentStep === 3 ? "Complete Registration" : "Next →")}
          </button>
        </div>
        
        {isSubmitted && (
            <div className="mt-4 text-center text-green-400 font-bold p-3 bg-green-900 rounded-lg dark:bg-green-900 dark:text-green-400 shadow-lg">
                Panjikaran Sampann! (Registration Finalized!)
            </div>
        )}
      </form>
    </div>
  );
};

export default Register;
