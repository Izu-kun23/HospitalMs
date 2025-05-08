import React, { useState, useContext, useEffect } from "react";
import { PharmacistContext } from "../../context/PharmacistContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { IoMailOutline } from "react-icons/io5";
import { toast } from "react-toastify";

// Dropdown Component
const FilterDropdown = ({ options, selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-full max-w-[12rem] text-left">
      <button
        type="button"
        className="flex w-full justify-between items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:ring-2 focus:ring-primary focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected}
        <svg
          className={`w-4 h-4 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-lg ring-1 ring-black/10">
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                className={`block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 ${
                  selected === option ? "bg-gray-100 font-semibold" : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component
const PharmacistAppointments = () => {
  const {
    pToken,
    pharmappointments = [],
    getPharmAppointments,
    acceptAppointment,
    cancelAppointment,
    completeAppointment,
  } = useContext(PharmacistContext);

  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState("All");

  const filterOptions = [
    "All",
    "Accepted",
    "Pending",
    "Completed",
    "Cancelled",
  ];

  // Fetch appointments when token is available
  useEffect(() => {
    if (pToken) getPharmAppointments();
  }, [pToken]);

  // Filter appointments based on search and filter
  useEffect(() => {
    const filtered = pharmappointments.filter((appointment) => {
      const matchesSearch =
        appointment.userData?.name
          ?.toLowerCase()
          ?.includes(searchTerm.toLowerCase()) ||
        `${slotDateFormat(appointment.slotDate)} ${appointment.slotTime}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        (filter === "Accepted" && appointment.accepted) ||
        (filter === "Pending" &&
          !appointment.accepted &&
          !appointment.cancelled &&
          !appointment.isCompleted) ||
        (filter === "Completed" && appointment.isCompleted) ||
        (filter === "Cancelled" && appointment.cancelled);

      return matchesSearch && matchesFilter;
    });

    setFilteredAppointments(filtered);
  }, [searchTerm, pharmappointments, filter]);

  // Handle Accept
  const handleAcceptAppointment = async (appointmentId) => {
    try {
      await acceptAppointment(appointmentId);
      getPharmAppointments();
      toast.success("Appointment accepted successfully.");
    } catch {
      toast.error("Failed to accept the appointment.");
    }
  };

  // Handle Cancel
  const handleCancelAppointment = async (appointmentId) => {
    try {
      await cancelAppointment(appointmentId);
      getPharmAppointments();
      toast.success("Appointment cancelled successfully.");
    } catch {
      toast.error("Failed to cancel the appointment.");
    }
  };

  // Handle Complete
  const handleCompleteAppointment = async (appointmentId) => {
    try {
      await completeAppointment(appointmentId);
      getPharmAppointments();
      toast.success("Appointment marked as completed.");
    } catch {
      toast.error("Failed to complete the appointment.");
    }
  };

  // Handle Send Email
  const handleSendEmail = (email, name) => {
    if (!email) {
      toast.error("No email found for this patient.");
      return;
    }

    const subject = encodeURIComponent("Appointment Cancellation Notice");
    const body = encodeURIComponent(
      `Dear ${name},\n\nWe regret to inform you that your appointment has been canceled. Please contact us if you have any questions.\n\nBest regards,\nYour Pharmacy`
    );

    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
      "_blank"
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Patient Name or Date"
          className="w-full sm:w-2/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterDropdown
          options={filterOptions}
          selected={filter}
          setSelected={setFilter}
        />
      </div>

      <div className="bg-white border rounded-lg shadow-sm">
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-4 py-4 px-6 border-b bg-gray-100 text-gray-600 text-sm font-medium">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        <div className="divide-y">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((item, index) => (
              <div
                key={item._id}
                className="flex flex-col sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-4 py-4 px-6 items-center text-sm text-gray-700 hover:bg-gray-50"
              >
                <p>{index + 1}</p>

                <div className="flex items-center gap-3">
                  <img
                    src={item.userData?.image || assets.default_user_image}
                    className="w-10 h-10 rounded-full"
                    alt="Patient"
                  />
                  <p>{item.userData?.name || "Unknown"}</p>
                </div>

                <p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.payment
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {item.payment ? "Online" : "CASH"}
                  </span>
                </p>

                <p>
                  {item.userData?.dob
                    ? `${calculateAge(item.userData.dob)} years`
                    : "N/A"}
                </p>

                <p>
                  {slotDateFormat(item.slotDate)} <br />
                  <span className="text-xs text-gray-500">{item.slotTime}</span>
                </p>

                <p>
                  {currency}
                  {item.amount || "0"}
                </p>

                <div className="flex items-center gap-2">
                  {item.cancelled ? (
                    <>
                      <p className="text-red-500 font-medium">Cancelled</p>
                      <IoMailOutline
                        onClick={() =>
                          handleSendEmail(
                            item.userData?.email,
                            item.userData?.name
                          )
                        }
                        className="w-6 h-6 cursor-pointer hover:text-red-700"
                        title="Send Email"
                      />
                    </>
                  ) : item.isCompleted ? (
                    <p className="text-green-500 font-medium">Completed</p>
                  ) : item.accepted ? (
                    <>
                      <img
                        onClick={() => handleCancelAppointment(item._id)}
                        className="w-8 h-8 cursor-pointer"
                        src={assets.cancel_icon}
                        alt="Cancel"
                        title="Cancel"
                      />
                      <img
                        onClick={() => handleCompleteAppointment(item._id)}
                        className="w-8 h-8 cursor-pointer"
                        src={assets.tick_icon}
                        alt="Complete"
                        title="Mark as Completed"
                      />
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAcceptAppointment(item._id)}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleCancelAppointment(item._id)}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-gray-600">
              No appointments found matching your criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacistAppointments;