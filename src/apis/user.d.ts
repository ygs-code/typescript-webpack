export type CaptchaServiceResult = {
  token: string;
  svg: string;
}

export type IsUserIdExist = {
  Email: string;
}

export type IsUserIdExistResult = {
  isExist: boolean;
}