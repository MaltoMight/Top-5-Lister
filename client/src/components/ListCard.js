import { useContext, useState } from "react";
import { GlobalStoreContext } from "../store";
import TextField from "@mui/material/TextField";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";

import IconButton from "@mui/material/IconButton";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import { Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";

import CommentCard from "./CommentCard";
import Top5Item from "./Top5Item";
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

  function containerTop(title) {
    return (
      <Grid container direction="row">
        <Grid item xs={10}>
          <Typography>{title}</Typography>
          <Typography>Author(optional in some cases)</Typography>
        </Grid>
        <ThumbUpAltOutlinedIcon></ThumbUpAltOutlinedIcon>
        <Grid item mr={2}>
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
      <Grid container direction="row" spacing={0}>
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
  function commentManager() {
    let x = 10;
    let card = [];
    for (let i = 0; i < x; i++) {
      card.push(<CommentCard />);
    }
    return card;
  }
  function containerMiddle() {
    return (
      <Box>
        <Grid container>
          <Top5Item />
          <Grid
            item
            container
            direction="column"
            width={"55%"}
            style={{ borderRadius: "10px" }}
          >
            <Grid
              item
              container
              width={"100%"}
              height={"20vh"}
              style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "10px",
                overflow: "auto",
              }}
            >
              <List>{commentManager()}</List>
            </Grid>
            <Grid item>
              <TextField
                label="COMMENT YOUR FUCKING COMMENT"
                style={{ borderRadius: "10px", width: "100%" }}
              ></TextField>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }
  function container(idNamePair) {
    return (
      <Grid container direction="column">
        <Grid item mb={-2}>
          {containerTop(idNamePair.name)}
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
    <List
      item
      disabled={buttonController()}
      id={idNamePair._id}
      key={idNamePair._id}
      sx={{
        marginTop: "15px",
        p: 1,
        display: "flex",
        // flexWrap: "wrap",
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
      <Box width={"100%"} style={{ overflow: "hidden" }}>
        {container(idNamePair)}
      </Box>
    </List>
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
