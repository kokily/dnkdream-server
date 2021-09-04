import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { RemoveQuestionMutationArgs, RemoveQuestionResponse } from '../../../@types';
import { Resolvers } from '../../../@types/resolvers';
import { Question } from '../../../entities/Question';

const resolvers: Resolvers = {
  Mutation: {
    RemoveQuestion: async (
      _,
      args: RemoveQuestionMutationArgs,
      { ctx }: { ctx: Context }
    ): Promise<RemoveQuestionResponse> => {
      const { admin_id } = ctx.state;
      const { id } = args;

      if (!admin_id) {
        return {
          ok: false,
          error: '로그인 후 이용하세요',
        };
      }

      try {
        await getRepository(Question).delete(id);

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
