import React, { useState, useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

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
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {selected}
        <svg
          className={`w-4 h-4 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div
          className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-lg ring-1 ring-black/10 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                className={`block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 ${
                  selected === option ? "bg-gray-100 font-semibold" : ""
                }`}
                onClick={() => handleSelect(option)}
                role="menuitem"
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

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    acceptAppointment,
    cancelAppointment,
    completeAppointment,
  } = useContext(DoctorContext);
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

  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch appointments on component mount
  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken, getAppointments]);

  // Filter and search appointments
  useEffect(() => {
    console.log("Appointments:", appointments); // Debug log to check fetched appointments
    const filtered = appointments.filter((appointment) => {
      const matchesSearch =
        appointment.userData?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        `${slotDateFormat(appointment.slotDate)} ${appointment.slotTime}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        (filter === "Accepted" && appointment.accepted) ||
        (filter === "Pending" && !appointment.accepted) ||
        (filter === "Completed" && appointment.isCompleted) ||
        (filter === "Cancelled" && appointment.cancelled);

      return matchesSearch && matchesFilter;
    });

    setFilteredAppointments(filtered);
  }, [searchTerm, appointments, filter, slotDateFormat]);

  // Helper function to generate a calendar grid
  const generateCalendar = (currentMonth, currentYear) => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInMonth = [...Array(lastDateOfMonth)].map((_, i) => i + 1);

    // Fill the calendar with empty days before the first day of the month
    const calendarDays = Array(firstDayOfMonth).fill(null).concat(daysInMonth);

    // Split into rows of 7 days
    const weeks = [];
    while (calendarDays.length) {
      weeks.push(calendarDays.splice(0, 7));
    }

    return weeks;
  };

  const handleDayClick = (day) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day));
  };

  const calendarWeeks = generateCalendar(selectedDate.getMonth(), selectedDate.getFullYear());

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Patient Name or Appointment Date"
          className="w-full sm:w-2/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Filter Dropdown */}
        <FilterDropdown
          options={filterOptions}
          selected={filter}
          setSelected={setFilter}
        />
      </div>

      {/* Calendar Layout */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
          <div key={idx} className="text-center font-semibold text-gray-600">
            {day}
          </div>
        ))}
        {calendarWeeks.map((week, idx) => (
          <React.Fragment key={idx}>
            {week.map((day, idx) => (
              <div
                key={idx}
                className={`p-2 border rounded-lg cursor-pointer ${
                  !day
                    ? "text-transparent"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => day && handleDayClick(day)}
              >
                <div className="text-center">{day}</div>
                {filteredAppointments
                  .filter((appointment) => new Date(appointment.slotDate).getDate() === day)
                  .map((appointment, index) => (
                    <div key={index} className="text-xs text-gray-500">
                      <span>{appointment.userData?.name}</span> <br />
                      <span>{appointment.slotTime}</span>
                    </div>
                  ))}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Appointment Details for Selected Day */}
      <div className="bg-white border rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold p-4">Appointments on {selectedDate.toDateString()}</h3>
        <div className="divide-y">
          {filteredAppointments
            .filter((appointment) =>
              new Date(appointment.slotDate).toDateString() === selectedDate.toDateString()
            )
            .map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 text-sm text-gray-700"
              >
                <p>{item.userData?.name}</p>
                <p>{item.slotTime}</p>
                {/* Actions */}
                {item.cancelled ? (
                  <p className="text-red-500 font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 font-medium">Completed</p>
                ) : (
                  <div className="flex gap-2">
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
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;