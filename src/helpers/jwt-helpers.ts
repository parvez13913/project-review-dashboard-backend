import jwt, { Secret } from "jsonwebtoken";

const signToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string,
): string =>
  jwt.sign(payload, secret, {
    expiresIn: expireTime as jwt.SignOptions["expiresIn"],
  });

export const JwtHelpers = {
  signToken,
};
