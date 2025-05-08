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
            const { data } = await axios.get(`${backendUrl}/api/pharmacists/pharm-list`);
            if (data.success) {
                setPharmacists(data.pharmacists);
            } else {
                toast.error(data.message || "Failed to fetch pharmacists.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching pharmacists.");
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

    const getPharmacistSlots = async (pharmacistId, date) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/pharmacists/${pharmacistId}/slots`, {
                params: { date },
            });
    
            if (data.success) {
                return data.slots;
            } else {
                toast.error(data.message || "Failed to fetch slots.");
                return [];
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching slots.");
            return [];
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
                getPharmacistSlots,
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;