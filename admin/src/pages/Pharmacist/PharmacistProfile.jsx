import React, { useContext, useEffect, useState } from 'react';
import { PharmacistContext } from '../../context/PharmacistContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const PharmacistProfile = () => {
    const { pToken, profileData, setProfileData, getProfileData } = useContext(PharmacistContext);
    const { currency, backendUrl } = useContext(AppContext);
    const [isEdit, setIsEdit] = useState(false);

    const updateProfile = async () => {
        try {
            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available,
                pharmacy: {
                    name: profileData.pharmacy?.name || '',
                    location: profileData.pharmacy?.location || '',
                }
            };

            const { data } = await axios.post(`${backendUrl}/api/pharmacist/update-profile`, updateData, {
                headers: { pToken },
            });

            if (data.success) {
                toast.success(data.message);
                setIsEdit(false);
                getProfileData();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error("Error updating profile.");
            console.error(error);
        }
    };

    useEffect(() => {
        if (pToken) {
            getProfileData();
        }
    }, [pToken]);

    return profileData && (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-5">
            {/* Profile Header */}
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center gap-6">
                    <img
                        className="w-32 h-32 object-cover rounded-full border-2 border-primary"
                        src={profileData.image}
                        alt="Pharmacist"
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{profileData.name}</h1>
                        <p className="text-gray-500 text-lg">{profileData.degree} - Pharmacist</p>
                        <p className="text-gray-400 mt-1">Experience: {profileData.experience} years</p>
                        <div className="flex gap-3 mt-4">
                            {isEdit && (
                                <button
                                    onClick={updateProfile}
                                    className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                                >
                                    Save Changes
                                </button>
                            )}
                            <button
                                onClick={() => setIsEdit((prev) => !prev)}
                                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            >
                                {isEdit ? "Cancel" : "Edit Profile"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Details Section */}
            <div className="w-full max-w-4xl mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* About Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800">About</h2>
                        {isEdit ? (
                            <textarea
                                onChange={(e) => setProfileData((prev) => ({ ...prev, about: e.target.value }))}
                                className="w-full mt-3 p-3 border rounded-lg"
                                rows={5}
                                value={profileData.about}
                            />
                        ) : (
                            <p className="text-gray-600 mt-3">{profileData.about}</p>
                        )}
                    </div>

                    {/* Pharmacy Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800">Pharmacy Information</h2>
                        <div className="mt-4">
                            <p className="text-sm font-semibold text-gray-500">Pharmacy Name</p>
                            {isEdit ? (
                                <input
                                    type="text"
                                    className="w-full mt-2 p-3 border rounded-lg"
                                    onChange={(e) =>
                                        setProfileData((prev) => ({
                                            ...prev,
                                            pharmacy: { ...prev.pharmacy, name: e.target.value },
                                        }))
                                    }
                                    value={profileData.pharmacy?.name || ''}
                                />
                            ) : (
                                <p className="text-gray-600">{profileData.pharmacy?.name}</p>
                            )}
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-semibold text-gray-500">Pharmacy Location</p>
                            {isEdit ? (
                                <textarea
                                    className="w-full mt-2 p-3 border rounded-lg"
                                    onChange={(e) =>
                                        setProfileData((prev) => ({
                                            ...prev,
                                            pharmacy: { ...prev.pharmacy, location: e.target.value },
                                        }))
                                    }
                                    value={profileData.pharmacy?.location || ''}
                                />
                            ) : (
                                <p className="text-gray-600">{profileData.pharmacy?.location}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Other Details */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-xl font-semibold text-gray-800">Other Details</h2>
                    <div className="mt-4"> 
                        <p className="text-sm font-semibold text-gray-500">Consultation Fee</p>
                        {isEdit ? (
                            <input
                                type="number"
                                className="w-full mt-2 p-3 border rounded-lg"
                                onChange={(e) => setProfileData((prev) => ({ ...prev, fees: e.target.value }))}
                                value={profileData.fees}
                            />
                        ) : (
                            <p className="text-gray-600">
                                {currency}{profileData.fees}
                            </p>
                        )}
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="availability"
                            onChange={() =>
                                isEdit &&
                                setProfileData((prev) => ({ ...prev, available: !prev.available }))
                            }
                            checked={profileData.available}
                        />
                        <label htmlFor="availability" className="text-gray-600">
                            Currently Available
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PharmacistProfile;