import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const PharmacistContext = createContext();

const PharmacistContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // State
  const [pToken, setPToken] = useState(localStorage.getItem("pToken") || "");
  const [pharmappointments, setPharmAppointments] = useState([]);
  const [profileData, setProfileData] = useState(null);

  const pharmacistId = localStorage.getItem("pharmacistId");

  const handleApiError = (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred";
    toast.error(message);
    console.error("API Error:", message);
  };

  // ✅ Fetch Appointments (POST instead of GET)
  const getPharmAppointments = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/pharmacists/pharm-appointment",
        { pharmacistId },
        { headers: { Authorization: `Bearer ${pToken}` } }
      );

      if (data.success) {
        setPharmAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // ✅ Fetch Pharmacist Profile
  const getProfileData = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/pharmacists/profile",
        { pharmacistId },
        { headers: { Authorization: `Bearer ${pToken}` } }
      );
      setProfileData(data.profileData);
    } catch (error) {
      handleApiError(error);
    }
  };

  // Fetch on token change
  useEffect(() => {
    if (pToken && pharmacistId) {
      getProfileData();
      getPharmAppointments();
    }
  }, [pToken]);

  const value = {
    pToken,
    setPToken,
    profileData,
    setProfileData,
    getProfileData,
    pharmappointments,
    getPharmAppointments,
  };

  return (
    <PharmacistContext.Provider value={value}>
      {children}
    </PharmacistContext.Provider>
  );
};

export default PharmacistContextProvider;