import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { z } from 'zod'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 1024
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  accountType: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  balance: {
    type: Number,
    required: true,
    default: 100
  },
  gender: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  postCode: {
    type: String,
    required: true,
  },
  cob: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  }
});


userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.jwtPrivateKey!
  );
  return token;
};

const User = mongoose.model("User", userSchema);

const schema = z.object({
  name: z.string().min(3).max(1024),
  email: z.string().email().min(5).max(1024),
  password: z.string().min(5).max(1024),
  accountType: z.string(),
})

function validateUser(user: z.infer<typeof schema>) {
  return schema.safeParse(user);
}

export { User, validateUser }
