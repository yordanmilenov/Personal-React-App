import React from "react";
import "./App.css";
import { Box, Container } from "@mui/material";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";


function App() {
    return (        
        <div className="all">
            <Container maxWidth="sm">
                <Box sx={{ mt: 4 }}>
                   <TodoForm />
                   <TodoList /> 
                </Box>
            </Container>
        </div>
    );
}

export default App;
