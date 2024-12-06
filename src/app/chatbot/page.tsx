"use client";
import { useState } from "react";
import { Box, Stack, TextField, Button } from "@mui/material";
import Link from "next/link";

// Define the structure of the message response from the bot
interface BotResponse {
  message: string;
}


/**
 * ChatBot Component
 * 
 * This component provides a chat interface where users can interact with BambooBot, a conversational assistant.
 * It includes functionality to send user messages, receive bot responses, and display the conversation in a chat-like format.
 * 
 * **Key Features:**
 * - **Message Input:** Allows users to type messages using a text input field.
 * - **Message Display:** Renders chat messages in a scrollable view with visual distinction between bot and user messages.
 * - **Message Sending:** Sends user messages to a backend API (`/api/chatbot`) for bot responses.
 * - **Customer Navigation:** Includes a button to navigate back to the customer page (`/Customer`).
 * 
 * **API Integration:**
 * - Sends a POST request to `/api/chatbot` with the chat history, including the latest user message.
 * - Expects a response containing the bot's reply in the format `{ message: string }`.
 * 
 * @returns {JSX.Element} A chat interface for interacting with BambooBot.
 */

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { role: "Bot", content: "Hi, I'm BambooBot! How can I help you today?" },
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

    // Type assertion to ensure that the response is treated as a BotResponse
    const data = await response.json() as BotResponse; 

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
      bgcolor="#FEC6B5"
    >
      {/* Customer Button */}
      <Button
        sx={{
          backgroundColor: "#d32f2f", // Red color
          color: "white",
          alignSelf: "start",
          margin: "10px",
          fontWeight: "bold",
          '&:hover': { backgroundColor: "#f44336" },
        }}
      >
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
          width={"100%"}
          maxWidth={"500px"}
          height={"80%"}
          border={"1px solid #ddd"}
          borderRadius={3}
          boxShadow={3}
          bgcolor="white"
          p={2}
          spacing={2}
        >
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            paddingBottom={2}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Chat with BambooBot</h2>
          </Box>

          {/* Chat Messages */}
          <Stack
            direction={"column"}
            spacing={2}
            flexGrow={1}
            overflow={"auto"}
            maxHeight={"100%"}
            padding={1}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={message.role === "Bot" ? "flex-start" : "flex-end"}
              >
                <Box
                  bgcolor={message.role === "Bot" ? "#f44336" : "orange"}
                  color={"white"}
                  borderRadius={16}
                  p={3}
                  maxWidth={"80%"}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </Stack>

          {/* Message Input Section */}
          <Stack direction={"row"} spacing={2} mt={2} alignItems="center">
            <TextField
              label="Type your message"
              fullWidth
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: "#ddd", 
                  },
                  '&:hover fieldset': {
                    borderColor: "#bbb", 
                  },
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#d82c2c",
                color: "white",
                '&:hover': { backgroundColor: "#f44336" },
              }}
              onClick={async () => {
                await sendMessage();
                console.log("Message sent");
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
