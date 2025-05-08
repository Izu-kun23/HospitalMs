import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { PharmacistContext } from '../../context/PharmacistContext';
import { AppContext } from '../../context/AppContext';


const PharmacistDashboard = () => {
  // Mock Data for Testing UI
  const [dashData, setDashData] = useState({
    earnings: 1500,
    prescriptions: 45,
    orders: 30,
    latestOrders: [
      {
        _id: 1,
        userData: { name: 'John Doe', image: assets.default_user_image },
        orderDate: '2025-03-10',
        cancelled: false,
        isCompleted: false,
      },
      {
        _id: 2,
        userData: { name: 'Jane Smith', image: assets.default_user_image },
        orderDate: '2025-03-09',
        cancelled: true,
        isCompleted: false,
      },
      {
        _id: 3,
        userData: { name: 'Alice Johnson', image: assets.default_user_image },
        orderDate: '2025-03-08',
        cancelled: false,
        isCompleted: true,
      },
    ],
  });

  return (
    <div className="flex">

      {/* Main Dashboard Content */}
      <div className="flex-1 p-5">
        <div className="flex flex-wrap gap-3">
          {/* Earnings Card */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.earning_icon} alt="Earnings Icon" />
            <div>
              <p className="text-xl font-semibold text-gray-600">${dashData.earnings}</p>
              <p className="text-gray-400">Earnings</p>
            </div>
          </div>

          {/* Total Prescriptions Card */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.appointments_icon} alt="Prescriptions Icon" />
            <div>
              <p className="text-xl font-semibold text-gray-600">{dashData.prescriptions}</p>
              <p className="text-gray-400">Prescriptions</p>
            </div>
          </div>

          {/* Total Orders Card */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.orders_icon} alt="Orders Icon" />
            <div>
              <p className="text-xl font-semibold text-gray-600">{dashData.orders}</p>
              <p className="text-gray-400">Total Orders</p>
            </div>
          </div>
        </div>

        {/* Latest Orders Section */}
        <div className="bg-white mt-10 border rounded">
          <div className="flex items-center gap-2.5 px-4 py-4 border-b">
            <img src={assets.list_icon} alt="List Icon" />
            <p className="font-semibold">Latest Orders</p>
          </div>

          <div className="pt-4">
            {dashData.latestOrders.length > 0 ? (
              dashData.latestOrders.map((item, index) => (
                <div key={index} className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100 border-b">
                  {/* Profile Image */}
                  <img className="w-12 h-12 rounded-full border" src={item.userData.image} alt="User" />

                  {/* Order Info */}
                  <div className="flex-1 text-sm">
                    <p className="text-gray-800 font-medium">{item.userData.name}</p>
                    <p className="text-gray-600">Ordered on {item.orderDate}</p>
                  </div>

                  {/* Order Status */}
                  {item.cancelled ? (
                    <p className="text-red-400 text-xs font-medium">Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className="text-green-500 text-xs font-medium">Completed</p>
                  ) : (
                    <div className="flex">
                      <img className="w-10 cursor-pointer" src={assets.cancel_icon} alt="Cancel" />
                      <img className="w-10 cursor-pointer" src={assets.tick_icon} alt="Complete" />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;