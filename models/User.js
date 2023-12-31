import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userImage: String,
    email: String,
    firstName: String,
    lastName: String,
    birthday: String,
    phone: String,
    address: String,
    password: String,
    travelHistory: [
      {
        routName: String,
        seatNumber: Number,
        from: String,
        to: String,
        timeFrom: String,
        timeTo: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('User',UserSchema)