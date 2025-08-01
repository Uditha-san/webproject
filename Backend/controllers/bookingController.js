

import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

//check availability of room

const checkAvailability = async ({checkInDate, checkOutDate,room}) => {

    try {
        const bookings = await Booking.find({
            room,
            checkInDate: {$lte: checkOutDate},
        checkOutDate: {$gte: checkInDate},
        });

        const isAvailable = bookings.length === 0;
        return isAvailable;
        
    } catch (error) {

        console.error(error.message);
        
    }
    
}



//API TO CHECK AVAILABILITY OF ROOM

export const checkAvailabilityAPI = async (req, res) => {

    try {

        const { room, checkInDate, checkOutDate} = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room});
        res.json({ success: true , isAvailable})
        
    } catch (error) {

        res.json({success:false, message: error.message})
        
    }
    
}



//API to create a new booking

export const createBooking = async (req, res) => {
    
    try {

        const { room, checkInDate, checkOutDate, guests } = req.body;
        const user = req.user._id;


        //check availability

        const isAvailable = await checkAvailability({
            checkInDate,
            checkOutDate,
            room
        });

        if(!isAvailable){
            return res.json({success: false, message: " Room is not available"})
        }


        //get total price

        const roomData = await Room.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight;

        //calculate total price

        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff/(1000*3600*24));

        totalPrice *= nights;

        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,

        })

        const mailOptions = {

            from: process.env.SENDER_EMAIL,
            to: req.user.email,
            subject: "Hotel Booking Details",
            html: `<h2>Your Booking Details</h2>
                  <p>Dear ${req.user.username},</p>
                  <p>Thanks you for Booking!</p>
                  <ul>
                    <li>Booking ID: ${ booking._id}</li>
                    <li>Hotel Name: ${ roomData.hotel.name}</li>
                    <li>Location: ${ roomData.hotel.address}</li>
                    <li>Date: ${ booking.checkInDate.toDateString()}</li>
                    <li>Booking Amount: ${process.env.CURRENCY || 'Rs'} ${ booking.totalPrice} per night</li>
                  </ul>
                `
                  
                

        }

        await transporter.sendMail(mailOptions)

        



        res.json({success:true, message: "Booking created successfully"})

        
    } catch (error) {

        console.log(error);
        
        res.json({success: false, message:"Failed to create booking"})
        
    }
};


//API TO GET ALL BOOKING FOR A USER

export const getUserBookings = async (req,res) => {

    try {
        
        const user = req.user._id;
        const bookings = await Booking.find({user}).populate("room hotel").sort({createdAt: -1})
        res.json({success: true, bookings})

    } catch (error) {

        res.json({success: false, message: "Failed to fetch bookings"});

        
    }
    
}

export const getHotelBookings = async (req,res) => {
    try {
        
        const hotel = await Hotel.findOne({owner: req.auth.userId});
    if(!hotel){
        return res.json({success: false, message:"No Hotel found"});

    }
    
    const bookings = await Booking.find({hotel: hotel._id}).populate("room hotel user").sort({createdAt: -1});


    //total bookings
    const totalBookings = bookings.length;

    //total revenue

    const totalRevenue = bookings.reduce((acc, booking)=>acc + booking.totalPrice,0)

    res.json({success: true, dashboardData: {totalBookings, totalRevenue,bookings}})

    } catch (error) {

         res.json({success: false, message: "Failed to fetch bookings"})
        
    }
}