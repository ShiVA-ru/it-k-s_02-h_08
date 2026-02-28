import type { Response } from "express";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { IdType } from "../../../../core/types/id.types";
import type { RequestWithUserId } from "../../../../core/types/request.types";
import { isSuccessResult } from "../../../../core/utils/type-guards";
import { authService } from "../../application/auth.service";

export const refreshTokenHandler = async (
  req: RequestWithUserId<IdType>,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    const refreshToken = req.cookies.refreshToken;

    if (!userId || !refreshToken) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }

    const result = await authService.updateTokens(refreshToken, userId);

    if (!isSuccessResult(result)) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }

    res.cookie("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res
      .status(HttpStatus.Ok)
      .json({ accessToken: result.data.accessToken });
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
