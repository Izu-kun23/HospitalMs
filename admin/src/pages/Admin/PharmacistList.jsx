import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const PharmacistList = () => {
  const { pharmacists, changePharmacistAvailability, aToken, getAllPharmacists } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllPharmacists();
    }
  }, [aToken]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Pharmacists</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {pharmacists.map((item, index) => (
          <div 
            key={index} 
            className="border border-[#C9D8FF] rounded-xl w-48 h-72 overflow-hidden cursor-pointer group shadow-md bg-white"
          >
            {/* Image with fixed size */}
            <img 
              className="w-40 h-40 object-cover mx-auto mt-2 rounded-lg" 
              src={item.image} 
              alt="Pharmacist" 
            />
            {/* Card Content */}
            <div className="p-4 text-center">
              <p className="text-[#262626] text-lg font-medium truncate">{item.name}</p>
              <p className="text-[#5C5C5C] text-sm truncate">{item.speciality}</p>
              <div className="mt-2 flex justify-center items-center gap-1 text-sm">
                <input 
                  onChange={() => changePharmacistAvailability(item._id)} 
                  type="checkbox" 
                  checked={item.available} 
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PharmacistList;