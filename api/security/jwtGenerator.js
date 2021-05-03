import jwt from 'jsonwebtoken';

import signInResponseEnum from '../../utils/enums/signInResponseEnum.js';

const jwtGenerator = {
  async createToken(user) {
    const payload = {
      user: {
        id: user.id,
      },
    };
    let result;
    await new Promise((res, rej) => {
      jwt.sign(
        payload,
        process.env.JWT_SECRET, {
        expiresIn: 3600000,
      },
        (err, token) => {
          if (err) {
            result = {
              isSuccess: false,
              code: signInResponseEnum.SERVER_ERROR
            }
          }
          result = {
            isSuccess: true,
            code: signInResponseEnum.SUCCESS,
            token: token
          };
          res("success");
        }
      );
    });
    return result;
  }
}

export default jwtGenerator;