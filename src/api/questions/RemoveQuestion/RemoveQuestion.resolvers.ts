import { getRepository } from 'typeorm';
import { RemoveQuestionMutationArgs, RemoveQuestionResponse } from '../../../@types';
import { Resolvers } from '../../../@types/resolvers';
import { Question } from '../../../entities/Question';
import authResolver from '../../../libs/authenticate';

const resolvers: Resolvers = {
  Mutation: {
    RemoveQuestion: async (
      _,
      args: RemoveQuestionMutationArgs
    ): Promise<RemoveQuestionResponse> => {
      const { id } = args;

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
