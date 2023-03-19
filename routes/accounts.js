import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('/GET my bank account')
})

export default router;