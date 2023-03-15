import {
    ListItem,
    TextField,
    Box,
    Button,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Modal,
    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useState } from "react";

const IconWrapper = ({ children, aria, onClick }) => {
    return (
        <>
            <IconButton edge="end" aria-label="{aria}" onClick={onClick}>
                {children}
            </IconButton>
        </>
    );
};

export const Item = ({
    item,
    isUpdating,
    updateItem,
    updateItemText,
    setUpdateItemText,
    setIsUpdating,
    deleteItem,
}) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
        setUpdateItemText(item.item);
    };

    const handleClose = () => {
        setOpen(false);
        setIsUpdating(null);
    };

    return (
        <ListItem key={item._id}>
            {isUpdating === item._id ? (
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            Edit Item
                        </Typography>
                        <form onSubmit={updateItem}>
                            <TextField
                                fullWidth
                                label="New Item"
                                value={updateItemText}
                                onChange={(e) => {
                                    setUpdateItemText(e.target.value);
                                }}
                            />
                            <Box sx={{ textAlign: "end", marginTop: "16px" }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    type="submit"
                                    sx={{ mt: 2 }}
                                >
                                    Edit
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Modal>
            ) : (
                <>
                    <ListItemText primary={item.item} />
                    <ListItemSecondaryAction>
                        <IconWrapper
                            aria="edit"
                            onClick={() => {
                                setIsUpdating(item._id);
                                handleOpen();
                            }}
                        >
                            <EditIcon />
                        </IconWrapper>
                        <IconWrapper
                            aria="delete"
                            onClick={() => {
                                deleteItem(item._id);
                            }}
                        >
                            <DeleteIcon />
                        </IconWrapper>
                    </ListItemSecondaryAction>
                </>
            )}
        </ListItem>
    );
};
