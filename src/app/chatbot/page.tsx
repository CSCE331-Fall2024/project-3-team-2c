"use client";
import { useState } from "react";
import { Box, Stack, TextField, Button } from "@mui/material";
import MenuBar from '../_components/customer_menu_bar';
import Link from "next/link";

export default function ChatBot() {
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
    const response = await fetch("api/chatbot", {
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
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Button
        sx={{
          backgroundColor: "red",
          color: "white",
          alignSelf: "start",
          margin: "10px",
        }}
      >
        {" "}
        <Link href="/Customer" passHref>
          customer
        </Link>
      </Button>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
      >
        <Stack
          direction={"column"}
          width={"500px"}
          height={"600px"}
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
            <Button
              varient="contained"
              onClick={(e) => {
                sendMessage();
                console.log("CLICKED");
              }}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}