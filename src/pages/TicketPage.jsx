import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdArrowBack } from 'react-icons/io';
import { RiDeleteBinLine } from 'react-icons/ri';
import axios from "axios";
import { UserContext } from "../UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TicketPage() {
  const { user } = useContext(UserContext);
  const [userTickets, setUserTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    axios.get(`https://twooccasio.onrender.com/tickets/user/${user._id}`)
      .then(response => {
        const today = new Date();
        const validTickets = response.data.filter(ticket => {
          const eventDate = new Date(ticket.ticketDetails.eventdate);
          return today < eventDate || (today.toDateString() === eventDate.toDateString());
        });
        setUserTickets(validTickets);
      })
      .catch(error => {
        console.error('Error fetching user tickets:', error);
      });
  };

  const confirmDeleteTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
  };

  const deleteTicket = async () => {
    if (!selectedTicketId) return;
    try {
      await axios.delete(`https://twooccasio.onrender.com/tickets/${selectedTicketId}`);
      fetchTickets();
      toast.success("Ticket deleted !");
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error("Failed to delete ticket");
    } finally {
      setSelectedTicketId(null); // Close the modal after delete
    }
  };

  return (
    <div className="flex flex-col flex-grow">
      <div className="mb-5 flex justify-between items-center px-4 md:px-12">
        <Link to='/'>
          <button className='inline-flex gap-2 p-3 bg-gray-100 justify-center items-center text-blue-700 font-bold rounded-md'>
            <IoMdArrowBack className='w-6 h-6' />
            Back
          </button>
        </Link>
      </div>

      <div className="mx-4 md:mx-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {userTickets.map(ticket => (
          <div key={ticket._id} className="flex flex-col">
            <div className="h-auto bg-gray-100 p-5 rounded-md relative">
              <button
                onClick={() => confirmDeleteTicket(ticket._id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-red-200 hover:bg-red-300"
              >
                <RiDeleteBinLine className="h-6 w-6 text-red-700" />
              </button>
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-48 md:h-48">
                  <img src={ticket.ticketDetails.qr} alt="QRCode" className="w-full h-full object-contain rounded-md" />
                </div>
                <div className="flex flex-col gap-2 text-sm sm:text-base font-normal w-full">
                  <div>
                    <span className="font-extrabold text-primarydark">Event Name:</span> <br />
                    <span>{ticket.ticketDetails.eventname.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-primarydark">Date & Time:</span> <br />
                    <span>{ticket.ticketDetails.eventdate.split("T")[0]}, {ticket.ticketDetails.eventtime}</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-primarydark">Name:</span>
                    <span>{ticket.ticketDetails.name.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-primarydark">Price:</span>
                    <span> Rs . {ticket.ticketDetails.ticketprice}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-primarydark">Email:</span>
                    <div className="overflow-x-auto max-w-xs">
                      <span className="inline-block whitespace-nowrap">{ticket.ticketDetails.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-primarydark">Ticket ID:</span>
                    <div className="overflow-x-auto max-w-xs">
                      <span className="inline-block whitespace-nowrap">{ticket._id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {selectedTicketId && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out">
       <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg animate-fadeIn">
        
         <p className="mt-2 text-gray-700">
           Are you sure you want to delete this ticket?
         </p>
         <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
           <button
             onClick={() => setSelectedTicketId(null)}
             className="px-5 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition w-full sm:w-auto"
           >
             Cancel
           </button>
           <button
             onClick={deleteTicket}
             className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition w-full sm:w-auto"
           >
             Delete
           </button>
         </div>
       </div>
     </div>
     
      
      )}
    </div>
  );
}
