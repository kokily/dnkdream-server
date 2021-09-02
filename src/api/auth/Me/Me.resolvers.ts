import { Context } from 'koa';
import { MeResponse } from '../../../@types';
import { Resolvers } from '../../../@types/resolvers';
import authResolver from '../../../libs/authenticate';

const resolvers: Resolvers = {
  Query: {
    Me: authResolver(async (_, __, { ctx }: { ctx: Context }): Promise<MeResponse> => {
      const { admin_id } = ctx.state;

      if (!admin_id) {
        return {
          ok: false,
          error: '로그인 이후 이용해주세요',
          me: null,
        };
      } else {
        return {
          ok: true,
          error: null,
          me: admin_id,
        };
      }
    }),
  },
};

export default resolvers;
