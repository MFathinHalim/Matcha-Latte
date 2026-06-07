import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: {
      type: String,
      unique: true,
    },
    password: String,

    role: {
      type: String,
      enum: [
        "user",
        "admin",
        "superadmin"
      ],
      default: "user"
    },
    province: String,
    city: String,
    district: String,
    village: String,
    isBanned: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);