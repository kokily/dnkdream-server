import { Context } from 'koa';
import { LogoutResponse } from '../../../@types';
import { Resolvers } from '../../../@types/resolvers';
import authResolver from '../../../libs/authenticate';
import { setCookie } from '../../../libs/token';

const resolvers: Resolvers = {
  Mutation: {
    Logout: async (_, __, { ctx }: { ctx: Context }): Promise<LogoutResponse> => {
      setCookie(ctx);

      return {
        ok: true,
        error: null,
      };
    },
  },
};

export default resolvers;
