import { useState,useEffect } from "react";

import { Grid, TextField, Button  } from "@mui/material"
import AddBoxIcon from "@mui/icons-material/AddBox";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";


import {
    errorNotify,
    errorNotifyLength,
    successNotify
} from "./notifications";


function TodoForm () {

    const [itemText, setItemText] = useState("");
    const [listItems, setListItems] = useState([]);

    const apiUrl = "https://personal-react-app-cck5.vercel.app/api/item";

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

    return (

    <div className="input">
        <Grid container spacing={2} alignItems="center"> 
            <Grid container item spacing={6} xs={12} md={8}>
                <TextField
                    style={{ rotate: "0.7deg", marginLeft: "11%", marginTop: "14%" }}
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
    );

}

export default TodoForm;