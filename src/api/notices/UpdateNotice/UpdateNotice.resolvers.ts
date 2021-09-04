import { getRepository } from 'typeorm';
import { UpdateNoticeMutationArgs, UpdateNoticeResponse } from '../../../@types';
import { Resolvers } from '../../../@types/resolvers';
import authResolver from '../../../libs/authenticate';
import { cleanAllNullArgs } from '../../../libs/utils';
import { Notice } from '../../../entities/Notice';
import { Context } from 'koa';

const resolvers: Resolvers = {
  Mutation: {
    UpdateNotice: async (
      _,
      args: UpdateNoticeMutationArgs,
      { ctx }: { ctx: Context }
    ): Promise<UpdateNoticeResponse> => {
      const { admin_id } = ctx.state;
      const { id } = args;

      if (!admin_id) {
        return {
          ok: false,
          error: '로그인 후 이용하세요',
        };
      }

      try {
        const notNull = cleanAllNullArgs(args);

        await getRepository(Notice).update(
          { id },
          { ...notNull, updated_at: new Date() }
        );

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
