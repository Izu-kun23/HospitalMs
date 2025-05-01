import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    // State variables
    const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [pharmacists, setPharmacists] = useState([]);
    const [archivedDoctors, setArchivedDoctors] = useState([]);  // ✅ Added this!
    const [dashData, setDashData] = useState(null);

    // Helper function for handling API errors
    const handleApiError = (error) => {
        const message = error.response?.data?.message || error.message || "An unknown error occurred";

        if (message.includes("Not Authorized") || message.includes("Token expired")) {
            toast.error("Session expired. Please log in again.");
            localStorage.removeItem("aToken");
            setAToken("");
        } else {
            toast.error(message);
        }

        console.error("API Error:", message);
    };

    // Function to fetch all doctors
    const getAllDoctors = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
                headers: { Authorization: `Bearer ${aToken}` },
            });

            if (data.success) {
                // ✅ Separate archived and active doctors
                const activeDocs = data.doctors.filter(doctor => !doctor.archived);
                const archivedDocs = data.doctors.filter(doctor => doctor.archived);

                setDoctors(activeDocs);
                setArchivedDoctors(archivedDocs);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const getAllPharmacists = async () => {
        try {
            if (!aToken) {
                toast.error('No authentication token found.');
                return;
            }
    
            const { data } = await axios.get(`${backendUrl}/api/admin/all-pharmacists`, {
                headers: { Authorization: `Bearer ${aToken}` },
            });
    
            if (data.success) {
                setPharmacists(data.pharmacists);
            } else {
                toast.error(data.message || 'Failed to fetch pharmacists.');
            }
        } catch (error) {
            handleApiError(error);
        }
    };

      // Function to change doctor availablity using API
      const changeAvailability = async (docId) => {
        try {

            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };

    const changePharmacistAvailability = async (pharmacistId) => {
        try {

            const { data } = await axios.post(backendUrl + '/api/admin/change-availability-pharmacist', { pharmacistId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllPharmacists()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };


       
    
    // Function to fetch all appointments
    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
                headers: { Authorization: `Bearer ${aToken}` },
            });
            if (data.success) {
                setAppointments(data.appointments.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    // Function to cancel an appointment
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/cancel-appointment`,
                { appointmentId },
                { headers: { Authorization: `Bearer ${aToken}` } }
            );
            if (data.success) {
                toast.success(data.message);
                getAllAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    // Function to fetch dashboard data
    const getDashData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
                headers: { Authorization: `Bearer ${aToken}` },
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

      // 🟡 Archive Doctor (Soft delete)
      const archiveDoctor = async (docId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/doctors/${docId}/archive`, {}, {
                headers: { Authorization: `Bearer ${aToken}` }
            });
    
            if (data.success) {
                toast.success(data.message);
                setDoctors((prevDoctors) => prevDoctors.filter(doc => doc._id !== docId));  // Remove from active list
                setArchivedDoctors((prevArchived) => [...prevArchived, data.doctor]);  // Move to archived list
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    // 🔴 Delete Doctor (Permanent)
    const deleteDoctor = async (docId) => {
        try {
            const { data } = await axios.delete(
                `${backendUrl}/api/admin/doctors/${docId}`, 
                { headers: { Authorization: `Bearer ${aToken}` } }
            );
            if (data.success) {
                toast.success("Doctor deleted permanently.");
                getAllDoctors();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            handleApiError(error);
        }
    };


    // Automatically log out if token is missing
    useEffect(() => {
        if (!aToken) {
            localStorage.removeItem("aToken");
        }
    }, [aToken]);

    // Context value
    const value = {
        aToken,
        setAToken,
        doctors,
        pharmacists,
        getAllDoctors,
        getAllPharmacists,
        changeAvailability,
        appointments,
        getAllAppointments,
        getDashData,
        changePharmacistAvailability,
        cancelAppointment,
        dashData,
        archivedDoctors,
        archiveDoctor,  // ✅ Added
        deleteDoctor,   // ✅ Added
    };

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export default AdminContextProvider;