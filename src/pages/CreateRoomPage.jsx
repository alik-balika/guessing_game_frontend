import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../components/Header";
import StyledButton from "../components/StyledButton";

const CreateRoomPage = () => {
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  const navigateToRoomPage = async () => {
    const trimmed = roomName.trim();
    if (!trimmed) {
      alert("Please enter a room name!");
      return;
    }

    try {
      await axios.post("/api/rooms", { name: roomName });
      navigate(`/room/${roomName}`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(
          "A room with this name already exists. Please choose a different name."
        );
      } else {
        alert("Error creating room:", error);
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100dvh"
    >
      <Header title="Create a Room" />
      <Box mt={2} width="300px">
        <TextField
          placeholder="Room Name"
          variant="outlined"
          color="secondary"
          fullWidth
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <StyledButton text="Create" onClick={navigateToRoomPage} />
      </Box>
    </Box>
  );
};

export default CreateRoomPage;
