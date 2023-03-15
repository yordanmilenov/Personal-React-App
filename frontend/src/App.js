import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import {
    errorNotify,
    errorNotifyLength,
    deleteNotify,
    successNotify,
    editNotify,
} from "./notifications";

import { Box, List, Container, TextField, Button, Grid } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

import { useWindowSize } from "./hooks/useWindowSize";
import { Item } from "./Item";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const [itemText, setItemText] = useState("");
    const [listItems, setListItems] = useState([]);
    const [isUpdating, setIsUpdating] = useState("");
    const [updateItemText, setUpdateItemText] = useState("");

    const { width } = useWindowSize();

    const apiUrl = "http://localhost:5500/api/item";

    const getItemsList = async () => {
        try {
            const res = await axios.get(`${apiUrl}s`);
            setListItems(res.data);
        } catch (error) {
            errorNotify();
        }
    };

    const checkTextLength = (text) => {
        if (itemText.length === 0 || itemText.length >= 41) {
            errorNotifyLength();
            return false;
        }
        return true;
    };

    const addItem = async (e) => {
        e.preventDefault();
        if (!checkTextLength(itemText)) {
            return;
        }
        try {
            const res = await axios.post(apiUrl, {
                item: itemText,
            });
            setListItems((prev) => [...prev, res.data]);
            setItemText("");
            successNotify();
        } catch (error) {
            errorNotify();
        }
    };

    const deleteItem = async (id) => {
        try {
            const res = await axios.delete(`${apiUrl}/${id}`);
            const newListItems = listItems.filter((item) => item._id !== id);
            setListItems(newListItems);
            deleteNotify();
        } catch (error) {
            errorNotify();
        }
    };

    const updateItem = async (e) => {
        e.preventDefault();
        if (updateItemText.length === 0 || updateItemText.length >= 41) {
            errorNotifyLength();
            return;
        }
        try {
            const res = await axios.put(`${apiUrl}/${isUpdating}`, {
                item: updateItemText,
            });
            const updatedListItems = [...listItems];
            const updateItemIndex = updatedListItems.findIndex(
                (item) => item._id === isUpdating
            );
            updatedListItems[updateItemIndex] = {
                ...updatedListItems[updateItemIndex],
                item: updateItemText,
            };
            setListItems(updatedListItems);
            setUpdateItemText("");
            setIsUpdating("");
            editNotify();
        } catch (error) {
            errorNotify();
        }
    };

    useEffect(() => {
        getItemsList();
    }, []);

    return (
        <div className="all">
            <Container maxWidth="sm">
                <Box sx={{ mt: 4 }}>
                    <div className="input">
                        <Grid container spacing={2} alignItems="center">
                            <Grid item spacing={6} xs={12} md={8}>
                                <TextField
                                    style={{ rotate: "0.7deg" }}
                                    fullWidth
                                    label="Add Todo Item"
                                    value={itemText}
                                    onChange={(e) => {
                                        setItemText(e.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button
                                    className="addButton"
                                    style={{
                                        backgroundColor: "#707070",
                                        rotate: "0.5deg",
                                    }}
                                    fullWidth
                                    variant="contained"
                                    endIcon={<AddBoxIcon />}
                                    onClick={addItem}
                                >
                                    Add
                                </Button>
                                <ToastContainer
                                    position="top-center"
                                    autoClose={5000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss
                                    draggable
                                    pauseOnHover
                                    theme="colored"
                                />
                            </Grid>
                        </Grid>
                    </div>

                    <div>
                        <List
                            className="list"
                            style={{
                                marginLeft: "-4%",
                                marginTop: "1%",
                                width: "115%",
                                display: "grid",
                                gridTemplateColumns: "auto-fill",
                                gridGap: `${width > 420 ? "4px" : "0px"}`,
                            }}
                        >
                            {listItems.map((item) => (
                                <Item
                                    key={item._id}
                                    item={item}
                                    isUpdating={isUpdating}
                                    updateItem={updateItem}
                                    updateItemText={updateItemText}
                                    setUpdateItemText={setUpdateItemText}
                                    setIsUpdating={setIsUpdating}
                                    deleteItem={deleteItem}
                                />
                            ))}
                        </List>
                    </div>
                </Box>
            </Container>
        </div>
    );
}

export default App;
