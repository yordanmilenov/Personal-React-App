import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import {
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Container,
    TextField,
    Button,
    Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";

function App() {
    const [itemText, setItemText] = useState("");
    const [listItems, setListItems] = useState([]);
    const [isUpdating, setIsUpdating] = useState("");
    const [updateItemText, setUpdateItemText] = useState("");

    const addItem = async (e) => {
        e.preventDefault();
        if (itemText.length === 0 || itemText.length >= 41) {
            alert("Item length should be between 1 and 40 characters");
            return;
        }
        try {
            const res = await axios.post("http://localhost:5500/api/item", {
                item: itemText,
            });
            setListItems((prev) => [...prev, res.data]);
            setItemText("");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const getItemsList = async () => {
            try {
                const res = await axios.get("http://localhost:5500/api/items");
                setListItems(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getItemsList();
    }, []);

    const deleteItem = async (id) => {
        try {
            const res = await axios.delete(
                `http://localhost:5500/api/item/${id}`
            );
            const newListItems = listItems.filter((item) => item._id !== id);
            setListItems(newListItems);
        } catch (error) {
            console.log(error);
        }
    };

    const updateItem = async (e) => {
        e.preventDefault();
        if (updateItemText.length === 0 || updateItemText.length >= 41) {
            alert("Item length should be between 1 and 40 characters");
            return;
        }
        try {
            const res = await axios.put(
                `http://localhost:5500/api/item/${isUpdating}`,
                { item: updateItemText }
            );
            console.log(res.data);
            const updateItemIndex = listItems.findIndex(
                (item) => item._id === isUpdating
            );
            const updateItem = (listItems[updateItemIndex].item =
                updateItemText);
            setUpdateItemText("");
            setIsUpdating("");
        } catch (error) {
            console.log(error);
        }
    };

    // useWindowSizeHook for the width to make it responsive
    const useWindowSize = () => {
        const [windowSize, setWindowSize] = React.useState({
            width: undefined,
            height: undefined,
        });

        React.useEffect(() => {
            const handleResize = () =>
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });

            window.addEventListener("resize", handleResize);

            handleResize();

            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }, []);

        return windowSize;
    };

    const { width, height } = useWindowSize();

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
                                    id="item"
                                    name="item"
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
                            </Grid>
                        </Grid>
                    </div>

                    <div>
                        {width < 420 ? (
                            <>
                                <List
                                    style={{
                                        marginLeft: "15%",
                                        marginTop: "1%",
                                        width: "120%",
                                        display: "grid",
                                        gridTemplateColumns: "auto-fill",
                                    }}
                                >
                                    {listItems.map((item) => (
                                        <ListItem key={item._id}>
                                            {isUpdating === item._id ? (
                                                <form
                                                    onSubmit={updateItem}
                                                    style={{ width: "100%" }}
                                                >
                                                    <TextField
                                                        style={{
                                                            bottom: "20px",
                                                        }}
                                                        fullWidth
                                                        id="newItem"
                                                        name="newItem"
                                                        label="New Item"
                                                        value={updateItemText}
                                                        onChange={(e) => {
                                                            setUpdateItemText(
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                    <Box
                                                        sx={{
                                                            textAlign: "end",
                                                        }}
                                                    >
                                                        <Button
                                                            style={{
                                                                bottom: "30px",
                                                            }}
                                                            variant="outlined"
                                                            color="primary"
                                                            type="submit"
                                                            sx={{ mt: 2 }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </Box>
                                                </form>
                                            ) : (
                                                <>
                                                    <ListItemText
                                                        primary={item.item}
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="edit"
                                                            onClick={() => {
                                                                setIsUpdating(
                                                                    item._id
                                                                );
                                                            }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="delete"
                                                            onClick={() => {
                                                                deleteItem(
                                                                    item._id
                                                                );
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </>
                                            )}
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        ) : (
                            <List
                                className="list"
                                style={{
                                    marginLeft: "15%",
                                    marginTop: "1%",
                                    width: "120%",
                                    display: "grid",
                                    gridTemplateColumns: "auto-fill",
                                    gridGap: "4px",
                                }}
                            >
                                {listItems.map((item) => (
                                    <ListItem key={item._id}>
                                        {isUpdating === item._id ? (
                                            <form
                                                onSubmit={updateItem}
                                                style={{ width: "100%" }}
                                            >
                                                <TextField
                                                    style={{ bottom: "20px" }}
                                                    fullWidth
                                                    id="newItem"
                                                    name="newItem"
                                                    label="New Item"
                                                    value={updateItemText}
                                                    onChange={(e) => {
                                                        setUpdateItemText(
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                                <Box sx={{ textAlign: "end" }}>
                                                    <Button
                                                        style={{
                                                            bottom: "30px",
                                                        }}
                                                        variant="outlined"
                                                        color="primary"
                                                        type="submit"
                                                        sx={{ mt: 2 }}
                                                    >
                                                        Edit
                                                    </Button>
                                                </Box>
                                            </form>
                                        ) : (
                                            <>
                                                <ListItemText
                                                    primary={item.item}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="edit"
                                                        onClick={() => {
                                                            setIsUpdating(
                                                                item._id
                                                            );
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="delete"
                                                        onClick={() => {
                                                            deleteItem(
                                                                item._id
                                                            );
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </div>
                </Box>
            </Container>
        </div>
    );
}

export default App;
