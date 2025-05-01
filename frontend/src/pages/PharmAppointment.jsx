import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedPharmacists from '../components/RelatedPharmacists'; // Adjusted import for related pharmacists component
import axios from 'axios';
import { toast } from 'react-toastify';

const PharmAppointment = () => {
  const { pharmacistId } = useParams(); // Updated to pharmacistId
  const { pharmacists, currencySymbol, backendUrl, token, getPharmacistsData } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [pharmInfo, setPharmInfo] = useState(false); // Changed from docInfo to pharmInfo
  const [pharmSlots, setPharmSlots] = useState([]); // Changed from docSlots to pharmSlots
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const navigate = useNavigate();

  const fetchPharmInfo = async () => {
    const pharmInfo = pharmacists.find((pharm) => pharm._id === pharmacistId); // Updated to fetch pharmacist data
    setPharmInfo(pharmInfo);
  };

  const getAvailableSolts = async () => {
    setPharmSlots([]);
  
    // Getting current date
    let today = new Date();
  
    for (let i = 0; i < 7; i++) {
      // Getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
  
      // Setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);
  
      // Setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
  
      let timeSlots = [];
  
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
  
        const slotDate = `${day}_${month}_${year}`;
        const slotTime = formattedTime;
  
        const isSlotAvailable =
          !pharmInfo.slots_booked[slotDate] || !pharmInfo.slots_booked[slotDate].includes(slotTime);
  
        if (isSlotAvailable) {
          // Add slot to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }
  
        // Increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
  
      // Add the generated slots to pharmSlots
      if (timeSlots.length > 0) {
        console.log('Available slots for day:', i, timeSlots); // Log the available slots for each day
        setPharmSlots((prev) => [...prev, timeSlots]);
      }
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warning('Login to book appointment');
      return navigate('/login');
    }
  
    const date = pharmSlots[slotIndex][0].datetime;
  
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
  
    const slotDate = day + '_' + month + '_' + year;
  
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { pharmacistId, slotDate, slotTime, status: 'Pending' }, // Changed docId to pharmacistId
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getPharmacistsData();  // Refresh the pharmacist's data
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (pharmacists.length > 0) {
      fetchPharmInfo();
    }
  }, [pharmacists, pharmacistId]);

  useEffect(() => {
    if (pharmInfo) {
      getAvailableSolts();
    }
  }, [pharmInfo]);

  return pharmInfo ? (
    <div>
      {/* ---------- Pharmacist Details ----------- */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-blue-200 w-full sm:max-w-72 rounded-lg' src={pharmInfo.image} alt='' />
        </div>

        <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/* ----- Pharmacist Info: name, degree, experience ----- */}
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
            {pharmInfo.name} <img className='w-5' src={assets.verified_icon} alt='' />
          </p>
          <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p>
              {pharmInfo.degree} - {pharmInfo.speciality}
            </p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{pharmInfo.experience}</button>
          </div>

          {/* ----- Pharmacist About ----- */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>
              About <img className='w-3' src={assets.info_icon} alt='' />
            </p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{pharmInfo.about}</p>
          </div>

          <p className='text-gray-600 font-medium mt-4'>
            Appointment fee: <span className='text-gray-800'>{currencySymbol}{pharmInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* Booking slots */}
      <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {pharmSlots.length > 0 ? (
            pharmSlots.map((item, index) => (
              <div
                onClick={() => setSlotIndex(index)}
                key={index}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index ? 'bg-blue-200 text-black' : 'border border-[#DDDDDD]'
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

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {pharmSlots.length > 0 && pharmSlots[slotIndex].length > 0 ? (
            pharmSlots[slotIndex].map((item, index) => (
              <p
                onClick={() => setSlotTime(item.time)}
                key={index}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  item.time === slotTime ? 'bg-blue-200 text-black' : 'text-[#949494] border border-[#B4B4B4]'
                }`}
              >
                {item.time.toLowerCase()}
              </p>
            ))
          ) : (
            <p>No available slots for this date</p>
          )}
        </div>

        <button onClick={bookAppointment} className='bg-blue-200 text-black text-sm font-light px-20 py-3 rounded-full my-6'>
          Book an appointment
        </button>
      </div>

      {/* Listing Related Pharmacists */}
      <RelatedPharmacists speciality={pharmInfo.speciality} pharmacistId={pharmacistId} /> {/* Changed to RelatedPharmacists */}
    </div>
  ) : null;
};

export default PharmAppointment;