import React, { useState, useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

import Header from "../components/Header";
import StyledButton from "../components/StyledButton";
import "./roomPage.css";

const socket = io.connect("http://localhost:7000");

const RoomPage = () => {
  const { roomName } = useParams();
  const [roomExists, setRoomExists] = useState(true);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.on("playerJoined" + roomName, (data) => {
      setPlayers([...players, data.playerId]);
    });

    return () => {
      socket.off("playerJoined");
    };
  }, [players, roomName]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        await axios.get(`/api/rooms/${roomName}`);
        setRoomExists(true);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setRoomExists(false);
        } else {
          alert("Error while retrieving room:", error);
        }
      }
    };

    fetchRoom();
  }, [roomName]);

  return (
    <Stack direction="column" alignItems="center">
      <Header title={roomName} />
      {roomExists ? (
        <Box mt={2} width="300px">
          <Typography variant="body1" align="center" mb={4} className="loading">
            Waiting for players
          </Typography>
          {players.map((player) => (
            <p key={player}>player</p>
          ))}
          <StyledButton text="Start" />
        </Box>
      ) : (
        <Typography variant="body1" align="center">
          Room <span style={{ fontWeight: "bold" }}>{roomName}</span> does not
          exist.
        </Typography>
      )}
    </Stack>
  );
};

export default RoomPage;
