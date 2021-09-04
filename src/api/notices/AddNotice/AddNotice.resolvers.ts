import { getRepository } from 'typeorm';
import { AddNoticeMutationArgs, AddNoticeResponse } from '../../../@types';
import { Resolvers } from '../../../@types/resolvers';
import authResolver from '../../../libs/authenticate';
import { Notice } from '../../../entities/Notice';
import { Tag } from '../../../entities/Tag';

const resolvers: Resolvers = {
  Mutation: {
    AddNotice: async (_, args: AddNoticeMutationArgs): Promise<AddNoticeResponse> => {
      const { title, body, thumbnail, tags } = args;

      try {
        if (!tags || tags.length < 1) {
          return {
            ok: false,
            error: '태그가 입력되지 않았습니다',
          };
        }

        tags.map(async (tag) => {
          const exist = await getRepository(Tag).findOne({ name: tag });

          if (exist) {
            await getRepository(Tag).update({ id: exist.id }, { count: exist.count + 1 });
          } else {
            const newTag = new Tag();

            newTag.name = tag;

            await newTag.save();
          }
        });

        const noticeRepo = await getRepository(Notice);
        const notice = new Notice();

        notice.title = title;
        notice.body = body;
        notice.thumbnail = thumbnail;
        notice.tags = tags;

        await noticeRepo.save(notice);

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
