import { getManager, getRepository } from 'typeorm';
import { ListNoticesQueryArgs, ListNoticesResponse } from '../../../@types';
import { Resolvers } from '../../../@types/resolvers';
import { Notice } from '../../../entities/Notice';

const resolvers: Resolvers = {
  Query: {
    ListNotices: async (_, args: ListNoticesQueryArgs): Promise<ListNoticesResponse> => {
      const { title, tag, cursor } = args;

      try {
        const query = await getManager()
          .createQueryBuilder(Notice, 'notices')
          .limit(20)
          .orderBy('notices.created_at', 'DESC')
          .addOrderBy('notices.id', 'DESC');

        if (title) {
          query.andWhere('notices.title like :title', {
            title: `%${title}%`,
          });
        }

        if (tag) {
          query.andWhere(":tag = ANY (string_to_array(notices.tags, ','))", {
            tag,
          });
        }

        if (cursor) {
          const notice = await getRepository(Notice).findOne({ id: cursor });

          if (!notice) {
            return {
              ok: false,
              error: 'Bad Request',
              notices: null,
            };
          }

          query.andWhere('notices.created_at < :date', {
            date: notice.created_at,
          });

          query.orWhere('notices.created_at = :date AND notices.id < :id', {
            date: notice.created_at,
            id: notice.id,
          });
        }

        const notices = await query.getMany();

        return {
          ok: true,
          error: null,
          notices,
        };
      } catch (err: any) {
        return {
          ok: false,
          error: err.message,
          notices: null,
        };
      }
    },
  },
};

export default resolvers;
