import express from "express"
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";

import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import "dotenv/config";
import sendEmail from "./utils/sendEmail.js";


connectDB()
connectCloudinary()

const app = express()
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));



//Middleware
app.use(express.json());


app.get('/', (req, res)=> res.send("API is working ") )
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)


app.get('/api/test-email', async (req, res) => {
  try {
    await sendEmail('your_email@gmail.com', 'Test Email', '<p>This is a test email</p>');
    res.send('✅ Email sent!');
  } catch (err) {
    console.error('❌ Email sending failed:', err);
    res.status(500).send('❌ Email failed to send');
  }
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
