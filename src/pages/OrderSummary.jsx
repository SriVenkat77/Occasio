import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from 'react-router-dom';
export default function OrderSummary() {
    const {id} = useParams();
    const [event, setEvent] = useState(null);
    useEffect(() => {
        if (!id) return;
        axios.get(`https://twooccasio.onrender.com/event/${id}/ordersummary`)
            .then(response => setEvent(response.data))
            .catch(error => console.error("Error fetching events:", error));
    }, [id]);
    if (!event) return null;
    return (
        <div className='bg-gradient-to-b from-primarydark to-primarylight min-h-screen p-4'>
            {/* Back Button */}
            <Link to={'/event/' + event._id}>
                <button className='flex items-center gap-2 p-3 bg-gray-100 text-blue-700 font-bold rounded-md'>
                    <IoMdArrowBack className='w-6 h-6' />
                    Back
                </button>
            </Link>
            <div className='flex flex-col md:flex-row mt-8 gap-5'>
                {/* Terms & Conditions */}
                <div className="p-4 bg-gray-100 md:w-2/3 w-full rounded-md shadow-md">
                    <h2 className='text-left font-bold text-lg'>Terms & Conditions</h2>
                    <ul className="list-disc pl-5 mt-3 space-y-2 text-sm">
                    <li>Refunds are available for cancellations made up to 14 days before the event. No refunds after this period.</li>
    <li>Tickets will be emailed as e-tickets. Show them on your mobile device or print them for entry.</li>
    <li>Each individual can purchase only one ticket for fair distribution.</li>
    <li>In case of cancellation or postponement, attendees will be notified via email. Refunds will be automatic for canceled events.</li>
    <li>Tickets for postponed events remain valid and are not eligible for refunds.</li>
    <li>Your privacy is important. Our privacy policy outlines data collection and usage. By using our app, you agree to it.</li>
    <li>Before purchasing, review and accept our terms and conditions.</li>
    <li>Re-selling or transferring tickets without authorization is strictly prohibited.</li>
    <li>Event organizers reserve the right to deny entry to individuals violating event policies.</li>
    <li>Attendees must follow all venue guidelines, including security checks and safety measures.</li>
    <li>Any form of harassment, misconduct, or illegal activity at the event will result in immediate removal.</li>
    <li>Event schedules are subject to change, and attendees should stay updated via official communication channels.</li>
    <li>Lost or stolen tickets will not be replaced. Keep your ticket details secure.</li>
    <li>Food, drinks, and prohibited items may not be allowed inside the event venue. Check event-specific policies.</li>
    <li>By attending, you consent to photography and video recording that may be used for promotional purposes.</li>
</ul>
                </div>
                {/* Booking Summary */}
                <div className="p-4 bg-blue-100 md:w-1/3 w-full rounded-md shadow-md">
                    <h2 className='font-bold text-lg'>Booking Summary</h2>
                    <div className='flex justify-between text-sm mt-3'>
                        <span>{event.title}</span>
                        <span className='pr-5'>Total: ${event.ticketPrice}</span>
                    </div>
                    
                    <hr className="my-3 border-gray-300" />
                    
                    <div className='flex justify-between text-sm font-bold'>
                        <span>SUB TOTAL</span>
                        <span className='pr-5'>${event.ticketPrice}</span>
                    </div>
                    <div className='flex items-center gap-2 mt-4 text-sm'>
                        <input type='checkbox' className='h-4 w-4' />
                        <span>
    I have carefully verified the event name, date, time, and venue details before proceeding with my purchase.  
    I understand that tickets are non-transferable and that refunds are only available as per the event’s refund policy.  
    I acknowledge that reselling or unauthorized sharing of tickets is strictly prohibited.  
    I agree to follow all event guidelines, including safety regulations, entry requirements, and venue policies.  
    By proceeding, I confirm that I accept the terms and conditions outlined by the event organizers.  
</span>

                    </div>
                    {/* Proceed Button */}
                    <Link to={`/event/${event._id}/ordersummary/paymentsummary`}>
                        <button className='mt-5 w-full p-3 text-white bg-blue-700 rounded-md'>
                            Proceed
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}