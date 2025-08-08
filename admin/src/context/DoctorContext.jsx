/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext()

const DoctorContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // Helper function to handle API responses and errors
  const handleApiError = (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred";
    toast.error(message);
    console.error("API Error:", message);  
  };

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } })
      if (data.success) {
        setAppointments(data.appointments.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // Get doctor profile data
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/profile", {
        headers: { dToken },
      });
      setProfileData(data.profileData);
    } catch (error) {
      handleApiError(error);
    }
  };

  // Cancel an appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        await getAppointments(); // Re-fetch the appointments after canceling
        await getDashData(); // Optionally update dashboard data
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Complete an appointment
  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        await getAppointments(); // Re-fetch the appointments after completing
        await getDashData(); // Optionally update dashboard data
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const acceptAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/accept-appointment", // Ensure the correct endpoint
        { appointmentId },
        { headers: { dToken } } // Include the doctor token for authentication
      );

      if (data.success) {
        toast.success(data.message || "Appointment accepted successfully");
        await getAppointments(); // Re-fetch the appointments after accepting
        await getDashData(); // Optionally update dashboard data if needed
      } else {
        toast.error(data.message || "Failed to accept the appointment");
      }
    } catch (error) {
      handleApiError(error); // Reuse the same error handler as in `completeAppointment`
    }
  };

  // Get dashboard data
  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/dashboard", {
        headers: { dToken },
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Pass the context values
  const value = {
    dToken,
    setDToken,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
    acceptAppointment, // Added acceptAppointment function
    dashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
  };

  return (
    <DoctorContext.Provider value={value}>
      {children} {/* Ensure children are rendered */}
    </DoctorContext.Provider>
  )
};

export default DoctorContextProvider;