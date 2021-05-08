import updateResponseEnum from "../../utils/enums/updateResponseEnum.js";

const updateValidator = (fullname, password) => {
  if (!fullname || fullname === "") {
    return { isSuccess: false, code: updateResponseEnum.FULLNAME_IS_EMPTY }
  }
  if (password && password !== "" && password.length < 6)
    return { isSuccess: false, code: updateResponseEnum.PASSWORD_IS_LESS_THAN_6_LETTERS }
  return { isSuccess: true, code: updateResponseEnum.SUCCESS };
}

export default updateValidator;