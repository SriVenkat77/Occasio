Occasio : Event Management System
Deployed Demo
	• Frontend: occasiso.netlify.app
	• Backend: [https://occasio-r2gu.onrender.com](https://twooccasio.onrender.com)
Introduction: High-Level Overview

Objective: The goal of this project is to provide a platform for users to discover, create, manage, and register for events. The system includes features like user authentication, event creation, ticketing with QR codes, and payment integration via Razorpay.
Tech Stack:
	• Frontend: React, Vite, TailwindCSS
	• Backend: Node.js, Express.js, MongoDB
	• Payment Integration: Razorpay for secure transactions
	• QR Code Generation: For event tickets
Detailed Feature Walkthrough
1. User Authentication
	• Description: Allows users to register, log in, and securely authenticate using JWT.
	• Implementation: 
		○ Authentication: Utilized JWT for secure user authentication.
		○ Sign-up/Login: Users can register and log in with email and password.
		○ JWT Authentication: Ensures secure user sessions for event registration and ticketing.
2. Event Creation and Management
	• Description: Allows admins to create and manage events with details like name, description, date, time, and location.
	• Implementation: 
		○ Event Management: Admins can create  events, which include adding important details 
		○ Event Display: Events are listed on the homepage for attendees to browse.
3. Ticketing System
	• Description: Generates unique QR codes for each registered ticket, showing the event name and attendee's name.
	• Implementation: 
		○ QR Code Generation: Integrated a library to generate QR codes for event tickets.
		○ Ticket Display: Attendees can view their tickets after registration.
4. Payment Integration
	• Description: Integrated Razorpay for secure payment processing for event registrations.
	• Implementation: 
		○ Razorpay Integration: Users can make payments for events securely through Razorpay.
		○ Payment Confirmation: After successful payment, the user can register for the event.
5. Home Page
	• Description: Displays a list of upcoming events with basic details such as event name, date, and location.
	• Implementation: 
		○ Event Listings: Dynamically fetched data from the backend to show upcoming events.
		○ Responsive Design: Ensured the home page is mobile-friendly using TailwindCSS.
6. Event Details Page
	• Description: Shows detailed information about a specific event with options for ticket registration and sharing on social media.
	• Implementation: 
		○ Event Info: Displays event details including name, description, and location.
		○ Ticket Registration: Users can register for events and proceed with payment.
		○ Social Sharing: Integrated social media sharing options for each event.
7. Attendee Dashboard
	• Description: Allows users to view their registered events and access tickets.
	• Implementation: 
		○ Dashboard: Displays a list of events the user has registered for, including the event name and date.
		○ Ticket Access: Users can view their event tickets.
8.Calendar Page
			• Description: Allows users to view upcoming events in date wise
			• Implementation: 
				○ Calendar View: Displays a list of upcoming events , including the event name.
				
		
Technical Details
Tech Stack
	• Frontend: React + Vite with TailwindCSS for responsive, modern UI.
	• Backend: Node.js and Express for building APIs and handling authentication.
	• Database: MongoDB for storing event details, user data, and ticket information.
	• Payment: Razorpay for payment processing.
	• QR Code: Library for generating event tickets with unique QR codes.
Repository Structure
	• Frontend: Contains React components for event display, user authentication, and ticket management.
	• Backend: Contains Express routes, controllers for event management, ticket generation, and payment handling.
License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments
	• Razorpay for payment integration.
	• TailwindCSS for styling.
	• MongoDB, Express, React, and Node.js for the foundational technologies.
