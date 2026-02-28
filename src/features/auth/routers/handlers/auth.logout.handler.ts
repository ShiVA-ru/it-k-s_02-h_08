import type { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import { isSuccessResult } from "../../../../core/utils/type-guards";
import { authService } from "../../application/auth.service";

export const logoutHandler = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }

    const result = await authService.logoutUser(refreshToken);

    if (!isSuccessResult(result)) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }

    res.clearCookie("refreshToken");

    return res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
