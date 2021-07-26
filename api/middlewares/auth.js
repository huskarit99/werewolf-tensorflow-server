import jwt from 'jsonwebtoken';
import jwtEnum from '../../utils/enums/jwtEnum.js';
import httpStatusCode from '../../utils/enums/httpStatusCode.js';

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization');
  // Check if not token
  if (!token) {
    res.status(httpStatusCode.CLIENT_ERRORS.UNAUTHORIZED)
      .json({
        isSuccess: false,
        code: jwtEnum.NO_TOKEN
      });
    return;
  }
  // Token whether is valid or not
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(httpStatusCode.CLIENT_ERRORS.UNAUTHORIZED)
      .json({
        isSuccess: false,
        code: jwtEnum.TOKEN_INVALID
      });
  }
};

export default auth;