// Updated ItemList.tsx with Save Fix
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_GAMES } from "../graphql/queries";
import { DELETE_GAME, UPDATE_GAME } from "../graphql/mutations";
import {
  CircularProgress,
  Box,
  Typography,
  Button,
  TextField,
} from "@mui/material";

const ItemList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_GAMES);
  const [deleteGame] = useMutation(DELETE_GAME);
  const [updateGame] = useMutation(UPDATE_GAME);

  const [editingGame, setEditingGame] = useState<{
    id: string;
    title: string;
    platform: string[];
  } | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newPlatform, setNewPlatform] = useState("");

  const handleDelete = async (id: string) => {
    try {
      await deleteGame({
        variables: { id },
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
            console.error("Error updating cache after deletion:", error);
          }
        },
      });
    } catch (error) {
      console.error("Error deleting the game:", error);
    }
  };

  const handleEditStart = (game: any) => {
    setEditingGame(game);
    setNewTitle(game.title);
    setNewPlatform(game.platform.join(", "));
  };

  const handleEditSave = async () => {
    if (!editingGame) {
      console.error("No game is being edited.");
      return;
    }

    try {
      const trimmedTitle = newTitle.trim();
      const trimmedPlatform = newPlatform
        .split(",")
        .map((plat) => plat.trim())
        .filter((plat) => plat);

      if (!trimmedTitle || trimmedPlatform.length === 0) {
        console.error("Invalid title or platform.");
        return;
      }

      await updateGame({
        variables: {
          id: editingGame.id,
          edits: {
            title: trimmedTitle,
            platform: trimmedPlatform,
          },
        },
        update(cache, { data: { updateGame } }) {
          try {
            const existingGames: any = cache.readQuery({ query: GET_GAMES });

            if (!existingGames || !existingGames.games) {
              console.error("No existing games found in cache.");
              return;
            }

            const updatedGames = existingGames.games.map((game: any) =>
              game.id === editingGame.id ? updateGame : game
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

      setEditingGame(null);
      setNewTitle("");
      setNewPlatform("");
    } catch (error) {
      console.error("Error updating the game:", error);
    }
  };

  const handleEditCancel = () => {
    setEditingGame(null);
    setNewTitle("");
    setNewPlatform("");
  };

  if (loading) return <CircularProgress />;
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box sx={{ padding: 2 }}>
      {data.games.map((game: any) => (
        <Box
          key={game.id}
          sx={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 2,
            padding: 2,
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          {editingGame?.id === game.id ? (
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
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditSave}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleEditCancel}
                >
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h6">{game.title}</Typography>
              <Typography variant="body2" sx={{ marginBottom: 2 }}>
                Platforms: {game.platform.join(", ")}
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEditStart(game)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDelete(game.id)}
                >
                  Delete
                </Button>
              </Box>
            </>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default ItemList;
