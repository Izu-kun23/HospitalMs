import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = '$';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [doctors, setDoctors] = useState([]);
    const [pharmacists, setPharmacists] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userData, setUserData] = useState(null);

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching doctors.");
        }
    };

    const getPharmacistsData = async () => {
        try {
            console.log("Backend URL:", backendUrl);
            console.log("Fetching pharmacists from:", `${backendUrl}/api/pharmacists/pharm-list`);
            
            const response = await axios.get(`${backendUrl}/api/pharmacists/pharm-list`);
            console.log("Response Data:", response.data);
    
            if (response.data.success) {
                console.log("Pharmacists fetched successfully:", response.data.pharmacists);
                setPharmacists(response.data.pharmacists);
            } else {
                console.error("Error: Backend returned a failure:", response.data.message);
                toast.error(response.data.message || "Failed to fetch pharmacists.");
            }
        } catch (error) {
            console.error("Error fetching pharmacists:", error);
    
            if (error.response) {
                console.error("Server Error Response:", error.response);
                toast.error(error.response.data.message || "Error fetching pharmacists from the server.");
            } else if (error.request) {
                console.error("No response received:", error.request);
                toast.error("No response received from the server.");
            } else {
                console.error("Unexpected error:", error.message);
                toast.error("An unexpected error occurred.");
            }
        }
    };

    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
                headers: { token },
            });
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading user profile.");
        }
    };

    useEffect(() => {
        getDoctorsData();
        getPharmacistsData();
    }, []);

    useEffect(() => {
        if (token) {
            loadUserProfileData();
        }
    }, [token]);

    return (
        <AppContext.Provider
            value={{
                doctors,
                getDoctorsData,
                pharmacists,
                getPharmacistsData,
                currencySymbol,
                backendUrl,
                token,
                setToken,
                userData,
                setUserData,
                loadUserProfileData,
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;