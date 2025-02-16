import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import axios from "axios";

import { toast } from "react-toastify";


export default function AdminAuth() {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notification, setNotification] = useState("");
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);


  const navigate = useNavigate();

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === "2512") {
      setIsAuthenticated(true);
    } else {
      setNotification("PIN not correct");
      setTimeout(() => setNotification(""), 3000);
    }
  };
  const handleDeleteClick = (id) => {
    setEventToDelete(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;

    try {
      await axios.delete(`https://twooccasio.onrender.com/admin/event/${eventToDelete}`);
      setEvents(events.filter(event => event._id !== eventToDelete));

      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setShowModal(false);
      setEventToDelete(null);
    }
  };



  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const eventsRes = await axios.get("https://twooccasio.onrender.com/admin/events");
          const ticketsRes = await axios.get("https://twooccasio.onrender.com/admin/tickets");
          setEvents(eventsRes.data);
          setTickets(ticketsRes.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isAuthenticated]);


  const filteredTickets = selectedEvent
    ? tickets.filter(ticket => ticket.eventName === selectedEvent)
    : tickets;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen ">
        {/* Navigation Bar */}
        <nav className="bg-gradient-to-b from-primarydark to-primarylight p-4 text-white flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src="/occasio1.png" alt="" className="w-10 h-10" />
            <span className="ml-2 text-lg font-bold hidden sm:inline">
              Admin Dashboard
            </span>
          </Link>
          <button
            onClick={() => navigate("/")}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md w-full sm:w-auto backdrop-blur-md border border-white/30"
          >
            Logout
          </button>
        </nav>

        {/* Admin Access Content */}
        <div className="flex items-center justify-center">
          <div className=" flex flex-col items-center w-full max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Admin Access Required
            </h1>
            <p className="text-gray-700 text-lg text-center my-4">
              Welcome to the Admin Access Page. This section is strictly reserved
              for authorized administrators only. If you are an admin, please
              enter the correct PIN to proceed. Unauthorized access is strictly
              prohibited and may result in security actions.
            </p>

            {notification && (
              <div className="bg-red-500 text-white text-sm py-1 px-4 rounded-md mb-4">
                {notification}
              </div>
            )}

            <form
              onSubmit={handlePinSubmit}
              className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg space-y-4"
            >

              <label className="font-medium block">
                Enter Admin PIN:
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full p-2 mt-1 border rounded-md"
                  placeholder="Enter PIN"
                />
              </label>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </form>

            <div className="mt-6 w-full max-w-7xl text-left">
              <h1 className="text-lg font-semibold text-gray-700">Why Admin Access?</h1>
              <p className="text-gray-600 text-sm">
                This page provides administrators with special privileges to
                manage and oversee important events. As an admin, you have the
                authority to create, modify, and manage event details. This
                ensures smooth operation and a seamless experience for all users.
              </p>

              <h1 className="text-lg font-semibold text-gray-700 mt-4">
                Security & Compliance
              </h1>
              <p className="text-gray-600 text-sm">
                For security reasons, this page is protected with a PIN
                verification system. Unauthorized personnel will be denied access,
                and failed attempts may trigger security measures.
              </p>

              <h1 className="text-lg font-semibold text-gray-700 mt-4">
                Need Assistance?
              </h1>
              <p className="text-gray-600 text-sm">
                If you are an admin but do not have the correct PIN, please
                contact the system administrator or support team for verification.
                Unauthorized attempts will be logged for security monitoring.
              </p>

              <h1 className="text-lg font-semibold text-gray-700 mt-4">
                User Responsibility
              </h1>
              <p className="text-gray-600 text-sm">
                As an admin, you are responsible for maintaining the integrity of
                the platform. Any modifications made should be carefully reviewed
                to prevent unauthorized changes or data loss.
              </p>

              <h1 className="text-lg font-semibold text-gray-700 mt-4">
                Data Protection
              </h1>
              <p className="text-gray-600 text-sm">
                All information accessed through this portal is confidential.
                Ensure that no sensitive data is shared externally without proper
                authorization.
              </p>

              <h1 className="text-lg font-semibold text-gray-700 mt-4">
                System Monitoring
              </h1>
              <p className="text-gray-600 text-sm">
                All admin actions are monitored and logged for security purposes.
                Any suspicious activities will be flagged for review.
              </p>

              <h1 className="text-lg font-semibold text-gray-700 mt-4">
                Role-Based Access
              </h1>
              <p className="text-gray-600 text-sm">
                Different levels of administrative privileges exist. Ensure that
                you have the correct role assigned before making significant
                changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen">
      <nav className="bg-gradient-to-b from-primarydark to-primarylight p-4 text-white flex justify-between items-center">
        <Link to="/admin" className="flex items-center">
          <img src="/occasio1.png" alt="" className="w-10 h-10" />
          <span className="ml-2 text-lg font-bold hidden sm:inline">Admin Dashboard</span>
        </Link>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center p-4">
          <button
            onClick={() => navigate("/createEvent")}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md w-full sm:w-auto backdrop-blur-md border border-white/30"
          >
            Create Event
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md w-full sm:w-auto backdrop-blur-md border border-white/30"
          >
            Logout
          </button>

        </div>

      </nav>
      <div className="p-6">
        <button onClick={() => navigate("/")} className="inline-flex gap-2 p-3 bg-gray-100 text-blue-700 font-bold rounded-md mb-4">
          <IoMdArrowBack className="w-6 h-6" /> Back
        </button>


        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">All Events ({events.length})</h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 p-2">Event Name</th>
                      <th className="border border-gray-300 p-2">Date</th>
                      <th className="border border-gray-300 p-2">Location</th>
                      <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(event => (
                      <tr key={event._id} className="text-center">
                        <td className="border border-gray-300 p-2">{event.title}</td>
                        <td className="py-2 px-4 border">{new Date(event.eventDate).toLocaleDateString()}</td>
                        <td className="border border-gray-300 p-2">{event.location}</td>
                        <td className="border border-gray-300 p-2">

                          <button onClick={() => handleDeleteClick(event._id)} className="bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>


                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>


            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">All Tickets ({filteredTickets.length})</h2>
              <select className="mb-4 p-2 border rounded-md w-full" onChange={(e) => setSelectedEvent(e.target.value)}>
                <option value="">Filter by Event</option>
                {events.map(event => (
                  <option key={event._id} value={event.title}>{event.title}</option>
                ))}
              </select>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 p-2">Ticket ID</th>
                      <th className="border border-gray-300 p-2">User Name</th>
                      <th className="border border-gray-300 p-2">Email</th>
                      <th className="border border-gray-300 p-2">Event</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map(ticket => (
                      <tr key={ticket.ticketId} className="text-center">
                        <td className="border border-gray-300 p-2">{ticket.ticketId}</td>
                        <td className="border border-gray-300 p-2">{ticket.userName}</td>
                        <td className="border border-gray-300 p-2">{ticket.userEmail}</td>
                        <td className="border border-gray-300 p-2">{ticket.eventName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4 transition-opacity duration-300 ease-in-out">
          <div className="bg-white p-6 rounded-lg shadow-2xl text-center w-full max-w-sm sm:max-w-md">
            <p className="text-gray-700 text-lg font-medium">
              Are you sure you want to delete this event?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-5">
              <button
                onClick={handleDelete}
                className="w-full sm:w-auto bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

      )}

    </div>
  );
}
