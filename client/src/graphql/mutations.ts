import { gql } from "@apollo/client";

export const ADD_GAME = gql`
  mutation AddGame($game: AddGameInput!) {
    addGame(game: $game) {
      id
      title
      platform
    }
  }
`;

export const UPDATE_GAME = gql`
  mutation UpdateGame($id: ID!, $edits: EditsGameInput!) {
    updateGame(id: $id, edits: $edits) {
      id
      title
      platform
    }
  }
`;

export const DELETE_GAME = gql`
  mutation DeleteGame($id: ID!) {
    deleteGame(id: $id) {
      id
      title
      platform
    }
  }
`;
