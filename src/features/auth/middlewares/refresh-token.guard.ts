import type { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.types";
import { isSuccessResult } from "../../../core/utils/type-guards";
import { usersService } from "../../users/application/users.service";
import { authService } from "../application/auth.service";
import { jwtService } from "../application/jwt.service";

export const refreshTokenGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const verifyResult = await jwtService.verifyToken(token);

  if (!isSuccessResult(verifyResult)) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const userId = verifyResult.data.id;

  const userEntity = await usersService.findById(userId);

  if (!userEntity) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const isTokenBlacklisted = await authService.isTokenBlacklisted(token);

  if (isSuccessResult(isTokenBlacklisted) && isTokenBlacklisted.data) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  req.user = { id: userId };
  next();
};
