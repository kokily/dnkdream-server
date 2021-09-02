import { getRepository } from 'typeorm';
import { ReadNoticeQueryArgs, ReadNoticeResponse } from '../../../@types';
import { Resolvers } from '../../../@types/resolvers';
import { Notice } from '../../../entities/Notice';

const resolvers: Resolvers = {
  Query: {
    ReadNotice: async (_, args: ReadNoticeQueryArgs): Promise<ReadNoticeResponse> => {
      const { id } = args;

      try {
        const notice = await getRepository(Notice).findOne(id);

        if (!notice) {
          return {
            ok: false,
            error: '해당 공지사항이 존재하지 않습니다.',
            notice: null,
          };
        }

        return {
          ok: true,
          error: null,
          notice,
        };
      } catch (err: any) {
        return {
          ok: false,
          error: err.message,
          notice: null,
        };
      }
    },
  },
};

export default resolvers;
