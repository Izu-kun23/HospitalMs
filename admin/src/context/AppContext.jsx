import React, { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY; // Ensure these are set in your .env file
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  // Function to format the date (20_01_2000 => 20 Jan 2000)
  const slotDateFormat = (slotDate) => {
    if (!slotDate || typeof slotDate !== "string") return "Invalid date"; // Handle invalid input
    const dateArray = slotDate.split("_");
    if (dateArray.length !== 3) return "Invalid date format"; // Ensure the date format is correct

    const [day, month, year] = dateArray;
    // Validate month
    if (Number(month) < 1 || Number(month) > 12) return "Invalid month";
    return `${day} ${months[Number(month) - 1]} ${year}`;
  };

  // Function to calculate the age (20_01_2000 => 24)
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    if (isNaN(birthDate)) return "Invalid date"; // Handle invalid date
    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  // Value to be provided to all components consuming this context
  const value = {
    backendUrl,
    currency,
    slotDateFormat,
    calculateAge,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children} {/* Rendering children components */}
    </AppContext.Provider>
  );
};

export default AppContextProvider;