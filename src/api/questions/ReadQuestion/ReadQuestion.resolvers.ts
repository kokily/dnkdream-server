import { getRepository } from 'typeorm';
import { ReadQuestionQueryArgs, ReadQuestionResponse } from '../../../@types';
import { Resolvers } from '../../../@types/resolvers';
import { Question } from '../../../entities/Question';

const resolvers: Resolvers = {
  Query: {
    ReadQuestion: async (
      _,
      args: ReadQuestionQueryArgs
    ): Promise<ReadQuestionResponse> => {
      const { id } = args;

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
