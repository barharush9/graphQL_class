// schema/typeDefs.ts
export const typeDefs = `#graphql
type Game {
  id: ID!
  title: String!
  platform: [String!]!
  reviews: [Review!]
}

type Review {
  id: ID!
  rating: Int!
  content: String!
  game: ID!
  author: Author!
}

type Author {
  id: ID!
  name: String!
  verified: Boolean!
  reviews: [Review!]
}

type Query {
  reviews: [Review]
  review(id: ID!): Review
  games: [Game]
  game(id: ID!): Game
  authors: [Author]
  author(id: ID!): Author
}

type Mutation {
  addGame(game: AddGameInput!): Game
  deleteGame(id: ID!): [Game]
  updateGame(id: ID!,edits:EditsGameInput): Game
}

input AddGameInput {
  title: String!
  platform: [String!]!
  reviews: [ID!]
}

input DeleteGameInput {
    id: ID! 
}
input EditsGameInput {
    title : String
    platform: [String]
}
`;
