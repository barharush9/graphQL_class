// server.ts
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./resolver/resolvers";
import { db } from "./_db";

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () => {
      return { db };
    },
  });

  console.log(`🚀 Server ready at ${url}`);
}

startServer().catch((err) => {
  console.error("❌ Failed to start the server:", err);
});
