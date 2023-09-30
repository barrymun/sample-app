import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const GRAPHQL_URL = "http://localhost:9000/v1/graphql";
const HASURA_GRAPHQL_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-hasura-admin-secret": HASURA_GRAPHQL_ADMIN_SECRET,
    },
  };
});

export const initialiseApolloClient = () => {
  const client = new ApolloClient({
    // uri: 'http://localhost:9000/v1/graphql',
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  return client;
};
