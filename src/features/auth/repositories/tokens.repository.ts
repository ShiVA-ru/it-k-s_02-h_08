import { tokensCollection } from "../../../db/mongo";
import type { TokenDb } from "../types/tokens.db.type";

export const tokenBlackListRepository = {
  async addToList(dto: TokenDb): Promise<string> {
    const result = await tokensCollection.insertOne(dto);

    return result.insertedId.toString();
  },

  async findOneByToken(refreshToken: string): Promise<boolean> {
    const item = await tokensCollection.findOne({ refreshToken });

    if (!item) {
      return false;
    }

    return true;
  },
};
