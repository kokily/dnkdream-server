import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { RemoveNoticeMutationArgs, RemoveNoticeResponse } from '../../../@types';
import { Resolvers } from '../../../@types/resolvers';
import { Notice } from '../../../entities/Notice';

const resolvers: Resolvers = {
  Mutation: {
    RemoveNotice: async (
      _,
      args: RemoveNoticeMutationArgs,
      { ctx }: { ctx: Context }
    ): Promise<RemoveNoticeResponse> => {
      const { admin_id } = ctx.state;
      const { id } = args;

      if (!admin_id) {
        return {
          ok: false,
          error: '로그인 후 이용하세요',
        };
      }

      try {
        await getRepository(Notice).delete(id);

        return {
          ok: true,
          error: null,
        };
      } catch (err: any) {
        return {
          ok: false,
          error: err.message,
        };
      }
    },
  },
};

export default resolvers;
