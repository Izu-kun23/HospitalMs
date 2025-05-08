import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";
import { PharmacistContext } from "./context/PharmacistContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes, Navigate } from "react-router-dom"; // import Navigate for redirection
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import DoctorCalendar from "./pages/Doctor/DoctorCalendar";
import Payments from "./pages/Admin/Payments";
import AddPharmacist from "./pages/Admin/AddPharmacist";
import PharmacistList from "./pages/Admin/PharmacistList";
import PharmacistDashboard from "./pages/Pharmacist/PharmacistDashboard"; 
import PharmacistProfile from "./pages/Pharmacist/PharmacistProfile";
import PharmacistAppointments from "./pages/Pharmacist/PharmacistAppointments";
const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  const { pToken } = useContext(PharmacistContext);

  // If neither token exists, redirect to login
  if (!aToken && !dToken && !pToken) {
    return (
      <>
        <Login />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer />
      <Navbar />
      <div className="flex min-h-screen">
        {/* Sidebar is always visible on the left side */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 p-5 overflow-y-auto">
          <Routes>
            <Route
              path="/"
              element={
                aToken ? (
                  <Navigate to="/admin-dashboard" />
                ) : dToken ? (
                  <Navigate to="/doctor-dashboard" />
                ) : pToken ? (
                  <Navigate to="/pharmacist-dashboard" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/all-appointments" element={<AllAppointments />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/add-pharmacist" element={<AddPharmacist />} />
            <Route path="/doctor-list" element={<DoctorsList />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/pharmacist-list" element={<PharmacistList />} />

            {/* Doctor Routes */}
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor-appointments" element={<DoctorAppointments />} />
            <Route path="/doctor-profile" element={<DoctorProfile />} />
            <Route path="/doctor-calendar" element={<DoctorCalendar />} />

            {/* Pharmacist Routes */}
            {pToken && (
              <>
                <Route path="/pharmacist-dashboard" element={<PharmacistDashboard />} />
                <Route path="/pharmacist-appointment" element={<PharmacistAppointments />} />
                <Route path="/pharmacist-profile" element={<PharmacistProfile />} />

                {/* Add other pharmacist routes as needed */}
              </>
            )}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;