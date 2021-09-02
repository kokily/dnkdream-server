import { Context } from 'koa';
import { getRepository } from 'typeorm';
import { Admin } from '../entities/Admin';
import { AccessTokenType, decodeToken, RefreshTokenType, setCookie } from './token';

export const tokenRefresh = async (ctx: Context, refreshToken: string) => {
  try {
    const decoded = await decodeToken<RefreshTokenType>(refreshToken);
    const admin = await getRepository(Admin).findOne(decoded.admin_id);
    if (!admin) {
      const error = new Error('InvalidUserError');
      throw error;
    }
    const tokens = await admin.refreshAdminToken(
      decoded.token_id,
      decoded.exp,
      refreshToken
    );
    setCookie(ctx, tokens);
    return decoded.admin_id;
  } catch (err) {
    throw err;
  }
};

const authResolver = (resolverFunction) => async (parent, args, context, info) => {
  const { ctx }: { ctx: Context } = context;
  let accessToken: string | undefined = ctx.cookies.get('access_token');
  const refreshToken: string | undefined = ctx.cookies.get('refresh_token');

  const { authorization } = ctx.request.headers;

  if (!accessToken && authorization) {
    accessToken = authorization.split(' ')[1];
  }

  try {
    if (!accessToken) {
      throw new Error('NoAccessToken');
    }

    const accessTokenData = await decodeToken<AccessTokenType>(accessToken);

    ctx.state.admin_id = accessTokenData.admin_id;

    const diff = accessTokenData.exp * 1000 - new Date().getTime();

    if (diff < 1000 * 60 * 30 && refreshToken) {
      await tokenRefresh(ctx, refreshToken);
    }
  } catch (err) {
    if (!refreshToken) throw new Error(err);

    try {
      const admin_id = await tokenRefresh(ctx, refreshToken);

      ctx.state.admin_id = admin_id;
    } catch (err) {
      console.error(err);
    }
  }

  const resolved = await resolverFunction(parent, args, context, info);

  return resolved;
};

export default authResolver;
