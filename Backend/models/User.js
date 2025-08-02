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

    // email verification
    isVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    
    // Login attempt tracking fields
    loginAttempts: { type: Number, default: 0 },
    blockUntil: { type: Date, default: null }
}, { timestamps: true });

// Virtual to check if account is currently locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.blockUntil && this.blockUntil > Date.now());
});

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.blockUntil && this.blockUntil < Date.now()) {
    return this.updateOne({
      $unset: {
        blockUntil: 1
      },
      $set: {
        loginAttempts: 1
      }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 attempts for 24 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = {
      blockUntil: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    };
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: {
      loginAttempts: 1,
      blockUntil: 1
    }
  });
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;