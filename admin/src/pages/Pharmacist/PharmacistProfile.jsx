import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { PharmacistContext } from '../../context/PharmacistContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const PharmacistProfile = () => {
    const { getProfileData, profileData, setProfileData, pToken } = useContext(PharmacistContext);
    const { backendUrl } = useContext(AppContext);
    const [isEdit, setIsEdit] = useState(false);

    const updateProfile = async () => {
        try {
            const updateData = {
                address: profileData.address,
                available: profileData.available,
                about: profileData.about,
            };

            const { data } = await axios.post(`${backendUrl}/api/pharmacists/update-profile`, updateData, {
                headers: { Authorization: `Bearer ${pToken}` }, // ✅ Correct header
            });

            if (data.success) {
                toast.success(data.message);
                setIsEdit(false);
                getProfileData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        }
    };

    useEffect(() => {
        if (pToken) getProfileData();
    }, [pToken]);

    if (!profileData) return null;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="bg-white shadow-md rounded-2xl p-6">
                <h1 className="text-3xl font-semibold mb-4 text-blue-700">Pharmacist Profile</h1>
                <div className="space-y-5">

                    <div>
                        <label className="block text-gray-700 font-medium">Name:</label>
                        <p className="mt-1 text-lg">{profileData.name}</p>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">About:</label>
                        {isEdit ? (
                            <textarea
                                className="w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={profileData.about}
                                rows={4}
                                onChange={(e) => setProfileData((prev) => ({ ...prev, about: e.target.value }))}
                            />
                        ) : (
                            <p className="mt-1 text-gray-800">{profileData.about}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Address:</label>
                        {isEdit ? (
                            <input
                                type="text"
                                className="w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={profileData.address}
                                onChange={(e) => setProfileData((prev) => ({ ...prev, address: e.target.value }))}
                            />
                        ) : (
                            <p className="mt-1 text-gray-800">{profileData.address}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="available"
                            className="h-5 w-5 text-blue-600"
                            checked={profileData.available}
                            onChange={() => isEdit && setProfileData((prev) => ({ ...prev, available: !prev.available }))}
                        />
                        <label htmlFor="available" className="text-gray-700">Available</label>
                    </div>

                    <div className="flex gap-4 mt-6">
                        {isEdit && (
                            <button
                                onClick={updateProfile}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition"
                            >
                                Save Changes
                            </button>
                        )}
                        <button
                            onClick={() => setIsEdit((prev) => !prev)}
                            className={`px-6 py-2 rounded-xl transition ${
                                isEdit ? "bg-gray-300 hover:bg-gray-400" : "bg-yellow-500 hover:bg-yellow-600 text-white"
                            }`}
                        >
                            {isEdit ? "Cancel" : "Edit Profile"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PharmacistProfile;