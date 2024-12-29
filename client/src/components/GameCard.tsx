// Updated GameCard.tsx with Edit Option
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_GAME, UPDATE_GAME } from "../graphql/mutations";
import { GET_GAMES } from "../graphql/queries";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  TextField,
} from "@mui/material";

interface GameCardProps {
  id: string;
  title: string;
  platform: string[];
  reviewsCount: number;
}

const GameCard: React.FC<GameCardProps> = ({
  id,
  title,
  platform,
  reviewsCount,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newPlatform, setNewPlatform] = useState(platform.join(", "));

  const [deleteGame] = useMutation(DELETE_GAME, {
    update(cache) {
      try {
        const existingGames: any = cache.readQuery({ query: GET_GAMES });

        if (!existingGames || !existingGames.games) {
          console.error("No existing games found in cache.");
          return;
        }

        const updatedGames = existingGames.games.filter(
          (game: any) => game.id !== id
        );

        cache.writeQuery({
          query: GET_GAMES,
          data: { games: updatedGames },
        });
      } catch (error) {
        console.error("Error updating cache:", error);
      }
    },
  });

  const [updateGame] = useMutation(UPDATE_GAME, {
    update(cache, { data: { updateGame } }) {
      try {
        const existingGames: any = cache.readQuery({ query: GET_GAMES });

        if (!existingGames || !existingGames.games) {
          console.error("No existing games found in cache.");
          return;
        }

        const updatedGames = existingGames.games.map((game: any) =>
          game.id === id ? updateGame : game
        );

        cache.writeQuery({
          query: GET_GAMES,
          data: { games: updatedGames },
        });
      } catch (error) {
        console.error("Error updating cache after edit:", error);
      }
    },
  });

  const handleDelete = async () => {
    try {
      await deleteGame({ variables: { id } });
    } catch (error) {
      console.error("Error deleting the game:", error);
    }
  };

  const handleEdit = async () => {
    try {
      await updateGame({
        variables: {
          id,
          edits: { title: newTitle, platform: newPlatform.split(", ") },
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating the game:", error);
    }
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        {isEditing ? (
          <>
            <TextField
              label="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Platforms (comma separated)"
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleEdit}
              sx={{ marginRight: 2 }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h5" component="div">
              {title}
            </Typography>
            <Box
              sx={{ marginTop: 1, display: "flex", gap: 1, flexWrap: "wrap" }}
            >
              {platform.map((plat, index) => (
                <Chip key={index} label={plat} variant="outlined" />
              ))}
            </Box>
            <Typography
              variant="body2"
              sx={{ marginTop: 1, color: "text.secondary" }}
            >
              {reviewsCount} Reviews
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsEditing(true)}
              sx={{ marginRight: 2, marginTop: 2 }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDelete}
              sx={{ marginTop: 2 }}
            >
              Delete
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GameCard;
