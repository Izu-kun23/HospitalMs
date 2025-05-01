import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DoctorsList = () => {
  const { doctors, archivedDoctors, changeAvailability, archiveDoctor, deleteDoctor, aToken, getAllDoctors } = useContext(AdminContext);
  const [showArchived, setShowArchived] = useState(false); // Toggle state

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  // Handle Doctor Deletion
  const handleDelete = (doctorId) => {
    if (window.confirm("Are you sure you want to delete this doctor permanently?")) {
      deleteDoctor(doctorId);
    }
  };

  // Handle Doctor Archiving
  const handleArchive = (doctorId) => {
    if (window.confirm("Are you sure you want to archive this doctor?")) {
      archiveDoctor(doctorId);
    }
  };

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll flex flex-col justify-between">
      <h1 className="text-lg font-medium">
        {showArchived ? "Archived Doctors" : "All Active Doctors"}
      </h1>

      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {(showArchived ? archivedDoctors : doctors).map((item, index) => (
          <div 
            key={index} 
            className="border border-[#C9D8FF] rounded-xl w-48 h-80 overflow-hidden cursor-pointer group shadow-md bg-white flex flex-col justify-between"
          >
            {/* Doctor Image */}
            <img 
              className="w-40 h-40 object-cover mx-auto mt-2 rounded-lg" 
              src={item.image} 
              alt="Doctor" 
            />

            {/* Doctor Details */}
            <div className="p-3 text-center flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[#262626] text-lg font-medium truncate">{item.name}</p>
                <p className="text-[#5C5C5C] text-sm truncate">{item.speciality}</p>
              </div>

              {/* Availability Toggle */}
              {!showArchived && (
                <div className="mt-2 flex justify-center items-center gap-1 text-sm">
                  <input 
                    onChange={() => changeAvailability(item._id)} 
                    type="checkbox" 
                    checked={item.available} 
                  />
                  <p>Available</p>
                </div>
              )}

              {/* Archive & Delete Buttons */}
              <div className="mt-3 flex justify-between">
                {!showArchived && (
                  <button 
                    onClick={() => handleArchive(item._id)} 
                    className="text-yellow-600 border border-yellow-600 px-2 py-1 rounded-md text-xs hover:bg-yellow-100"
                  >
                    Archive
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(item._id)} 
                  className="text-red-600 border border-red-600 px-2 py-1 rounded-md text-xs hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Show message if no doctors found */}
        {showArchived && archivedDoctors.length === 0 && <p className="text-gray-500">No archived doctors.</p>}
        {!showArchived && doctors.length === 0 && <p className="text-gray-500">No active doctors.</p>}
      </div>

      {/* Toggle Button at the Bottom */}
      <div className="flex justify-center items-center mt-6">
        <p className="text-gray-700 mr-2">Archived Doctors</p>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={showArchived} 
            onChange={() => setShowArchived(!showArchived)} 
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
        </label>
      </div>
    </div>
  );
};

export default DoctorsList;