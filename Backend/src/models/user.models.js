import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const UserSchema = mongoose.Schema({
    username:{
      type:String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    role: {
      type: String,
      enum: ['user', 'staff'],
      default: 'user'
    },
    email:{
      type:String,
      required: true,
      unique: true,
      lowercase:true
    },
    password:{
      type:String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    refreshToken:{
      type: String,
    }
  },
  {timestamps: true}
);

UserSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


UserSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password);
}


UserSchema.methods.generateAccessToken = function(){
  return jwt.sign({
    id: this._id,
    username: this.username,
    email: this.email
  }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1h'
  })
}

UserSchema.methods.generateRefreshToken = function(){
  return jwt.sign({
    id: this._id,
  }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d'
  });
}

export const User =  mongoose.model("User", UserSchema);