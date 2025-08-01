import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { createRoom,  getOwnerRooms , getRooms, toggleRoomAvailability } from "../controllers/roomController.js";


const roomRouter = express.Router();

roomRouter.post('/', upload.array("images", 4 ), protect, createRoom)  // 4 means maximum images
roomRouter.get('/', getRooms)
roomRouter.get('/owner', protect, getOwnerRooms)
roomRouter.post('/toggle-availability', protect, toggleRoomAvailability)


export default roomRouter;