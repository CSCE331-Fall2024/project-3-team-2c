"use client";
import { useState } from "react";
import Button from "@mui/material/Button";
import { Box, Stack, TextField } from "@mui/material";

export default function chatBot() {
  const [messages, setMessages] = useState([
    { role: "Bot", content: "Hi im fAIshonBot! How can I help you today?" },
  ]);
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "User", content: message },
    ]);
    const response = await fetch("api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([...messages, { role: "User", content: message }]),
    });
    const data = await response.json();
    setMessages((messages) => [
      ...messages,
      { role: "Bot", content: data.message },
    ]);
  };

  return (
    <Box
      width={"100vw"}
      height={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Stack
        direction={"column"}
        width={"500px"}
        height={"700px"}
        border={"1px solid black"}
        p={2}
      >
        <Stack
          direction={"column"}
          spacing={2}
          flexGrow={1}
          overflow={"auto"}
          maxHeight={"100%"}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "Bot" ? "flex-start" : "flex-end"
              }
            >
              <Box
                bgcolor={
                  message.role === "Bot" ? "primary.main" : "secondary.main"
                }
                color={"white"}
                borderRadius={16}
                p={4}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={"row"} spacing={2} mt={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button varient="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
