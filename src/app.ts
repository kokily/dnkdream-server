import { ApolloServer } from 'apollo-server-koa';
import Koa, { Context } from 'koa';
import Router from 'koa-router';
import cors from '@koa/cors';
import bodyParser from 'koa-body';
import schema from './libs/schema';

const app = new Koa();
const router = new Router();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://dnkdream.com'
        : 'http://localhost:3000',
  })
);
app.use(bodyParser({ multipart: true }));
app.use(router.routes());
app.use(router.allowedMethods());

const apollo = new ApolloServer({
  schema,
  context: ({ ctx }: { ctx: Context }) => {
    return {
      ctx,
    };
  },
});

router.get('/graphql', apollo.getMiddleware());
router.post('/graphql', apollo.getMiddleware());

apollo.applyMiddleware({ app, cors: false });

export default app;
