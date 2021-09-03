import { getManager, getRepository } from 'typeorm';
import { ListQuestionsQueryArgs, ListQuestionsResponse } from '../../../@types';
import { Resolvers } from '../../../@types/resolvers';
import { Question } from '../../../entities/Question';
import authResolver from '../../../libs/authenticate';

const resolvers: Resolvers = {
  Query: {
    ListQuestions: authResolver(
      async (_, args: ListQuestionsQueryArgs): Promise<ListQuestionsResponse> => {
        const { title, confirm, name, email, cursor } = args;

        try {
          const query = await getManager()
            .createQueryBuilder(Question, 'questions')
            .limit(40)
            .orderBy('questions.created_at', 'DESC')
            .addOrderBy('questions.id', 'DESC');

          if (title) {
            query.andWhere('questions.title like :title', {
              title: `%${title}%`,
            });
          }

          if (confirm) {
            query.andWhere('questions.isConfirm = :confirm', {
              confirm,
            });
          }

          if (name) {
            query.andWhere('questions.name like :name', {
              name: `%${name}%`,
            });
          }

          if (email) {
            query.andWhere('questions.email like :email', {
              email: `%${email}%`,
            });
          }

          if (cursor) {
            const question = await getRepository(Question).findOne({ id: cursor });

            if (!question) {
              return {
                ok: false,
                error: 'Bad Request',
                questions: null,
              };
            }

            query.andWhere('questions.created_at < :date', {
              date: question.created_at,
            });

            query.orWhere('questions.created_at = :date AND questions.id < :id', {
              date: question.created_at,
              id: question.id,
            });
          }

          const questions = await query.getMany();

          return {
            ok: true,
            error: null,
            questions,
          };
        } catch (err: any) {
          return {
            ok: false,
            error: err.message,
            questions: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
