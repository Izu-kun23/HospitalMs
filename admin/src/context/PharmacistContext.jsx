import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const PharmacistContext = createContext();

const PharmacistContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [pToken, setPToken] = useState(localStorage.getItem('pToken') || '');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false); // Set loading to false initially
  const [error, setError] = useState(null);

  // Fetch pharmacist appointments
  const getPharmacistAppointments = async () => {
    setLoading(true); // Set loading state
    setError(null); // Reset errors before making a new request

    if (!pToken) {
      setError("No authentication token found. Please log in.");
      toast.error("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/api/pharmacists/appointments`, {
        headers: {
          Authorization: `Bearer ${pToken}`,  // Send the JWT token in the header
        },
      });
      console.log("Response from getPharmacistAppointments:", response.data);

      if (response.data.success) {
        setAppointments(response.data.appointments); // Store fetched appointments in state
      } else {
        setError(response.data.message || "Failed to fetch appointments.");
        toast.error(response.data.message || "Failed to fetch appointments.");
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message || "Error occurred while fetching appointments.");
    } finally {
      setLoading(false); // Stop loading state once the request is finished
    }
  };

  // Automatically fetch appointments if the token is set and appointments are empty
  useEffect(() => {
    if (pToken && appointments.length === 0) {
      getPharmacistAppointments();  // Fetch appointments only if it's the first time or token changes
    }
  }, [pToken]);

  // Value object for the context
  const value = {
    pToken,
    appointments,
    getPharmacistAppointments,
    loading,
    error,
    setPToken,  // Allow setting token externally
  };

  return (
    <PharmacistContext.Provider value={value}>
      {children}
    </PharmacistContext.Provider>
  );
};

export default PharmacistContextProvider;