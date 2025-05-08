import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedPharmacists from "../components/RelatedPharmacists";
import axios from "axios";
import { toast } from "react-toastify";

const PharmAppointment = () => {
  const { pharmacistId } = useParams();
  const {
    pharmacists,
    currencySymbol,
    backendUrl,
    token,
    getPharmacistsData,
  } = useContext(AppContext);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [pharmInfo, setPharmInfo] = useState(null);
  const [pharmSlots, setPharmSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const navigate = useNavigate();

  // Fetch pharmacist info
  useEffect(() => {
    if (pharmacists.length > 0) {
      const foundPharm = pharmacists.find(
        (pharm) => pharm._id === pharmacistId
      );
      setPharmInfo(foundPharm || null);
    }
  }, [pharmacists, pharmacistId]);

  // Fetch available slots
  useEffect(() => {
    if (pharmInfo && Object.keys(pharmInfo).length > 0) {
      getAvailableSlots();
    }
  }, [pharmInfo]);

  const getAvailableSlots = () => {
    setPharmSlots([]);
    let today = new Date();
    let allSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const slotDate = `${day}_${month}_${year}`;

        const isSlotAvailable =
          !pharmInfo?.slots_booked?.[slotDate] ||
          !pharmInfo.slots_booked[slotDate].includes(formattedTime);

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      if (timeSlots.length > 0) {
        allSlots.push(timeSlots);
      }
    }

    setPharmSlots(allSlots);
  };

  const bookPharmAppointment = async () => {
    if (!token) {
      toast.warning("Login to book an appointment");
      return navigate("/login");
    }

    if (!slotTime) {
      toast.error("Please select a time slot before booking.");
      return;
    }

    const date = pharmSlots[slotIndex]?.[0]?.datetime;

    if (!date) {
      toast.error("Invalid date selected.");
      return;
    }

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const slotDate = `${day}_${month}_${year}`;

    const payload = {
      slotDate,
      slotTime,
      status: "Pending",
      pharmacistId, // ✅ Fix: Include pharmacist ID
    };

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-pharm-appointment`,
        payload,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await getPharmacistsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message || "Booking failed.");
      }
    } catch (error) {
      console.error("Booking Error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Error booking appointment."
      );
    }
  };

  return pharmInfo ? (
    <div>
      {/* Pharmacist Details */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className="bg-blue-200 w-full sm:max-w-72 rounded-lg"
            src={pharmInfo.image}
            alt={pharmInfo.name}
          />
        </div>

        <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {pharmInfo.name}{" "}
            <img className="w-5" src={assets.verified_icon} alt="Verified" />
          </p>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>
              {pharmInfo.degree} - {pharmInfo.speciality}
            </p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {pharmInfo.experience}
            </button>
          </div>

          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-[#262626] mt-3">
              About <img className="w-3" src={assets.info_icon} alt="Info" />
            </p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">
              {pharmInfo.about}
            </p>
          </div>

          <p className="text-gray-600 font-medium mt-4">
            Appointment fee:{" "}
            <span className="text-gray-800">
              {currencySymbol}
              {pharmInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
        <p>Booking slots</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {pharmSlots.length > 0 ? (
            pharmSlots.map((item, index) => (
              <div
                onClick={() => setSlotIndex(index)}
                key={index}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index
                    ? "bg-blue-200 text-black"
                    : "border border-[#DDDDDD]"
                }`}
              >
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          ) : (
            <p>No available slots</p>
          )}
        </div>

        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {pharmSlots.length > 0 && pharmSlots[slotIndex]?.length > 0 ? (
            pharmSlots[slotIndex].map((item, index) => (
              <p
                onClick={() => setSlotTime(item.time)}
                key={index}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  item.time === slotTime
                    ? "bg-blue-200 text-black"
                    : "text-[#949494] border border-[#B4B4B4]"
                }`}
              >
                {item.time}
              </p>
            ))
          ) : (
            <p>No available slots for this date</p>
          )}
        </div>

        <button
          onClick={bookPharmAppointment}
          className="bg-blue-200 text-black text-sm font-light px-20 py-3 rounded-full my-6"
        >
          Book an appointment
        </button>
      </div>

      <RelatedPharmacists
        speciality={pharmInfo.speciality}
        pharmacistId={pharmacistId}
      />
    </div>
  ) : null;
};

export default PharmAppointment;