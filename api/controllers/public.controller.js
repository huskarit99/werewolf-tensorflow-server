import express from 'express';

import httpStatusCode from "../../utils/enums/httpStatusCode.js";
import userService from '../../bussiness/services/user.service.js';

const router = express.Router();

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
  '/user',
  async (req, res) => {
    const { fullname, username, password } = req.body;
    const signupResult = userService.signup(fullname, username, password);
    if (!signupResult.isSuccess) {
      res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
        .json({
          isSuccess: false,
          code: signupResult.code
        })
        .end();
      return;
    }
    res.status(httpStatusCode.SUCCESS.OK)
      .send(signupResult);
  }
);

// @route   POST api/auth
// @desc    Auth user & get token
// @access  Public 
router.post(
  '/auth-user',
  async (req, res) => {
    const { username, password } = req.body;
    const signinResult = await userService.signin(username, password);
    if (!signinResult.isSuccess) {
      res.status(httpStatusCode.CLIENT_ERRORS.BAD_REQUEST)
        .json({
          isSuccess: false,
          code: signinResult.code
        })
        .end();
      return;
    }
    res.status(httpStatusCode.SUCCESS.OK)
      .send(signinResult);
  }
);

export default router;