import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
    },

    password: {
      type: String,
    },

    used: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Otp ||
  mongoose.model("Otp", OtpSchema);