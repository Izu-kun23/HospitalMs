import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const PharmacistContext = createContext();

const PharmacistContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // State for token, profile, and dashboard data
  const [pToken, setPToken] = useState(localStorage.getItem("pToken") || "");
  const [profileData, setProfileData] = useState(null);

  // Error handler
  const handleApiError = (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred";
    toast.error(message);
    console.error("API Error:", message);
  };

  // ✅ Fetch Pharmacist Profile
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/pharmacists/profile", {
        headers: { pToken },
      });
      setProfileData(data.profileData);
    } catch (error) {
      handleApiError(error);
    }
  };

  // Fetch profile on token change
  useEffect(() => {
    if (pToken) {
      getProfileData();
    }
  }, [pToken]);

  // Provide values to context
  const value = {
    pToken,
    setPToken,
    profileData,
    setProfileData,
    getProfileData,
  };

  return <PharmacistContext.Provider value={value}>{children}</PharmacistContext.Provider>;
};

export default PharmacistContextProvider;