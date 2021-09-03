import { getRepository } from 'typeorm';
import { AddQuestionMutationArgs, AddQuestionResponse } from '../../../@types';
import { Resolvers } from '../../../@types/resolvers';
import { Question } from '../../../entities/Question';

const resolvers: Resolvers = {
  Mutation: {
    AddQuestion: async (
      _,
      args: AddQuestionMutationArgs
    ): Promise<AddQuestionResponse> => {
      const { title, body, name, email, phone } = args;

      try {
        const questionRepo = await getRepository(Question);
        const question = new Question();

        question.title = title;
        question.body = body;
        question.name = name;
        question.email = email;
        question.phone = phone;
        question.isConfirm = false;

        await questionRepo.save(question);

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
