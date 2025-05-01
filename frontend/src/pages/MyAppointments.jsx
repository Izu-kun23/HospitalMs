import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDateFormat = (slotDate) => {
      if (!slotDate || slotDate.split("_").length !== 3) {
        return "Invalid date format";  // Return a fallback value if the date format is invalid
      }
  
      const dateArray = slotDate.split("_");
      const day = dateArray[0];
      const monthIndex = Number(dateArray[1]) - 1;  // Correcting month indexing (0-based)
      const year = dateArray[2];
  
      if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
        return "Invalid month";  // Check for valid month index
      }
  
      const month = months[monthIndex];
  
      if (!month) {
        return "Invalid month";  // Handle the case where the month is invalid
      }
  
      if (isNaN(day) || day < 1 || day > 31) {
        return "Invalid day";  // Check for valid day (you can enhance this check for month-specific days)
      }
  
      return `${day} ${month} ${year}`;
    };
  

   // Getting User Appointments Data Using API
   const getUserAppointments = async () => {
    try {

        const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
        setAppointments(data.appointments.reverse())

    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
}

  const Modal = ({ isVisible, onConfirm, onCancel, message }) => {
    if (!isVisible) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <p className="text-gray-800 text-lg font-medium">{message}</p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TermsModal = ({ isVisible, onConfirm, onCancel }) => {
    if (!isVisible) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-gray-800 text-lg font-semibold">
            Terms and Conditions
          </h3>
          <p className="text-gray-600 text-sm mt-4">
            By proceeding with the payment, you agree to our terms and
            conditions:
          </p>
          <ul className="text-gray-600 text-sm list-disc ml-5 mt-2">
            <li>
              Payments are non-refundable except in case of cancellations by the
              service provider.
            </li>
            <li>
              Ensure the appointment details are correct before proceeding with
              the payment.
            </li>
            <li>Any disputes should be raised within 48 hours of payment.</li>
          </ul>
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Accept & Proceed
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Function to cancel appointment Using API
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

    const handlePayOnlineClick = (appointmentId) => {
    setPayment(appointmentId);
    setShowTermsModal(true);
  };

  const handleCancelClick = (appointmentId) => {
    setSelectedAppointment(appointmentId);
    setShowModal(true);
  };

  const confirmCancellation = () => {
    cancelAppointment(selectedAppointment);
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const confirmTermsAndProceed = () => {
    setShowTermsModal(false);
    if (payment) {
      appointmentStripe(payment); // or appointmentStripe(payment), depending on payment method chosen
    }
  };


 

  // Function to make payment using stripe
  const appointmentStripe = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-stripe",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">
        My appointments
      </p>
      <div className="">
        {appointments.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
          >
            <div>
              <img
                className="w-36 bg-[#EAEFFF]"
                src={item.docData?.image || "/path/to/default-image.jpg"} // Fallback image
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-[#5E5E5E]">
              <p className="text-[#262626] text-base font-semibold">
                {item.docData?.name || "Doctor Name Unavailable"}{" "}
                {/* Fallback name */}
              </p>
              <p>{item.docData?.speciality || "Speciality Unavailable"}</p>
              <p className="text-[#464646] font-medium mt-1">Address:</p>
              <p>
                {item.docData?.branch?.name || "Branch Name Unavailable"}{" "}
                {/* Fallback branch name */}
              </p>
              <p>
                {item.docData?.branch?.location ||
                  "Branch Location Unavailable"}{" "}
                {/* Fallback branch location */}
              </p>
              <p className=" mt-1">
                <span className="text-sm text-[#3C3C3C] font-medium">
                  Date & Time:
                </span>{" "}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end text-sm text-center">
               {!item.cancelled &&
                !item.payment &&
                !item.isCompleted &&
                !item.accepted && (
                  <button
                    disabled
                    className="text-[#696969] sm:min-w-48 py-2 border rounded cursor-not-allowed"
                  >
                    Waiting for Doctor's Confirmation
                  </button>
                )}
              {!item.cancelled &&
                !item.payment &&
                !item.isCompleted &&
                item.accepted && (
                  <button
                    onClick={() => handlePayOnlineClick(item._id)}
                    className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-blue-300 hover:text-white transition-all duration-300"
                  >
                    Pay Online
                  </button>
                )}
              {!item.cancelled &&
                !item.payment &&
                !item.isCompleted &&
                payment === item._id && (
                  <button
                    onClick={() => appointmentStripe(item._id)}
                    className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center"
                  >
                    <img
                      className="max-w-20 max-h-5"
                      src={assets.stripe_logo}
                      alt=""
                    />
                  </button>
                )}
              {!item.cancelled &&
                !item.payment &&
                !item.isCompleted &&
                payment === item._id && (
                  <button
                    onClick={() => appointmentRazorpay(item._id)}
                    className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center"
                  >
                    <img
                      className="max-w-20 max-h-5"
                      src={assets.razorpay_logo}
                      alt=""
                    />
                  </button>
                )}
              {!item.cancelled && item.payment && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border rounded text-[#696969]  bg-[#EAEFFF]">
                  Paid
                </button>
              )}

              {item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                  Completed
                </button>
              )}

              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => handleCancelClick(item._id)}
                  className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel appointment
                </button>
              )}
              {item.cancelled && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                  Appointment cancelled
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isVisible={showModal}
        onConfirm={confirmCancellation}
        onCancel={() => setShowModal(false)}
        message="Are you sure you want to cancel this appointment?"
      />

      <TermsModal
        isVisible={showTermsModal}
        onConfirm={confirmTermsAndProceed}
        onCancel={() => setShowTermsModal(false)}
      />
    </div>
  );
};

export default MyAppointments;





