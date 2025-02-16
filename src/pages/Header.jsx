import { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios'
import {Link} from "react-router-dom";
import { UserContext } from "../UserContext";

import { FaUser } from 'react-icons/fa';


import { FaBars } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri"; 
import { FaIdCard, FaCalendarDay } from 'react-icons/fa';


export default function Header() {
  const {user,setUser} = useContext(UserContext);
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef();

  //! Fetch events from the server -------------------------------------------------
  useEffect(() => {
    
    axios.get("https://twooccasio.onrender.com/events")
.then((response) => {
      setEvents(response.data);
    }).catch((error) => {
      console.error("Error fetching events:", error);
    });
  }, []);


  //! Search bar functionality----------------------------------------------------
  useEffect(() => {
    const handleDocumentClick = (event) => {
      // Check if the clicked element is the search input or its descendant
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setSearchQuery("");
      }
    };

    // Listen for click events on the entire document
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []); 

  useEffect(() => {
    axios.get("https://twooccasio.onrender.com/profile", { withCredentials: true })
      .then(response => {
        setUser(response.data); // Set the user from the response
      })
      .catch(error => {
        console.error("Error fetching user:", error);
        setUser(null); // Ensure user is null if not authenticated
      });
  }, []);
  
  
  //! Logout Function --------------------------------------------------------
  async function logout() {
    await axios.post('https://twooccasio.onrender.com/logout', {}, { withCredentials: true });
    setUser(null);
  }
  
//! Search input ----------------------------------------------------------------
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <header className=' bg-gradient-to-b from-primarydark to-primarylight flex py-2 px-6 sm:px-6 justify-between place-items-center'>

{/* Logo and Name */}
<div className="flex items-center">
  <Link to={'/'} className="flex items-center"> 
    <img src="/occasio1.png" alt="" className="w-10 h-10"/>
    <span className="ml-2 text-lg font-bold hidden sm:inline">Occasio</span>
  </Link>

  
</div>

          {/*------------------------- Search Functionality -------------------  */}
          {searchQuery && (
  <div 
  className=" z-10 absolute rounded-lg bg-white shadow-lg transition-all duration-300 ease-in-out 
  max-h-[30vh] overflow-y-auto w-[75%] sm:w-[60%] md:w-[40%] lg:w-[30%] xl:w-[25%] 
  left-1/3 transform -translate-x-1/2 top-[56px] md:top-[64px]"
>
    {events.filter(event => event.title?.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
      events
        .filter(event => event.title?.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(event => (
          <div key={event._id} className="p-2 hover:bg-gray-100 rounded transition">
            <Link to={`/event/${event._id}`} className="block">
              <div className="text-black text-lg font-semibold">{event.title}</div>
            </Link>
          </div>
        ))
    ) : (
      <div className="text-center text-gray-500 py-1 flex flex-col items-center">
       
        <span className="text-lg font-medium">No results found</span>
      </div>
    )}
  </div>
)}
    
          
   {/* Search Bar moved inside */}
  <div ref={searchInputRef} className='flex bg-white rounded py-2 px-2 w-[60%] sm:w-[50%] md:w-[40%] lg:w-[35%] ml-4 items-center shadow-md shadow-gray-200'>
    <input 
      type="text" 
      id="search"  
      name="search"  
      placeholder="Search events..."  
      value={searchQuery} 
      onChange={handleSearchInputChange} 
      className="text-sm text-black outline-none w-full"
    />
  </div>

<div className='flex gap-5 text-sm'>
  
<Link to={'/admin'}>
  <div className='hidden md:flex flex-col items-center py-1 px-2 rounded  cursor-pointer hover:text-red-500 hover:bg-white hover:shadow-sm shadow-gray-200 transition-shadow duration-1500'>
    <button>
      <RiAdminFill className="w-7 h-7 text-black" />
    </button>
    <div className='font-bold text-red-900 text-sm'>
      Admin
    </div>
  </div>  
</Link>
<Link to={'/wallet'}>
        <div className='flex flex-col hidden md:block place-items-center py-1 px-3 rounded cursor-pointer hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 hover:transition-shadow duration-1500'>
          <FaIdCard className="w-7 h-7 py-1" />
          <div>Booking</div>
        </div>
      </Link>

      <Link to={'/calendar'}>
        <div className='flex flex-col hidden md:block place-items-center py-1 px-3 rounded cursor-pointer hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 hover:transition-shadow duration-1500'>
          <FaCalendarDay className="w-7 h-7 py-1" />
          <div>Calendar</div>
        </div>
      </Link>



          

         

        {!!user &&(
          
          <div className="flex flex-row items-center gap-2 sm:gap-8 ">
            <div className="flex items-center  gap-2">
            <Link to={'/useraccount'}>
  <div className='flex flex-col  place-items-center py-1 px-3 rounded cursor-pointer hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 hover:transition-shadow duration-1500'>
  <FaUser className="w-6 h-6 hidden sm:block " />
    <div className="hidden sm:block">{user.name.toUpperCase()}</div>
  </div>
</Link>

              
<FaBars 
  className="h-5 w-5 cursor-pointer hover:rotate-180 transition-all md:hidden" 
  onClick={() => setisMenuOpen(!isMenuOpen)}
/>

            </div>
            <div className="hidden md:block  :flex">
              <button onClick={logout} className="secondary">
                <div>Log out</div>
               
              </button>
            </div>
          </div>  
        )}

       
        {!user &&(
          <div>
            
            <Link to={'/login'} className=" ">
              <button className="primary">
                <div>Sign in </div>
              </button>
            </Link>
          </div>
        )}

</div>
          
          
          {!!user && (
  // w-auto flex flex-col absolute bg-white pl-2 pr-6 py-5 gap-4 rounded-xl
  <div className="absolute z-10 mt-64 flex flex-col w-48 bg-white right-2 md:right-[160px] rounded-lg shadow-lg">
    <nav className={`block ${isMenuOpen ? 'block' : 'hidden'}`}>
      <div className="flex flex-col font-semibold text-[16px]">
       
        
        <Link 
          className="flex hover:bg-background hover:shadow py-2 pl-6 pr-8 rounded-lg" 
          to={'/wallet'}
          onClick={() => setIsMenuOpen(false)} // Close the menu on click
        >
          <div>Bookings</div>
        </Link>

        
      

        <Link 
          className="flex hover:bg-background hover:shadow py-2 pl-6 pr-8 rounded-lg" 
          to={'/calendar'}
          onClick={() => setIsMenuOpen(false)} // Close the menu on click
        >
          <div>Calendar</div>
        </Link>
        <Link 
          className="flex hover:bg-background hover:shadow py-2 pt-3 pl-6 pr-8 rounded-lg" 
          to={'/admin'} 
          onClick={() => setIsMenuOpen(false)} // Close the menu on click
        >
        Admin
        </Link>

        <Link 
  to={'/useraccount'}  
  className="flex hover:bg-background hover:shadow py-2 pt-3 pl-6 pr-8 rounded-lg"
  onClick={() => setisMenuOpen(false)} // Auto-close menu
> 
  {user.name.toUpperCase()}
</Link>


        <Link 
          className="flex hover:bg-background hover:shadow py-2 pl-6 pb-3 pr-8 rounded-lg" 
          onClick={() => {
            logout();
            setIsMenuOpen(false); // Close the menu and log out
          }}
        >
          Log out
        </Link>
      </div>
    </nav>
  </div>
)}

        </header>
          
    </div>
  )
}
