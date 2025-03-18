const { ApolloServer } = require("@apollo/server");
const { gql } = require("graphql-tag");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Define GraphQL schema

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    getUsers: [User]
    getUser(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    deleteUser(id: ID!): User
  }
`;

module.exports = typeDefs;


// Define resolvers

const resolvers = {
  Query: {
    getUsers: async () => await prisma.user.findMany(),
    getUser: async (_, { id }) => await prisma.user.findUnique({ where: { id } }),
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      return await prisma.user.create({ data: { name, email } });
    },
    deleteUser: async (_, { id }) => {
      return await prisma.user.delete({ where: { id } });
    },
  },
};

module.exports = resolvers;


// Start Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  const { url } = await startStandaloneServer(server, { listen: { port: 4001 } });
  console.log(`🚀 Posts service running at ${url}`);
}

startServer();
