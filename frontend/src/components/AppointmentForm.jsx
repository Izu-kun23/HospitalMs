import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AppointmentForm = () => {
  const { appointmentId } = useParams(); // Get the appointment ID from the URL params
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    symptoms: '',
    notes: ''
  });

  useEffect(() => {
    // Optionally, fetch appointment data or user details if needed
  }, [appointmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Post form data to your backend endpoint
      const response = await axios.post(`/api/appointment-form/${appointmentId}`, formData);
      if (response.data.success) {
        toast.success('Form submitted successfully!');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Appointment Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Symptoms:</label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div>
          <label>Additional Notes:</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
