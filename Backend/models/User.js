import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Added unique constraint
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "hotelOwner"], default: "user" },
    
    // ADDED: New fields from the form
    phone: { type: String },
    dateOfBirth: { type: Date },

    recentSearchedCities: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;