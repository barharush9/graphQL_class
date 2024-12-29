import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_GAME } from "../graphql/mutations";
import { GET_GAMES } from "../graphql/queries";
import { TextField, Button, Box } from "@mui/material";

const AddGameForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [addGame] = useMutation(ADD_GAME, {
    update(cache, { data: { addGame } }) {
      const existingGames: any = cache.readQuery({ query: GET_GAMES });
      cache.writeQuery({
        query: GET_GAMES,
        data: { games: [...existingGames.games, addGame] },
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addGame({
        variables: {
          game: {
            title,
            platform: platform.split(","),
          },
        },
      });
      setTitle("");
      setPlatform("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}
    >
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="Platforms (comma separated)"
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Add Game
      </Button>
    </Box>
  );
};

export default AddGameForm;
