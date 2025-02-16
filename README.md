# Occasio: Event Management System

## Deployed Demo
- **Frontend**: [occasiso.netlify.app](https://occasiso.netlify.app/)
- **Backend**: [https://occasio-r2gu.onrender.com](https://occasio-r2gu.onrender.com)

## Introduction: High-Level Overview
Occasio is an event management system that allows users to discover and register for events. The platform provides features such as user authentication, ticketing with QR codes, real-time notifications, and secure payment processing via Razorpay.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT-based authentication
- **Real-Time Features**: Socket.io for real-time notifications
- **Image Upload**: Cloudinary for storing event images
- **Payment Integration**: Razorpay for secure transactions
- **QR Code Generation**: For event ticketing

## Detailed Feature Walkthrough

### 1. User Authentication
- **Description**: Secure user authentication with login and registration.
- **Implementation**:
  - Utilized JWT for secure user authentication.
  - Sign-up/Login with email and password.
  - Ensures secure user sessions for event registration and ticketing.

### 2. Admin Dashboard
- **Description**: Dedicated dashboard for administrators to manage events.
- **Implementation**:
  - **Authentication System**: Admin users have a separate authentication mechanism with role-based access.
  - **Event Management**: Admins can create and delete events.
  - **Image Upload**: Used Cloudinary for uploading and storing event images.
  - **Real-Time Notifications**: Implemented via Socket.io and Toast notifications for user interactions.

### 3. Event Creation and Management
- **Description**: Admins can create and manage events with relevant details.
- **Implementation**:
  - Event Management: Admins can create events, including details like name, description, date, time, and location.
  - Events are listed dynamically for attendees to browse.

### 4. Ticketing System
- **Description**: Generates unique QR codes for each registered ticket.
- **Implementation**:
  - QR Code Generation: Integrated a library to generate QR codes for event tickets.
  - Ticket Display: Attendees can view their tickets after registration.

### 5. Payment Integration
- **Description**: Secure payment processing for event registrations.
- **Implementation**:
  - Razorpay Integration for secure event payments.
  - Payment Confirmation: After successful payment, users can register for the event.

### 6. Home Page
- **Description**: Displays a list of upcoming events with event name, date, and location.
- **Implementation**:
  - Dynamically fetched event data from the backend.
  - Responsive UI using TailwindCSS.

### 7. Event Details Page
- **Description**: Shows detailed information about an event with registration and social sharing options.
- **Implementation**:
  - Displays event details like name, description, and location.
  - Users can register for events and proceed with payment.
  - Integrated social media sharing options.

### 8. Attendee Dashboard
- **Description**: Users can view their registered events and access tickets.
- **Implementation**:
  - Dashboard displays registered events, including event name and date.
  - Users can view and download their event tickets.

### 9. Calendar Page
- **Description**: Allows users to view upcoming events based on dates.
- **Implementation**:
  - Calendar view displaying event names and scheduled dates.

## Technical Details
### Tech Stack
- **Frontend**: React + Vite, styled with TailwindCSS.
- **Backend**: Node.js and Express for handling API requests.
- **Database**: MongoDB for event details, user data, and ticket information.
- **Authentication**: JWT-based authentication.
- **Real-Time Features**: Used Socket.io for live notifications.
- **Image Upload**: Cloudinary integration for event images.
- **Payment**: Razorpay for secure transactions.
- **QR Code**: Used a library for ticket QR code generation.

### Repository Structure
- **Frontend**: Contains React components for event display, authentication, and ticket management.
- **Backend**: Contains Express routes, controllers for event management, ticket generation, and payment handling.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- **Razorpay** for payment integration.
- **TailwindCSS** for UI styling.
- **MongoDB, Express, React, and Node.js** for building a scalable event management platform.
- **Cloudinary** for seamless image uploads.
- **Socket.io** for real-time notifications.
