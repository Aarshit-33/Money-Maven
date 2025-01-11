import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    avatar: {
      type: String, // cloudinary url
      //   required: true,
    },
    refreshToken: {
      type: String,
      // select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save",async function(){
  if(this.isModified("password")){
      this.password = await bcrypt.hash(this.password,10);
  }
})


// In User model
userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); // `this.password` should be the hashed password
};



export const User = mongoose.model("User", userSchema);
