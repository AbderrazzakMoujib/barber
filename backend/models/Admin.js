import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  adminCode: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 60
  },
  role: {
    type: String,
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

adminSchema.pre('save', async function(next) {
  if (!this.isModified('adminCode')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.adminCode = await bcrypt.hash(this.adminCode, salt);
});

adminSchema.methods.matchCode = async function(enteredCode) {
  return await bcrypt.compare(enteredCode, this.adminCode);
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
