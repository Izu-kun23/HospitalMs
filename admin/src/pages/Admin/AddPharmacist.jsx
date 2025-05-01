import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AddPharmacist = () => {
  const [pharmacistImg, setPharmacistImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("Pharmaceutical Expert");
  const [degree, setDegree] = useState("");
  const [branchName, setBranchName] = useState("");
  const [branchLocation, setBranchLocation] = useState("");

  const { backendUrl } = useContext(AppContext);
  const { aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Validate form inputs before submitting
    if (!name || !email || !password || !fees || !degree || !branchName || !branchLocation || !about) {
      return toast.error("Please fill all the required fields.");
    }

    if (!pharmacistImg) {
      return toast.error("Image Not Selected");
    }

    if (!aToken) {
      return toast.error("Authentication token not found. Please log in again.");
    }

    try {
        const formData = new FormData();
        formData.append("image", pharmacistImg); // Image file
        formData.append("name", name);          // Other form data
        formData.append("email", email);
        formData.append("password", password);
        formData.append("experience", experience);
        formData.append("fees", Number(fees));
        formData.append("about", about);
        formData.append("speciality", speciality);
        formData.append("degree", degree);
        formData.append("branch", JSON.stringify({ name: branchName, location: branchLocation }));
        
        const { data } = await axios.post(`${backendUrl}/api/admin/add-pharmacist`, formData, {
            headers: { Authorization: `Bearer ${aToken}` }
        });

      

      if (data.success) {
        toast.success(data.message);
        // Reset form after success
        setPharmacistImg(false);
        setName("");
        setPassword("");
        setEmail("");
        setBranchName("");
        setBranchLocation("");
        setDegree("");
        setAbout("");
        setFees("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
      console.error(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Pharmacist</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="pharmacist-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={pharmacistImg ? URL.createObjectURL(pharmacistImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input onChange={(e) => setPharmacistImg(e.target.files[0])} type="file" name="" id="pharmacist-img" hidden />
          <p>Upload pharmacist <br /> picture</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Your name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Name"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Pharmacist Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-2"
                type="email"
                placeholder="Email"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Set Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border rounded px-3 py-2"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="border rounded px-2 py-2"
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="10+ Years">10+ Years</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Fees</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="border rounded px-3 py-2"
                type="number"
                placeholder="Consultation fees"
                required
              />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Speciality</p>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="border rounded px-2 py-2"
              >
                <option value="Pharmaceutical Expert">Pharmaceutical Expert</option>
                <option value="Clinical Pharmacist">Clinical Pharmacist</option>
                <option value="Retail Pharmacist">Retail Pharmacist</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Degree</p>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Degree"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Branch</p>
              <input
                onChange={(e) => setBranchName(e.target.value)}
                value={branchName}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Branch Name"
                required
              />
              <input
                onChange={(e) => setBranchLocation(e.target.value)}
                value={branchLocation}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Branch Location"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <p className="mt-4 mb-2">About Pharmacist</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full px-4 pt-2 border rounded"
            rows={5}
            placeholder="Write about the pharmacist"
          ></textarea>
        </div>

        <button type="submit" className="bg-blue-500 px-10 py-3 mt-4 text-white rounded-full">
          Add Pharmacist
        </button>
      </div>
    </form>
  );
};

export default AddPharmacist;