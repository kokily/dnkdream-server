import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { ConfirmQuestionMutationArgs, ConfirmQuestionResponse } from '../../../@types';
import { Resolvers } from '../../../@types/resolvers';
import { Question } from '../../../entities/Question';

const resolvers: Resolvers = {
  Mutation: {
    ConfirmQuestion: async (
      _,
      args: ConfirmQuestionMutationArgs,
      { ctx }: { ctx: Context }
    ): Promise<ConfirmQuestionResponse> => {
      const { admin_id } = ctx.state;
      const { id } = args;

      if (!admin_id) {
        return {
          ok: false,
          error: '로그인 후 이용하세요',
        };
      }

      try {
        await getRepository(Question).update(
          { id },
          { isConfirm: true, updated_at: new Date() }
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
