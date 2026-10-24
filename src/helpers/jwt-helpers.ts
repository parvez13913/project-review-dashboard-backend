import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const signToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string,
): string => {
  return jwt.sign(
    payload,
    secret as Secret,
    {
      expiresIn: expireTime,
    } as jwt.SignOptions,
  );
};

const verifiedToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const JwtHelpers = {
  signToken,
  verifiedToken,
};
