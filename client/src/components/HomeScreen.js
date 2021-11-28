import React, { useContext, useEffect } from "react";
import { GlobalStoreContext } from "../store";
// import { AuthContext } from "../auth";
import ListCard from "./ListCard.js";
import { Fab, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import List from "@mui/material/List";
import DeleteModal from "./DeleteModal.js";
/*
    This React component lists all the top5 lists in the UI.

    @author McKilla Gorilla
*/
// This component only loads if is logged in

const HomeScreen = () => {
  const { store } = useContext(GlobalStoreContext);
  // const { auth } = useContext(AuthContext);
  useEffect(() => {
    store.loadIdNamePairs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCreateNewList() {
    store.createNewList();
    // console.log("auth clicked:", auth);
  }
  let listCard = "";
  if (store) {
    listCard = (
      <List sx={{ width: "90%", left: "5%", bgcolor: "background.paper" }}>
        {store.idNamePairs.map((pair) => (
          <ListCard key={pair._id} idNamePair={pair} selected={false} />
        ))}
      </List>
    );
  }

  function statusManager() {
    if (store.isListNameEditActive) {
      return true;
    } else return false;
  }
  if (store.listMarkedForDeletion) {
    return <DeleteModal />;
  } else {
    return (
      <div id="top5-list-selector">
        <div id="list-selector-heading">
          <Fab
            disabled={statusManager()}
            color="primary"
            aria-label="add"
            id="add-list-button"
            onClick={handleCreateNewList}
          >
            <AddIcon />
          </Fab>
          <Typography variant="h2">Your Lists</Typography>
        </div>
        <div id="list-selector-list">{listCard}</div>
      </div>
    );
  }
  // return (

  // );
};

export default HomeScreen;
