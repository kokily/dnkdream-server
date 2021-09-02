import { Context } from 'koa';
import { getManager } from 'typeorm';
import { LoginMutationArgs, LoginResponse } from '../../../@types';
import { Resolvers } from '../../../@types/resolvers';
import { Admin } from '../../../entities/Admin';
import { setCookie } from '../../../libs/token';

const resolvers: Resolvers = {
  Mutation: {
    Login: async (
      _,
      args: LoginMutationArgs,
      { ctx }: { ctx: Context }
    ): Promise<LoginResponse> => {
      const { password } = args;

      try {
        const admin = await getManager().createQueryBuilder(Admin, 'admin').getOne();

        if (!admin) {
          return {
            ok: false,
            error: '관리자가 존재하지 않습니다.',
            access_token: null,
            refresh_token: null,
          };
        }

        const valid = await admin.validPassword(password);

        if (!valid) {
          return {
            ok: false,
            error: '비밀번호가 일치하지 않습니다.',
            access_token: null,
            refresh_token: null,
          };
        }

        const tokens = await admin.generateToken();

        setCookie(ctx, tokens);

        return {
          ok: true,
          error: null,
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
        };
      } catch (err: any) {
        return {
          ok: false,
          error: err.message,
          access_token: null,
          refresh_token: null,
        };
      }
    },
  },
};

export default resolvers;
