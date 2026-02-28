import jwt from "jsonwebtoken";
import config from "../../../core/settings/config";
import type { IdType } from "../../../core/types/id.types";
import { ResultStatus } from "../../../core/types/result.code";
import type { Result } from "../../../core/types/result.type";

export const jwtService = {
  async createToken(
    userId: string,
    tokenExpireTime: number,
  ): Promise<Result<string | null>> {
    try {
      const token = jwt.sign({ id: userId }, config.jwtPrivateKey, {
        expiresIn: tokenExpireTime,
      });
      console.log("tokenExpireTime", tokenExpireTime);

      return {
        status: ResultStatus.Success,
        extensions: [],
        data: token,
      };
    } catch (error) {
      console.error(error);
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Can't create token",
        extensions: [],
        data: null,
      };
    }
  },

  async verifyToken(token: string): Promise<Result<IdType | null>> {
    try {
      const verified = jwt.verify(token, config.jwtPrivateKey) as {
        id: string;
      };
      console.log(jwt.decode(token));
      console.log(verified);
      return {
        status: ResultStatus.Success,
        extensions: [],
        data: verified,
      };
    } catch (error) {
      console.error(error);
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Can't verified token",
        extensions: [],
        data: null,
      };
    }
  },
};
