import React from "react";
import { Container, Typography, Divider } from "@mui/material";
import ItemList from "./components/ItemList";
import AddGameForm from "./components/AddGameForm";

const App: React.FC = () => {
  return (
    <Container>
      <Typography
        variant="h3"
        component="h1"
        sx={{ textAlign: "center", marginTop: 4 }}
      >
        Game Library
      </Typography>
      <AddGameForm />
      <Divider sx={{ marginY: 4 }} />
      <ItemList />
    </Container>
  );
};

export default App;
