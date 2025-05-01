import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';

const Pharmacists = () => {
  const { speciality } = useParams();

  const [filterPharm, setFilterPharm] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const { pharmacists } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterPharm(pharmacists.filter(pharm => pharm.speciality === speciality));
    } else {
      setFilterPharm(pharmacists);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [pharmacists, speciality]);

  return (
    <div>
      <p className="text-gray-600">Browse through the pharmacists' specialties.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? 'bg-primary text-white' : ''
          }`}
        >
          Filters
        </button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p
            onClick={() =>
              speciality === 'Pharmaceutical Expert'
                ? navigate('/pharmacists')
                : navigate('/pharmacists/Pharmaceutical Expert')
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === 'Pharmaceutical Expert' ? 'bg-[#E2E5FF] text-black ' : ''
            }`}
          >
            Pharmaceutical Expert
          </p>
          <p
            onClick={() =>
              speciality === 'Clinical Pharmacist'
                ? navigate('/pharmacists')
                : navigate('/pharmacists/Clinical Pharmacist')
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === 'Clinical Pharmacist' ? 'bg-[#E2E5FF] text-black ' : ''
            }`}
          >
            Clinical Pharmacist
          </p>
          <p
            onClick={() =>
              speciality === 'Retail Pharmacist'
                ? navigate('/pharmacists')
                : navigate('/pharmacists/Retail Pharmacist')
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === 'Retail Pharmacist' ? 'bg-[#E2E5FF] text-black ' : ''
            }`}
          >
            Retail Pharmacist
          </p>
        </div>

        {/* Pharmacist Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterPharm.map((item, index) => (
            <div
              onClick={() => {
                navigate(`/pharm-appointment/${item._id}`);
                scrollTo(0, 0);
              }}
              className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-5px] transition-all duration-300 bg-white shadow-md w-[250px] h-[350px] flex flex-col"
              key={index}
            >
              {/* Image Section */}
              <div className="w-full h-[150px] bg-[#EAEFFF]">
                <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
              </div>

              {/* Content Section */}
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <div
                    className={`flex items-center gap-2 text-sm text-center ${
                      item.available ? 'text-green-500' : 'text-gray-500'
                    }`}
                  >
                    <p
                      className={`w-2 h-2 rounded-full ${
                        item.available ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    ></p>
                    <p>{item.available ? 'Available' : 'Not Available'}</p>
                  </div>
                  <p className="text-[#262626] text-lg font-medium">{item.name}</p>
                  <p className="text-[#5C5C5C] text-sm">{item.speciality}</p>
                </div>

                {/* Book Appointment Button */}
                <button
                  className="mt-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pharmacists;