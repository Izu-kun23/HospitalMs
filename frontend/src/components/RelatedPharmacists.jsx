import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const RelatedPharmacists = ({ speciality, pharmacistId }) => {
    const navigate = useNavigate();
    const { pharmacists } = useContext(AppContext);

    const [relPharm, setRelPharm] = useState([]);

    useEffect(() => {
        if (pharmacists.length > 0 && speciality) {
            const pharmacistsData = pharmacists.filter(
                (pharm) => pharm.speciality === speciality && pharm._id !== pharmacistId
            );
            setRelPharm(pharmacistsData);
        }
    }, [pharmacists, speciality, pharmacistId]);

    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold">Related Pharmacists</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {relPharm.length > 0 ? (
                    relPharm.map((pharmacist) => (
                        <div
                            key={pharmacist._id}
                            className="border p-4 rounded-lg shadow-md hover:shadow-lg"
                        >
                            <img
                                src={pharmacist.image}
                                alt={pharmacist.name}
                                className="w-full h-40 object-cover rounded-lg"
                            />
                            <h4 className="mt-2 text-xl font-semibold">{pharmacist.name}</h4>
                            <p className="text-gray-600">{pharmacist.speciality}</p>
                            <button
                                onClick={() => navigate(`/pharm-appointment/${pharmacist._id}`)}
                                className="mt-3 bg-blue-200 text-black px-4 py-2 rounded-full"
                            >
                                Book Appointment
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">No related pharmacists found.</p>
                )}
            </div>
        </div>
    );
};

export default RelatedPharmacists;