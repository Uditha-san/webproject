import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: { type: String, required: true ,select: false},
    role: {type: String, enum: ["user", "hotelOwner"], default: "user"},
    recentSearchedCities: [String],


    // New fields for email verification
  isVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },

  //  Password reset
  resetToken: { type: String },
  resetTokenExpires: { type: Date }

  
}, {timestamps: true});

const User = mongoose.models.User || mongoose.model("User", userSchema);


export default User;