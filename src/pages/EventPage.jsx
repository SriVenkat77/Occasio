import axios from "axios";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { AiFillCalendar } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { FaCopy, FaWhatsappSquare, FaFacebook } from "react-icons/fa";

export default function EventPage() {
  const {id} = useParams();
  const [event, setEvent] = useState(null);

  //! Fetching the event data from server by ID ------------------------------------------
  useEffect(()=>{
    if(!id){
      return;
    }
    axios.get(`https://twooccasio.onrender.com/event/${id}`).then(response => {
      setEvent(response.data)
    }).catch((error) => {
      console.error("Error fetching events:", error);
    });
  }, [id])

  //! Copy Functionalities -----------------------------------------------
  const handleCopyLink = () => {
    const linkToShare = window.location.href;
    navigator.clipboard.writeText(linkToShare).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  const handleWhatsAppShare = () => {
    const linkToShare = window.location.href;
    const whatsappMessage = encodeURIComponent(`${linkToShare}`);
    window.open(`whatsapp://send?text=${whatsappMessage}`);
  };

  const handleFacebookShare = () => {
    const linkToShare = window.location.href;
    const facebookShareUrl = `https://www.facebook.com/occasio/${encodeURIComponent(linkToShare)}`;
    window.open(facebookShareUrl);
  };
  
if (!event) return '';
  return (
    <div className="bg-gradient-to-b from-primarydark to-primarylight flex flex-col mx-5 xl:mx-32 md:mx-10 mt-5 rounded overflow-hidden">
    <div className="w-full h-full">
    {event.image && (
  <img
  src={event.image}
  alt=""
  className='rounded-tl-[0.75rem] rounded-tr-[0.75rem] rounded-br-[0] rounded-bl-[0] w-full object-cover aspect-[16/9]'
/>
)}

    </div>
       {/* <img src="https://media.licdn.com/dms/image/v2/C561BAQE-51J-8KkMZg/company-background_10000/company-background_10000/0/1584559866970/eventscom_cover?e=2147483647&v=beta&t=3bktbE7ts5aNwH8XEUM5rW0G2aMbuQ1b2dHBVQgZqmA" alt="" className='rounded object-fill aspect-16:9'/> 
      */}

<div className="mx-2 mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
  <h1 className="text-3xl md:text-5xl font-extrabold">{event.title.toUpperCase()}</h1>
  <Link to={'/event/'+event._id+ '/ordersummary'}>
    <button className="primary w-full sm:w-auto">Book Ticket</button>  
  </Link>
</div>

      <div className="mx-2">
          <h2 className="text-md md:text-xl font-bold mt-3 text-primarydark">{event.ticketPrice === 0? 'Free Entry' : 'Ticket Price: '+ event.ticketPrice}</h2>
      </div>
      <div className="mx-2 mt-5 text-md md:text-lg truncate-3-lines">
        {event.description}
      </div>
      <div className="mx-2 mt-5 text-md md:text-xl font-bold text-primarydark">
        Organized By {event.organizedBy}
      </div>
      <div className="mx-2 mt-5">
        <h1 className="text-md md:text-xl font-extrabold">When and Where </h1>
        <div className="sm:mx-5 lg:mx-32 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <AiFillCalendar className="w-auto h-5 text-primarydark "/>
            <div className="flex flex-col gap-1">
              
              <h1 className="text-md md:text-lg font-extrabold">Date and Time</h1>
              <div className="text-sm md:text-lg">
              Date: {event.eventDate.split("T")[0]} <br />Time: {event.eventTime}
              </div>
            </div>
            
          </div>
          <div className="">
            <div className="flex items-center gap-4">
            <MdLocationPin className="w-auto h-5 text-primarydark "/>
            <div className="flex flex-col gap-1">
              
              <h1 className="text-md md:text-lg font-extrabold">Location</h1>
              <div className="text-sm md:text-lg">
                {event.location}
              </div>
            </div>
            
          </div>
          </div>
        </div>
            
      </div>
      <div className="mx-2 mt-5 text-md md:text-xl font-extrabold">
        Share with friends
        <div className="mt-10 flex gap-5 mx-10 md:mx-32 ">
        <button onClick={handleCopyLink}>
            <FaCopy className="w-auto h-6" />
          </button>

          <button onClick={handleWhatsAppShare}>
            <FaWhatsappSquare className="w-auto h-6" />
          </button>

          <button onClick={handleFacebookShare}>
            <FaFacebook className="w-auto h-6" />
          </button>

        </div>
      </div>


    </div>
  )
}
