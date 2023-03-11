import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import { 
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  Grid,
 } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { styled } from "@mui/material/styles";
 
function App() {
  const [itemText, setItemText] = useState("");
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState("");
  const [updateItemText, setUpdateItemText] = useState("");

  const addItem = async (e) => { 
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5500/api/item",{
        item: itemText,
      });
      setListItems((prev) => [...prev, res.data]);
      setItemText("");
    } catch (error) {
      console.log(error);
    }
  }

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
    try{
      const res = await axios.put(
        `http://localhost:5500/api/item/${isUpdating}`,
        { item: updateItemText }
      );
      console.log(res.data);
      const updateItemIndex = listItems.findIndex(
        (item) => item._id === isUpdating
      );
      const updateItem = (listItems[updateItemIndex].item = updateItemText);
      setUpdateItemText("");
      setIsUpdating("");
    }catch (error){
      console.log(error);
    }
  };

  return (

  )
}

export default App;
