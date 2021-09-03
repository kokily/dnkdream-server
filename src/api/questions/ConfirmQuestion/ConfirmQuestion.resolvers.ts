import { getRepository } from 'typeorm';
import { ConfirmQuestionMutationArgs, ConfirmQuestionResponse } from '../../../@types';
import { Resolvers } from '../../../@types/resolvers';
import { Question } from '../../../entities/Question';
import authResolver from '../../../libs/authenticate';

const resolvers: Resolvers = {
  Mutation: {
    ConfirmQuestion: authResolver(
      async (_, args: ConfirmQuestionMutationArgs): Promise<ConfirmQuestionResponse> => {
        const { id } = args;

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
      }
    ),
  },
};

export default resolvers;
