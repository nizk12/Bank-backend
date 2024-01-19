import express from 'express'
const router = express.Router()
import { User, validateUser } from '../models/user';
import bcrypt from 'bcrypt'
import _ from 'lodash'
import auth from '../middleware/auth'

router.get("/me", auth, async (req, res) => {
  //@ts-ignore
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post('/', async (req, res) => {
  const result = validateUser(req.body);
  if (!result.success) return res.status(400).send(result.error);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  const { name, email, password, accountType, gender, title, postCode, cob, dob, phone, address } = req.body;

  user = new User({
    name, email, password, accountType, gender, title, postCode, cob, dob, phone, address
  })

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  // @ts-ignore
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});


export default router;
