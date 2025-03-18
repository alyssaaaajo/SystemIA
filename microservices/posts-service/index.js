const { ApolloServer } = require("@apollo/server");
const { gql } = require("graphql-tag");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Define GraphQL schema
const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
  }

  type Query {
    posts: [Post]
    post(id: ID!): Post
  }

  type Mutation {
    createPost(title: String!, content: String!): Post
    updatePost(id: ID!, title: String, content: String): Post
    deletePost(id: ID!): Post
  }
`;

// Define resolvers
const resolvers = {
  Query: {
    posts: async () => await prisma.post.findMany(),
    post: async (_, { id }) => await prisma.post.findUnique({ where: { id: parseInt(id) } }),
  },
  Mutation: {
    createPost: async (_, { title, content }) => {
      return await prisma.post.create({ data: { title, content } });
    },
    updatePost: async (_, { id, title, content }) => {
      return await prisma.post.update({ where: { id: parseInt(id) }, data: { title, content } });
    },
    deletePost: async (_, { id }) => {
      return await prisma.post.delete({ where: { id: parseInt(id) } });
    },
  },
};

// Start Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  const { url } = await startStandaloneServer(server, { listen: { port: 4002 } });
  console.log(`🚀 Posts service running at ${url}`);
}

startServer();
