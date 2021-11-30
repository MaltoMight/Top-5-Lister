import { useContext, useState } from "react";
import { GlobalStoreContext } from "../store";
import TextField from "@mui/material/TextField";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import { Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";

/*

    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/

function ListCard(props) {
  const { store } = useContext(GlobalStoreContext);
  const [editActive, setEditActive] = useState(false);
  const [text, setText] = useState("");
  const { idNamePair } = props;

  function containerTop() {
    return (
      <Grid container direction="row">
        <Grid item xs={10}>
          <Typography>List Title</Typography>
          <Typography>Author(optional in some cases)</Typography>
        </Grid>
        <ThumbUpAltOutlinedIcon></ThumbUpAltOutlinedIcon>
        <Grid item xs={1}>
          <Typography>1000</Typography>
        </Grid>
        <ThumbUpAltOutlinedIcon></ThumbUpAltOutlinedIcon>

        <Grid item>
          <Typography>1000</Typography>
        </Grid>
      </Grid>
    );
  }
  function containerBot() {
    return (
      <Grid container direction="row">
        <Grid item xs={10}>
          <Typography>EDIT/PUBLISHED</Typography>
        </Grid>

        <Grid item mr={9} xs={1}>
          <Typography>Views: 1000</Typography>
        </Grid>
        <ExpandMoreIcon></ExpandMoreIcon>
      </Grid>
    );
  }
  function containerMiddle() {
    return (
      <Box>
        <Typography>
          TeADIOQWJDIQWJDQWIJJIQWJIDQW
          DQW2IODQWDIOQWJdqwodkqwodkoqwdoqwkdoqwdqwpodkqwopdkqwopdkqwpokdqwpodkpqwodkopqwODQWWQDIJQWDIQWJIDJs
        </Typography>
      </Box>
    );
  }
  function container() {
    return (
      <Grid container direction="column">
        <Grid item mb={-2}>
          {containerTop()}
        </Grid>
        <Grid item>{containerMiddle()}</Grid>
        <Grid item mb={-7}>
          {containerBot()}
        </Grid>
      </Grid>
    );
  }

  function handleLoadList(event, id) {
    if (!event.target.disabled) {
      // CHANGE THE CURRENT LIST
      store.setCurrentList(id);
    }
  }

  function handleToggleEdit(event) {
    event.stopPropagation();
    toggleEdit();
  }

  function toggleEdit() {
    let newActive = !editActive;
    if (newActive) {
      store.setIsListNameEditActive();
    }
    setEditActive(newActive);
  }

  async function handleDeleteList(event, id) {
    event.stopPropagation();
    store.markListForDeletion(id);
    // if (!store.setIsListNameEditActive) {
    //   store.markListForDeletion(id);
    // }
  }

  function handleKeyPress(event) {
    if (event.code === "Enter") {
      let id = event.target.id.substring("list-".length);

      if (text === "") {
        store.changeListName(id, event.target.defaultValue);
      } else {
        store.changeListName(id, text);
      }
      toggleEdit();
    }
  }
  function handleUpdateText(event) {
    setText(event.target.value);
  }
  function buttonController() {
    if (store.isListNameEditActive) {
      return true;
    } else return false;
  }
  function colorStatus() {
    // Condition if the list is not published
    if (!true) return "#d4d4f5";
    else return "#fffff0";
  }
  // Colors:
  // Blue = LIST already published - #d4d4f5

  // Yellowish = List not published - #fffff0

  let cardElement = (
    <ListItem
      disabled={buttonController()}
      id={idNamePair._id}
      key={idNamePair._id}
      sx={{
        marginTop: "15px",
        display: "flex",
        p: 1,
        // bgcolor: "background.paper",
        bgcolor: colorStatus(),
        border: "2px solid #000",
        borderRadius: 3,
      }}
      // button
      // onClick={(event) => {
      //   handleLoadList(event, idNamePair._id);
      // }}
      style={{
        fontSize: "48pt",
        width: "100%",
      }}
    >
      {container()}
    </ListItem>
  );

  if (editActive) {
    cardElement = (
      <TextField
        margin="normal"
        required
        fullWidth
        id={"list-" + idNamePair._id}
        label="Top 5 List Name"
        name="name"
        autoComplete="Top 5 List Name"
        className="list-card"
        onKeyPress={handleKeyPress}
        onChange={handleUpdateText}
        defaultValue={idNamePair.name}
        inputProps={{ style: { fontSize: 48 } }}
        InputLabelProps={{ style: { fontSize: 24 } }}
        autoFocus
      />
    );
  }
  return cardElement;
}

export default ListCard;
