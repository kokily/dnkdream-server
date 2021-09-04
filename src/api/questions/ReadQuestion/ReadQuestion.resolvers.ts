import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { ReadQuestionQueryArgs, ReadQuestionResponse } from '../../../@types';
import { Resolvers } from '../../../@types/resolvers';
import { Question } from '../../../entities/Question';

const resolvers: Resolvers = {
  Query: {
    ReadQuestion: async (
      _,
      args: ReadQuestionQueryArgs,
      { ctx }: { ctx: Context }
    ): Promise<ReadQuestionResponse> => {
      const { admin_id } = ctx.state;
      const { id } = args;

      if (!admin_id) {
        return {
          ok: false,
          error: '로그인 후 이용하세요',
          question: null,
        };
      }

      try {
        const question = await getRepository(Question).findOne(id);

        if (!question) {
          return {
            ok: false,
            error: '존재하지 않는 질문입니다.',
            question: null,
          };
        }

        return {
          ok: true,
          error: null,
          question,
        };
      } catch (err: any) {
        return {
          ok: false,
          error: err.message,
          question: null,
        };
      }
    },
  },
};

export default resolvers;
