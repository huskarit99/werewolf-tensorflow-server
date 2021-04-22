const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middlewares/auth');

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/users', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      isSuccess: true,
      user: user
    });
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ isSusscess: false }).end();
  }
});

// @route   GET api/auth
// @desc    Validate token
// @access  Private
router.post('/auth-token', auth, async (req, res) => {
  res.status(200).json({
    isSuccess: true
  })
});

module.exports = router;