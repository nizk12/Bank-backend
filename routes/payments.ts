import express from 'express'
const router = express.Router()
import { Payment } from '../models/payment'
import { User } from '../models/user';
import { parseInt } from 'lodash';
import auth from '../middleware/auth';
import validateId from '../middleware/validateId';
import mongoose from 'mongoose';

router.get('/', async (req, res) => {
  const payments = await Payment.find().populate('party')
  res.status(200).send(payments);
});

router.get('/all', auth, async (req, res) => {
  // @ts-ignore
  const payment = await Payment.find({ party: req.user._id }).populate('party').sort({ date: -1 }).limit(5);
  if (!payment) return res.status(200).send('No payment found');
  res.status(200).send(payment);
});

router.get('/:id', validateId, async (req, res) => {
  const payment = await Payment.find({ party: req.params.id }).populate('party').sort({ date: -1 }).limit(5)
  if (!payment) return res.status(200).send('No payment found');
  res.status(200).send(payment);
});

router.post('/', async (req, res) => {
  const { sender, receiver, amount, date } = req.body;

  if (!mongoose.Types.ObjectId.isValid(sender))
    return res.status(404).send('Invalid sender ID.');
  if (!mongoose.Types.ObjectId.isValid(receiver))
    return res.status(404).send('Invalid receiver ID.');

  let party1 = await User.findById(sender)
  if (!party1) return res.status(400).send('Invalid Sender Id')

  let party2 = await User.findById(receiver)
  if (!party2) return res.status(400).send('Invalid Receiver Id')

  if (party1?.balance && party1?.balance! > parseInt(amount)) {
    const party1NewBalance = party1?.balance - parseInt(amount)

    // record for sender, entry = out
    await Payment.create({
      party: sender, target: party2?.name, entry: 'OUT', amount: parseInt(amount), date
    })

    // update sender balance
    const p1 = party1 = await User.findByIdAndUpdate(
      sender, {
      $set: {
        balance: party1NewBalance
      },
    },
      { new: true }
    )

    // record for reciever,entry = in
    await Payment.create({
      party: receiver, target: party1?.name, entry: 'IN', amount: parseInt(amount), date
    })

    const party2NewBalance = party2.balance + parseInt(amount)

    // update receiver balance
    const p2 = party2 = await User.findByIdAndUpdate(
      receiver, {
      $set: {
        balance: party2NewBalance
      },
    },
      { new: true }
    )
    return res.status(200).send([p1, p2]);
  }

  return res.status(400).send('You do not have enough balance');
});

export default router; 
