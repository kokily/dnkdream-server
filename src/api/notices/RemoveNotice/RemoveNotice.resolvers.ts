import { getRepository } from 'typeorm';
import { RemoveNoticeMutationArgs, RemoveNoticeResponse } from '../../../@types';
import { Resolvers } from '../../../@types/resolvers';
import { Notice } from '../../../entities/Notice';
import authResolver from '../../../libs/authenticate';

const resolvers: Resolvers = {
  Mutation: {
    RemoveNotice: authResolver(
      async (_, args: RemoveNoticeMutationArgs): Promise<RemoveNoticeResponse> => {
        const { id } = args;

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
      }
    ),
  },
};

export default resolvers;
