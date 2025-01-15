import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    user: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      minlength: 3 
    },
    phone: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true,
      validate: {
        validator: function(v) {
          try {
            // Add +212 prefix if not present
            const phoneNumber = v.startsWith('+212') ? v : `+212${v}`;
            
            // Validate the phone number format
            const parsed = parsePhoneNumber(phoneNumber, 'MA');
            
            // Check if it's a valid Moroccan number
            return parsed && 
                   parsed.country === 'MA' && 
                   parsed.isValid() && 
                   (parsed.number.startsWith('+2126') || parsed.number.startsWith('+2127'));
          } catch (error) {
            return false;
          }
        },
        message: 'Please enter a valid Moroccan phone number starting with 06 or 07'
      },
      set: function(v) {
        // Standardize format: remove +212 prefix if present, keep only digits
        return v.replace(/^\+212/, '').replace(/\D/g, '');
      }
    },
    password: { 
      type: String, 
      required: true, 
      minlength: 8 
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    activationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;