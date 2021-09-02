import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { GraphQLSchema } from 'graphql';
import { IResolvers } from 'graphql-middleware/dist/types';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';

const allTypes: GraphQLSchema[] = fileLoader(
  path.resolve(process.cwd(), './src/api/**/*.graphql')
);

const allResolvers: IResolvers[] = fileLoader(
  path.resolve(__dirname, './../api/**/*.resolvers.*')
);

const typeDefs = mergeTypes(allTypes);
const resolvers = mergeResolvers(allResolvers);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
