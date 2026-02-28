import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { userInputDtoValidation } from "../../users/validation/users.input-dto.validation.middleware";
import { accessTokenGuardMiddleware } from "../middlewares/access-token.guard";
import { loginInputDtoValidation } from "../validation/auth.input-dto.validation.middleware";
import { confirmationCodeValidation } from "../validation/auth.registration-confirm.validation.middleware";
import { emailValidation } from "../validation/auth.registration-resending.validation.middleware";
import { loginHandler } from "./handlers/auth.login.handler";
import { getMeHandler } from "./handlers/auth.me.get-user.hanler";
import { registrationHandler } from "./handlers/auth.registration.handler";
import { registrationConfirmationHandler } from "./handlers/auth.registration-confirmation.handler";
import { registrationEmailResendingHandler } from "./handlers/auth.registration-email-resending.handler";
import { refreshTokenHandler } from "./handlers/auth.refresh-token.handler";
import { refreshTokenGuardMiddleware } from "../middlewares/refresh-token.guard";
import { logoutHandler } from "./handlers/auth.logout.handler";

export const authRouter = Router();

authRouter
  .post(
    "/login",
    loginInputDtoValidation,
    inputValidationResultMiddleware,
    loginHandler,
  )
  .post("/logout", refreshTokenGuardMiddleware, logoutHandler)

  .post("/refresh-token", refreshTokenGuardMiddleware, refreshTokenHandler)

  .get("/me", accessTokenGuardMiddleware, getMeHandler)

  .post(
    "/registration",
    userInputDtoValidation,
    inputValidationResultMiddleware,
    registrationHandler,
  )

  .post(
    "/registration-confirmation",
    confirmationCodeValidation,
    inputValidationResultMiddleware,
    registrationConfirmationHandler,
  )

  .post(
    "/registration-email-resending",
    emailValidation,
    inputValidationResultMiddleware,
    registrationEmailResendingHandler,
  );
