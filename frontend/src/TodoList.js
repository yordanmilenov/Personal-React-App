import { useState,useEffect } from "react";
import {
    errorNotify,
    errorNotifyLength,
    deleteNotify,
    editNotify,
} from "./notifications";
import axios from "axios";


import { useWindowSize } from "./hooks/useWindowSize";
import { Item } from "./Item";
import { List } from "@mui/material";


function TodoList () {

    const [listItems, setListItems] = useState([]);
    const { width } = useWindowSize();
    const [isUpdating, setIsUpdating] = useState("");
    const [updateItemText, setUpdateItemText] = useState("");

    const apiUrl = "https://personal-react-app-cck5.vercel.app/api/item";


    const getItemsList = async () => {
        try {
            const res = await axios.get(`${apiUrl}s`);
            setListItems(res.data);
        } catch (error) {
            errorNotify();
        }
    };
    
    useEffect(() => {
        getItemsList();
    }, []);
    
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



    return ( 

        <div>
                        <List
                            className="list"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "baseline",
                                alignContent: "center",
                                marginLeft: "1%",
                                marginTop: "1%",
                                width: "109%",
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

    )

};

export default TodoList;