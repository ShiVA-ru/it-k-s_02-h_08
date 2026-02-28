import config from "../../../core/settings/config";
import { ResultStatus } from "../../../core/types/result.code";
import type { Result } from "../../../core/types/result.type";
import { isSuccessResult } from "../../../core/utils/type-guards";
import { mapEntityToViewModel } from "../../users/repositories/mappers/users.entity-map";
import { usersRepository } from "../../users/repositories/users.repository";
import type { UserView } from "../../users/types/users.view.type";
import { tokenBlackListRepository } from "../repositories/tokens.repository";
import { bcryptService } from "./bcrypt.service";
import { jwtService } from "./jwt.service";

export const authService = {
  async loginUser(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
    const userCredentialsResult = await this.checkUserCredentials(
      loginOrEmail,
      password,
    );

    if (!isSuccessResult(userCredentialsResult)) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Credentials is not correct",
        extensions: [],
        data: null,
      };
    }

    const userId = userCredentialsResult.data.id;
    const accessTokenResult = await jwtService.createToken(
      userId,
      +config.accessTokenExpireTime,
    );

    if (!isSuccessResult(accessTokenResult)) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Can't create jwt token",
        extensions: [],
        data: null,
      };
    }

    const refreshTokenResult = await jwtService.createToken(
      userId,
      +config.refreshTokenExpireTime,
    );

    if (!isSuccessResult(refreshTokenResult)) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Can't create jwt token",
        extensions: [],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: {
        accessToken: accessTokenResult.data,
        refreshToken: refreshTokenResult.data,
      },
    };
  },

  async logoutUser(refreshToken: string): Promise<Result<true | null>> {
    const result = await tokenBlackListRepository.addToList({ refreshToken });

    if (!result) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Can't delete jwt token",
        extensions: [],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: true,
    };
  },

  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<UserView | null>> {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user)
      return {
        status: ResultStatus.NotFound,
        errorMessage: "User with this credentials is not found",
        extensions: [],
        data: null,
      };

    const checkPassword = await bcryptService.checkPassword(
      password,
      user.password,
    );

    if (!checkPassword) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "User password is not correct",
        extensions: [],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: mapEntityToViewModel(user),
    };
  },

  async isTokenBlacklisted(
    refreshToken: string,
  ): Promise<Result<boolean | null>> {
    const isExistInBlackList =
      await tokenBlackListRepository.findOneByToken(refreshToken);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: isExistInBlackList,
    };
  },

  async updateTokens(
    refreshToken: string,
    userId: string,
  ): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
    const accessTokenResult = await jwtService.createToken(
      userId,
      +config.accessTokenExpireTime,
    );

    if (!isSuccessResult(accessTokenResult)) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Can't create jwt token",
        extensions: [],
        data: null,
      };
    }

    await tokenBlackListRepository.addToList({ refreshToken });

    const refreshTokenResult = await jwtService.createToken(
      userId,
      +config.refreshTokenExpireTime,
    );

    if (!isSuccessResult(refreshTokenResult)) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Can't create jwt token",
        extensions: [],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: {
        accessToken: accessTokenResult.data,
        refreshToken: refreshTokenResult.data,
      },
    };
  },
};
