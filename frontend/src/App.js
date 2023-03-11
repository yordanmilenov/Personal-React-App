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
    <div >
      <AppBar position='static' sx={{backgroundColor: '#B87333'}}>
        <Toolbar >
          <Typography variant='h4' style={{ fontFamily: 'Times New Roman', fontSize: '60px'}} component='div' sx={{ flexGrow: 1, textAlign: 'center'}}>
            TO DO APP
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth='sm'>
        <Box sx={{ mt:4 }}>
          <Grid container spacing={2} alignItems='center'>
              <Grid item xs={12} md={8} >
                <TextField
                  style={{top: '10px'}}
                  fullWidth
                  id='item'
                  name='item'
                  label='Add Todo Item'
                  value={itemText}
                  onChange={e => { setItemText(e.target.value) }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button 
                    style={{left: '50px', top: '10px'}}
                    fullWidth
                    variant='contained'
                    endIcon={<AddBoxIcon />}
                    onClick={addItem}
                >
                  Add
                </Button>
              </Grid>
          </Grid>

          <List>
            {listItems.map(item => (
              <ListItem key={item._id}>
                {isUpdating === item._id ? (
                  <form onSubmit={updateItem} style={{ width: '100%'}}>
                    <TextField 
                        fullWidth
                        id='newItem'
                        name='newItem'
                        label='New Item'
                        value={updateItemText}
                        onChange={e => { setUpdateItemText(e.target.value)}}
                    />
                    <Box sx={{ textAlign: 'end' }}>
                      <Button 
                          variant='outlined'
                          color='primary'
                          type='submit'
                          sx={{ mt: 2 }}
                      >
                        Edit
                      </Button>
                    </Box>
                  </form>
                ) : (
                    <>
                        <ListItemText primary={item.item} />
                        <ListItemSecondaryAction>
                            <IconButton 
                              style={{left: '45px'}}
                              edge='end'
                              aria-label='edit'
                              onClick={() => { setIsUpdating(item._id)}}
                            >
                              <EditIcon /> 
                            </IconButton>
                            <IconButton
                                style={{left: '55px'}}
                                edge='end'
                                aria-label='delete'
                                onClick={() => { deleteItem(item._id) }}
                            >
                              <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </> 
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>

    </div>
  )
}

export default App;
