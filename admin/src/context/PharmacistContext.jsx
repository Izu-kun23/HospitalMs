import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
// import { toast } from "react-toastify";

export const PharmacistContext = createContext();

const PharmacistContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [pToken, setPToken] = useState(localStorage.getItem('pToken') || '');
  const [appointments, setAppointments] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const getPharmacistAppointments = useCallback(async () => {
    if (!pToken) {
      setError("No authentication token found.");
      toast.error("No authentication token found.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/pharmacists/appointments`, {
        headers: { Authorization: `Bearer ${pToken}` },
      });

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        throw new Error(data.message || "Failed to fetch appointments.");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [pToken, backendUrl]);

  
  const getProfileData = async () => {
    try {
        const { data } = await axios.get(`${backendUrl}/api/pharmacists/profile`, {
            headers: { Authorization: `Bearer ${pToken}` }, // ✅ Corrected
        });
        if (data.success) {
            setProfileData(data.profileData);
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
        console.error(error);
    }
};





  // Run on initial mount or when token changes
  useEffect(() => {
    if (pToken) {
      getPharmacistAppointments();
      getProfileData();
    }
  }, [pToken, getPharmacistAppointments, getProfileData]);

  return (
    <PharmacistContext.Provider
      value={{
        pToken,
        setPToken,
        appointments,
        getPharmacistAppointments,
        profileData,
        setProfileData,
        getProfileData,
        
        loading,
        error,
      }}
    >
      {children}
    </PharmacistContext.Provider>
  );
};

export default PharmacistContextProvider;