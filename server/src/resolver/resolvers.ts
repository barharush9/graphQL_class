import { Author, db, Game, Review } from "../_db";
import { v4 as uuidv4 } from "uuid";

interface BaseArg {
  id: string;
}

interface AddGameInput {
  title: string;
  platform: string[];
}
interface DeleteGameInput {
  id: string;
  title?: string;
  platform?: string[];
}
interface EditGameInput {
  title?: string;
  platform?: string[];
}
interface UpdateGameInput {
  id: string;
  edits: EditGameInput;
}

export const resolvers = {
  Query: {
    games() {
      return db.games;
    },
    game(_: any, { id }: BaseArg) {
      return db.games.find((game) => game.id === id);
    },
    authors() {
      return db.authors;
    },
    author(_: any, { id }: BaseArg) {
      return db.authors.find((author) => author.id === id);
    },
    reviews() {
      return db.reviews;
    },
    review(_: any, { id }: BaseArg) {
      return db.reviews.find((review) => review.id === id);
    },
  },
  Game: {
    reviews(parent: Game) {
      return db.reviews.filter((review) => review.gameId === parent.id);
    },
  },
  Author: {
    reviews(parent: Author) {
      return db.reviews.filter((review) => review.authorId === parent.id);
    },
  },
  Review: {
    author(parent: Review) {
      return db.authors.find((author) => author.id === parent.authorId);
    },
    game(parent: Review) {
      return db.games.find((game) => game.id === parent.gameId);
    },
  },
  Mutation: {
    addGame(_: any, args: { game: AddGameInput }) {
      const game = {
        ...args.game,
        id: uuidv4(),
        reviews: [],
      };
      if (!Array.isArray(db.games)) {
        console.error("db.games is not an array");
        db.games = [];
      }
      db.games.push(game);
      console.log("game added successfully", game);
      return game;
    },

    updateGame(_: any, args: { id: string; edits: Partial<Game> }) {
      try {
        const { id, edits } = args;
        const gameIndex = db.games.findIndex((game) => game.id === id);
        if (gameIndex === -1) {
          throw new Error(`Game with id ${id} not found`);
        }
        const updatedGame = {
          ...db.games[gameIndex],
          ...edits,
        };
        db.games[gameIndex] = updatedGame;
        console.log("game updated successfully", updatedGame);
        return updatedGame;
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error("An unknown error occurred");
        }
      }
    },

    deleteGame(_: any, args: { id: string }) {
      try {
        const { id } = args;
        console.log(id);
        const gamesWithoutThisId = db.games.filter((game) => game.id !== id);
        if (gamesWithoutThisId.length === db.games.length) {
          throw new Error(`Game with id ${id} not found`);
        } else {
          db.games = gamesWithoutThisId;
          console.log("game deleted successfully", id);
          return gamesWithoutThisId;
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error("An unknown error occurred");
        }
      }
    },
  },
};
