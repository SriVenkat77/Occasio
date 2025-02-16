/* eslint-disable no-unused-vars */
import axios from 'axios';
import  { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom';
import {IoMdArrowBack} from 'react-icons/io'
import { UserContext } from '../UserContext';
import Qrcode from 'qrcode' //TODO:
import { toast } from 'react-toastify';

export default function PaymentSummary() {
    const {id} = useParams();
    const [event, setEvent] = useState(null);
    const {user} = useContext(UserContext);
    const [details, setDetails] = useState({
      name: '',
      email: '',
      contactNo: '',
    });
//!Adding a default state for ticket-----------------------------
    const defaultTicketState = {
      userid: user ? user._id : '',
      eventid: '',
      ticketDetails: {
        name: user ? user.name : '',
        email: user ? user.email : '',
        eventname: '',
        eventdate: '',
        eventtime: '',
        ticketprice: '',
        qr: '',
      }
    };
//! add default state to the ticket details state
    const [ticketDetails, setTicketDetails] = useState(defaultTicketState);
 
    const [redirect, setRedirect] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(()=>{
      if(!id){
        return;
      }
      axios.get(`https://twooccasio.onrender.com/event/${id}/ordersummary/paymentsummary`).then(response => {
        setEvent(response.data)
        setTicketDetails(prevTicketDetails => ({
          ...prevTicketDetails,
          eventid: response.data._id,
       //!capturing event details from backend for ticket----------------------
          ticketDetails: {
            ...prevTicketDetails.ticketDetails,
            eventname: response.data.title,
            eventdate: response.data.eventDate.split("T")[0],
            eventtime: response.data.eventTime,
            ticketprice: response.data.ticketPrice,
          }
        }));
      }).catch((error) => {
        console.error("Error fetching events:", error);
      });
    }, [id]);
//! Getting user details using use effect and setting to new ticket details with previous details
    useEffect(() => {
      setTicketDetails(prevTicketDetails => ({
        ...prevTicketDetails,
        userid: user ? user._id : '',
        ticketDetails: {
          ...prevTicketDetails.ticketDetails,
          name: user ? user.name : '',
          email: user ? user.email : '',
        }
      }));
    }, [user]);
    
    
    if (!event) return '';
    const handleChangeDetails = (e) => {
      const { name, value } = e.target;
      setDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    };
  
    const loadRazorpay = async () => {
      try {
        setIsLoading(true);
        console.log("ticketDetails:", ticketDetails?.ticketDetails?.ticketprice)
        
        // Load Razorpay script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        
        // Wait for script to load
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
        // Get order ID from backend
        const orderResponse = await axios.post('https://twooccasio.onrender.com/razorpay/orderId', {
          amount: ticketDetails?.ticketDetails?.ticketprice * 100,
        });
        
        const { orderId } = orderResponse.data;
        console.log("orderId:", orderId)
        const options = {
          key: 'rzp_test_OHocZsZ2Gi3LDY',
          amount: ticketDetails.ticketDetails.ticketprice * 100,
          currency: 'INR', 
          name: event.title,
          description: 'Event Ticket Purchase',
          order_id: orderId,
          handler: async function (response) {
            try {
              console.log(response, "response")
              // Create ticket after successful payment
              await createTicket();
            } catch (error) {
              console.error('Error processing payment:', error);
              alert('Payment failed. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
          modal: {
            ondismiss: function() {
              setIsLoading(false);
            }
          },
          prefill: {
            name: user?.name,
            email: user?.email,
          },
          theme: {
            color: '#3B82F6'
          }
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error) {
        console.error('Error initializing Razorpay:', error);
        alert('Could not initialize payment. Please try again.');
        setIsLoading(false);
      }
    };
//! creating a ticket ------------------------------
const createTicket = async () => {
  try {
    setIsLoading(true);
    const qrCode = await generateQRCode(
      ticketDetails.ticketDetails.eventname,
      ticketDetails.ticketDetails.name
    );
    const updatedTicketDetails = {
      ...ticketDetails,
      ticketDetails: {
        ...ticketDetails.ticketDetails,
        qr: qrCode,
      }
    };
    const response = await axios.post(`https://twooccasio.onrender.com/tickets`, updatedTicketDetails);
    
    // Show success toast notification
    toast.success("Ticket successfully created!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    setRedirect(true);
    console.log('Success creating ticket', updatedTicketDetails);
  } catch (error) {
    console.error('Error creating ticket:', error);

    // Show error toast notification
    toast.error("❌ Error creating ticket. Please try again.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  } finally {
    setIsLoading(false);
  }
};

//! Helper function to generate QR code ------------------------------
async function generateQRCode(name, eventName) {
  try {
    const qrCodeData = await Qrcode.toDataURL(
        `Event Name: ${name} \n Name: ${eventName}`
    );
    return qrCodeData;
  } catch (error) {
    console.error("Error generating QR code:", error);
    return null;
  }
}
if (redirect){
  return <Navigate to={'/wallet'} />
}
    return (
      <>
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-5 rounded-lg flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
              <p className="mt-4 text-gray-700">Processing your payment...</p>
            </div>
          </div>
        )}
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      <Link to={'/event/'+event._id+ '/ordersummary'}>
                
       <button 
              // onClick={handleBackClick}
              className='
              inline-flex 
              mt-12
              gap-2
              p-3 
              ml-12
              bg-gray-100
              justify-center 
              items-center 
              text-blue-700
              font-bold
              rounded-md'
              >
                
          <IoMdArrowBack 
            className='
            font-bold
            w-6
            h-6
            gap-2'/> 
            Back
          </button>
          </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-6 p-6">
  {/* Your Details */}
  <div className="bg-blue-100 shadow-lg p-6 flex-1">
    <h2 className="text-xl font-bold mb-4">Your Details</h2>
    <input type="text" name="name" value={details.name} onChange={handleChangeDetails} placeholder="Name" className="w-full h-12 bg-gray-50 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3" />
    <input type="email" name="email" value={details.email} onChange={handleChangeDetails} placeholder="Email" className="w-full h-12 bg-gray-50 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3" />
    <input type="tel" name="contactNo" value={details.contactNo} onChange={handleChangeDetails} placeholder="Contact No" className="w-full h-12 bg-gray-50 border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
  </div>

  

  {/* Payment Option */}
  <div className="flex-1">
  <div className="mt-8">
      <p className="text-xl font-semibold pb-2">Total Amount: {event.ticketPrice}</p>
      
    </div>
    <h2 className="text-md font-bold mb-4">Payment Option</h2>
    
    {/* Responsive Button Grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-center mt-6">
      <button type="button" onClick={loadRazorpay} className="px-8 py-3 text-black bg-blue-100 hover:bg-blue-200 focus:outline-none border rounded-md border-gray-300 shadow-md transition-all duration-300">
        Credit / Debit Card
      </button>
      <button type="button" onClick={loadRazorpay} className="px-8 py-3 text-white bg-green-500 hover:bg-green-600 focus:outline-none border rounded-md border-gray-300 shadow-md transition-all duration-300">
        UPI / Google Pay
      </button>
      <button type="button" onClick={loadRazorpay} className="px-8 py-3 text-white bg-orange-500 hover:bg-orange-600 focus:outline-none border rounded-md border-gray-300 shadow-md transition-all duration-300">
        Net Banking
      </button>
      <button type="button" onClick={loadRazorpay} className="px-8 py-3 text-white bg-purple-500 hover:bg-purple-600 focus:outline-none border rounded-md border-gray-300 shadow-md transition-all duration-300">
        Wallets 
      </button>
      <button type="button" onClick={loadRazorpay} className="px-8 py-3 text-white bg-gray-700 hover:bg-gray-800 focus:outline-none border rounded-md border-gray-300 shadow-md transition-all duration-300">
        Other 
      </button>
    </div>

    {/* Total Amount & Payment Button */}
    
  </div>
</div>

      <div className="bg-gray-50 shadow-lg p-6 flex-1">
    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
    <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
  <h2 className="text-xl font-semibold text-gray-900 mb-2">{event?.title}</h2>
  <p className="text-gray-600">
    📅 Event Date : <span className="font-medium">{event?.eventDate.split("T")[0]}</span>
  </p>
  <p className="text-gray-600">
    ⏰ Time : <span className="font-medium">{event?.eventTime}</span>
  </p>
  <p className="text-gray-600">
    💰 Ticket Price : <span className="font-medium text-green-600">₹{event?.ticketPrice}</span>
  </p>
</div>
  </div>
      </>
    );
}