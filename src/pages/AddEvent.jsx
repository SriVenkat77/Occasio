import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { io } from "socket.io-client";



export default function AddEvent() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    owner: user ? user.name : "",
    title: "",
    description: "",
    organizedBy: "",
    eventDate: "",
    eventTime: "",
    location: "",
    ticketPrice: 0,
    likes: 0,
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      setFormData((prevState) => ({
        ...prevState,
        image: e.target.files[0],
      }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = new FormData();
    Object.keys(formData).forEach((key) => {
      eventData.append(key, formData[key]);
    });
  
    try {
      await axios.post("https://twooccasio.onrender.com/events", eventData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      toast.success("Event created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create event. Please try again.");
    }
  };

  useEffect(() => {
    const socket = io("https://twooccasio.onrender.com"); // Backend URL
  
    socket.on("newEvent", (data) => {
      toast.info(data.message);
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-gradient-to-b from-primarydark to-primarylight p-4 text-white flex justify-between items-center">
        <Link to={'/admin'} className="flex items-center">
        <img src="src/assets/occasio1.png" alt="" className="w-10 h-10"/>
          <span className="ml-2 text-lg font-bold hidden sm:inline">Admin Dashboard</span>
        </Link>

        <div className="flex gap-4">
        <button
  onClick={() => navigate("/")}
  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md w-full sm:w-auto backdrop-blur-md border border-white/30"
>
  Logout
</button>
        </div>
      </nav>

      {/* Event Form */}
      <div className="bg-white flex flex-col items-center w-full max-w-2xl mx-auto p-6 mt-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700">Post an Event</h2>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <label className="font-medium">
            Title:
            <input type="text" name="title" placeholder="Enter Event Title" value={formData.title} onChange={handleChange} className="w-full p-2 mt-1 border rounded-md" />
          </label>
          <label className="font-medium">
            Description:
            <textarea name="description" value={formData.description} placeholder="Description" onChange={handleChange} className="w-full p-2 mt-1 border rounded-md h-32" />
          </label>
          <label className="font-medium">
            Upload Image:
            <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full p-2 mt-1 border rounded-md" />
          </label>
          <label className="font-medium">
            Organized By:
            <input type="text" name="organizedBy" placeholder="Enter Organizer Name" value={formData.organizedBy} onChange={handleChange} className="w-full p-2 mt-1 border rounded-md" />
          </label>
          <label className="font-medium">
            Event Date:
            <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} className="w-full p-2 mt-1 border rounded-md" />
          </label>
          <label className="font-medium">
            Event Time:
            <input type="time" name="eventTime" value={formData.eventTime} onChange={handleChange} className="w-full p-2 mt-1 border rounded-md" />
          </label>
          <label className="font-medium">
            Location:
            <input type="text" name="location" placeholder="Enter Location" value={formData.location} onChange={handleChange} className="w-full p-2 mt-1 border rounded-md" />
          </label>
          <label className="font-medium">
            Ticket Price:
            <input type="number" name="ticketPrice" value={formData.ticketPrice} onChange={handleChange} className="w-full p-2 mt-1 border rounded-md" />
          </label>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mt-6">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
