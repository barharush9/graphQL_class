import { gql } from "@apollo/client";

export const GET_GAMES = gql`
  query GetGames {
    games {
      id
      title
      platform
      reviews {
        id
        rating
        content
      }
    }
  }
`;
