
const express = require("express");
var cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const Razorpay = require("razorpay")
const Ticket = require("./models/Ticket");
const TicketModel = require("./models/Ticket");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
   cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
   },
});

const bcryptSalt = bcrypt.genSaltSync(10); //! To encriypt the password text ---
const jwtSecret = "bsbsfbrnsftentwnnwnwn"; //! JWT token secret code for encryption ---

//! Making a connection with backend and frontend 
app.use(express.json());
app.use(cookieParser());
app.use(
   cors({
      credentials: true,
      origin: "http://localhost:5173",
   })
);



try {
   mongoose.connect(process.env.MONGO_URL);
   console.log('Connected to MongoDB');
 } catch (error) {
   console.error('MongoDB connection error:', error);
 }
 

//! Checking whether API is working --------------------------------------------------------
app.get("/test", (req, res) => {
   res.json("test ok");
});

//! Register page API endpoint -------------------------------------------------------------
app.post("/register", async (req, res) => {
   const { name, email, password } = req.body;

   try {
      const userDoc = await UserModel.create({
         name,
         email,
         password: bcrypt.hashSync(password, bcryptSalt),
      });
      res.json(userDoc);
   } catch (e) {
      res.status(422).json(e);
   }
});

//! Login API endpoint checking whether database have the entered user profile ------------------------
// Socket.IO connection event
io.on("connection", (socket) => {
   console.log("A user connected:", socket.id);
});

// Login API endpoint
app.post("/login", async (req, res) => {
   const { email, password } = req.body;

   const userDoc = await UserModel.findOne({ email });
   if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
   }

   const passOk = bcrypt.compareSync(password, userDoc.password);
   if (!passOk) {
      return res.status(401).json({ error: "Invalid password" });
   }

   jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      jwtSecret,
      { expiresIn: "7d" },
      (err, token) => {
         if (err) {
            return res.status(500).json({ error: "Failed to generate token" });
         }

         res.cookie("token", token, { httpOnly: true }).json(userDoc);

         // Emit login event
         io.emit("loginSuccess", { message: `Welcome, ${userDoc.name}!` });
      }
   );
});

//! API endpoint for User profile (This is for check purposes)-----------------------------------------------
app.get("/profile", (req, res) => {
   const { token } = req.cookies;
   if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
         if (err) {
            if (err.name === "TokenExpiredError") {
               return res.status(401).json({ error: "Token expired. Please log in again." });
            }
            return res.status(403).json({ error: "Invalid token" });
         }
         const { name, email, _id } = await UserModel.findById(userData.id);
         res.json({ name, email, _id });
      });
   } else {
      res.status(401).json({ error: "No token provided" });
   }
});


//! Logout Functionality --------------------------------------------------------------------------
app.post("/logout", (req, res) => {
   res.cookie("token", "").json(true);
});
// create Event 
// Configure storage for uploaded images
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
     const uploadPath = path.join(__dirname, "uploads"); // Absolute path
     cb(null, uploadPath);
   },
   filename: (req, file, cb) => {
     cb(null, `${Date.now()}${path.extname(file.originalname)}`);
   },
 });
 
 
 const upload = multer({ storage });
 
 // Serve uploaded images statically
 app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const eventSchema = new mongoose.Schema({
   owner: String,
   title: String,
   description: String,
   organizedBy: String,
   eventDate: Date,
   eventTime: String,
   location: String,
   ticketPrice: Number,
   image: String,
   likes: Number,
   Comment: [String],
});

const Event = mongoose.model("Event", eventSchema);

app.post("/events", upload.single("image"), async (req, res) => {
   try {
     console.log("Request received:", req.body);
     console.log("File received:", req.file);
 
     if (!req.file) {
       return res.status(400).json({ error: "No file uploaded" });
     }
 
     const eventData = req.body;
     eventData.image = `/uploads/${req.file.filename}`;
 
     const existingEvent = await Event.findOne({ title: eventData.title });
     if (existingEvent) {
       return res.status(409).json({ error: "Event already exists" });
     }
 
     const newEvent = new Event(eventData);
     await newEvent.save();
     res.status(201).json(newEvent);
   } catch (error) {
     console.error("Server Error:", error);  // Log exact error
     res.status(500).json({ error: "Internal Server Error", details: error.message });
   }
 });
 



//! API endpoint to fetch all events for index page ----------------------------------------------------
app.get("/createEvent", async (req, res) => {
   try {
     const events = await Event.find();
     res.status(200).json(
       events.map((event) => ({
         ...event.toObject(),
         image: event.image ? `http://localhost:4000${event.image}` : "", // Append base URL
       }))
     );
   } catch (error) {
     res.status(500).json({ error: "Failed to fetch events from MongoDB" });
   }
 });
 

//! API endpoint to fetch event by id for Event page ---------------------------------------
app.get("/event/:id", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      if (!event) {
         return res.status(404).json({ error: "Event not found" });
      }
      
      // Ensure the image has the correct full URL
      const eventWithFullImageURL = {
         ...event.toObject(),
         image: event.image ? `http://localhost:4000${event.image}` : "",
      };

      res.json(eventWithFullImageURL);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});


//! API endpoint to adding and fetch likes ---------------------------------------------------
app.post("/event/:eventId", (req, res) => {
   const eventId = req.params.eventId;

   Event.findById(eventId)
      .then((event) => {
         if (!event) {
            return res.status(404).json({ message: "Event not found" });
         }

         event.likes += 1;
         return event.save();
      })
      .then((updatedEvent) => {
         res.json(updatedEvent);
      })
      .catch((error) => {
         console.error("Error liking the event:", error);
         res.status(500).json({ message: "Server error" });
      });
});

//! Add a comment to an event (NOT IN USE) ------------------------------------------
app.post("/event/:eventId", (req, res) => {
   const eventId = req.params.eventId;
   const comment = req.body.comment;

   Event.findById(eventId)
      .then((event) => {
         if (!event) {
            return res.status(404).json({ message: "Event not found" });
         }
         event.comments.push(comment);
         return event.save();
      })
      .then((updatedEvent) => {
         res.json(updatedEvent);
      })
      .catch((error) => {
         console.error("Error adding comment:", error);
         res.status(500).json({ message: "Server error" });
      });
});

//! API endpoint to fetch event by id to calendar ------------------------------------------------------
app.get("/events", (req, res) => {
   Event.find()
      .then((events) => {
         res.json(events);
      })
      .catch((error) => {
         console.error("Error fetching events:", error);
         res.status(500).json({ message: "Server error" });
      });
});

//! API endpoint to fetch event by id to ordersummary 
app.get("/event/:id/ordersummary", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

//! API endpoint to fetch event by id to paymentsummary 
app.get("/event/:id/ordersummary/paymentsummary", async (req, res) => {
   const { id } = req.params;
   try {

      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

app.post("/razorpay/orderId", async (req, res) => {
   try {
      var instance = new Razorpay({
         key_id: process.env.RAZORPAY_KEY_ID,
         key_secret: process.env.RAZORPAY_KEY_SECRET,
     });
   
     console.log(process.env.RAZORPAY_KEY_ID),
     console.log(process.env.RAZORPAY_KEY_SECRET)
   
     console.log("the amount", req.body.amount)
     var options = {
         amount: req.body.amount,
         currency: "INR"
     };
   
     console.log("options:", options)
     const orderDetails = await instance.orders.create(options);
      res.json({orderId: orderDetails.id});
   } catch (error) {
      res.status(500).json({ error: error });
   }
});

//! Api endpoint to post ticket data -------------------------------
app.post(`/tickets`, async (req, res) => {
   try {
      const ticketDetails = req.body;
      const newTicket = new Ticket(ticketDetails);
      await newTicket.save();

      // Attach ticket ID to response
      newTicket.ticketDetails._id = newTicket._id;

      // Send email confirmation
      await sendEmail(ticketDetails.ticketDetails.email, newTicket);

      // Emit event to notify all connected clients
      io.emit("new_ticket", newTicket);

      return res.status(201).json({ ticket: newTicket }); 
   } catch (error) {
      console.error("Error creating ticket:", error);
      return res.status(500).json({ error: "Failed to create ticket" });
   }
});




// Function to send email
async function sendEmail(userEmail, ticket) {
   try {
      let transporter = nodemailer.createTransport({
         service: "gmail",
         auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
         },
      });

      const mailOptions = {
         from: process.env.EMAIL,
         to: userEmail,
         subject: "Occasio - Your Event Partner",
         html: `
            <h2>Event Ticket Confirmation</h2>
            <p>Dear ${ticket.ticketDetails.name},</p>
            <p>Thank you for purchasing a ticket for <strong>${ticket.ticketDetails.eventname}</strong>.</p>
            <p><strong>Event Date:</strong> ${ticket.ticketDetails.eventdate}</p>
            <p><strong>Event Time:</strong> ${ticket.ticketDetails.eventtime}</p>
            <p><strong>Price:</strong> ₹${ticket.ticketDetails.ticketprice}</p>
            <p><strong>Ticket ID:</strong> ${ticket._id}</p>
            <p>Scan the QR Code below at the event:</p>
            <img src="${ticket.ticketDetails.qr}" alt="QR Code" width="200"/>
            <p>See you at the event!</p>
            <p><strong>Occasio</strong></p>
         `,
      };

      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully!");
   } catch (error) {
      console.error("Error sending email:", error);
   }
}

app.get('/tickets/:id', async (req, res) => {
   try {
     const tickets = await Ticket.find();
     res.json(tickets);
   } catch (error) {
     console.error('Error fetching tickets:', error);
     res.status(500).json({ error: 'Failed to fetch tickets' });
   }
 });

 app.get('/tickets/user/:userId', (req, res) => {
   const userId = req.params.userId;
 
   // Fetch tickets using userId to filter
   Ticket.find({ userid: userId })
     .then(tickets => {
       res.json(tickets);
     })
     .catch(error => {
       console.error('Error fetching user tickets:', error);
       res.status(500).json({ error: 'Failed to fetch user tickets' });
     });
 });

 app.delete('/tickets/:id', async (req, res) => {
   try {
     const ticketId = req.params.id;
     await Ticket.findByIdAndDelete(ticketId);
     res.status(204).send(); 
   } catch (error) {
     console.error('Error deleting ticket:', error);
     res.status(500).json({ error: 'Failed to delete ticket' });
   }
 });

 //! Admin Route to Fetch All Events
 app.get("/admin/events", async (req, res) => {
   try {
      const { upcoming, past } = req.query;
      let query = {};

      if (upcoming === "true") {
         query.eventDate = { $gte: new Date() }; // Future events
      } else if (past === "true") {
         query.eventDate = { $lt: new Date() }; // Past events
      }

      const events = await Event.find(query);
      res.status(200).json(events);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
   }
});
app.put("/admin/event/:id", upload.single("image"), async (req, res) => { 
   try {
     const { id } = req.params;
     const updatedData = req.body;
 
     if (req.file) {
       updatedData.image = `/uploads/${req.file.filename}`;
     }
 
     const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, { new: true });
 
     if (!updatedEvent) {
       return res.status(404).json({ error: "Event not found" });
     }
 
     res.json(updatedEvent);
   } catch (error) {
     res.status(500).json({ error: "Failed to update event" });
   }
 });
 

app.delete("/admin/event/:id", async (req, res) => {
   try {
      const { id } = req.params;

      const deletedEvent = await Event.findByIdAndDelete(id);
      if (!deletedEvent) {
         return res.status(404).json({ error: "Event not found" });
      }

      res.json({ message: "Event deleted successfully" });
   } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
   }
});


//! Admin Route to Fetch All Tickets
app.get("/admin/tickets", async (req, res) => { 
   try {
      const tickets = await TicketModel.find()
         .populate("userid", "name email")  // Get user details (name & email)
         .populate("eventid", "title");     // Get event name (title)

      const formattedTickets = tickets
         .map(ticket => ({
            ticketId: ticket._id,
            eventName: ticket.eventid ? ticket.eventid.title : "Unknown Event",
            userName: ticket.userid ? ticket.userid.name : "Unknown User",
            userEmail: ticket.userid ? ticket.userid.email : "Unknown Email"
         }))
         .filter(ticket => ticket.eventName !== "Unknown Event"); // Remove unknown event tickets

      res.status(200).json(formattedTickets);
   } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
   }
});





 const PORT = 4000;

 server.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
 });
 
