import { React, useContext, useState, useEffect } from "react";
import { GlobalStoreContext } from "../store";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/

function Top5Item(props) {
  const { store } = useContext(GlobalStoreContext);
  const [draggedTo, setDraggedTo] = useState(0);

  const [editActive, setEditActive] = useState(false);
  //   const [editItemActive, seteditItemActive] = useState(false);
  const [text, setText] = useState("");
  const [modifiedText, setModifiedText] = useState(false);

  useEffect(() => {
    // console.log("Item State updated");
  });

  // let cardStatus = false;
  // if (store.itemActive) {
  //   cardStatus = true;
  // }

  function handleDragStart(event) {
    event.dataTransfer.setData("item", event.target.id);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDragEnter(event) {
    event.preventDefault();
    setDraggedTo(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setDraggedTo(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    let target = event.target;
    let targetId = target.id;
    targetId = targetId.substring(target.id.indexOf("-") + 1);
    let sourceId = event.dataTransfer.getData("item");
    sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
    setDraggedTo(false);

    // UPDATE THE LIST

    if (!(sourceId === targetId) && targetId) {
      store.addMoveItemTransaction(sourceId, targetId);
    }
  }

  function handleToggleEdit(event) {
    event.stopPropagation();
    toggleEdit();
  }

  function toggleEdit() {
    let newActive = !editActive;
    if (newActive) {
      store.setIsItemEditActive();
    }
    setEditActive(newActive);
  }

  function handleKeyPress(event) {
    if (event.code === "Enter") {
      // If user didn't type anything or left empty string
      if (text === "") {
        if (modifiedText) {
          // User left empty string and modified the text
          store.addUpdateItemTransaction(index, " ");
        } else {
          store.closeCurrentEditItem();
        }
      } else {
        // store.changeItemName(index, text);
        if (event.target.defaultValue !== text) {
          store.addUpdateItemTransaction(index, text);
        } else {
          store.closeCurrentEditItem();
        }
      }
      toggleEdit();
    }
    // if (event.code === "Enter") {
    //   let index = event.target.id.substring("list-".length);
    //   let text = event.target.value;
    //   store.addUpdateItemTransaction(index - 1, text);
    //   toggleEdit();
    // }
  }
  function handleUpdateText(event) {
    setText(event.target.value);
    setModifiedText(true);
  }

  let { index } = props;
  let itemClass = "top5-item";

  if (draggedTo) {
    itemClass = "top5-item-dragged-to";
  }

  function isDraggable() {
    if (store.isItemEditActive) {
      return false;
    } else {
      return true;
    }
    // let status = store.itemActive;
    // return !status;
  }
  function buttonManager() {
    if (store.isItemEditActive) {
      return true;
    } else return false;
  }
  let itemElement = (
    <ListItem
      id={"item-" + (index + 1)}
      className={itemClass}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      draggable={isDraggable()}
    >
      <Box sx={{ p: 1 }}>
        <IconButton
          disabled={buttonManager()}
          onClick={handleToggleEdit}
          aria-label="edit"
        >
          <EditIcon style={{ fontSize: "48pt" }} />
        </IconButton>
      </Box>
      {props.text}
    </ListItem>
  );

  if (editActive) {
    itemElement = (
      <input
        id={"item-" + (index + 1)}
        className="top5-item edit-item"
        type="text"
        onKeyPress={handleKeyPress}
        onChange={handleUpdateText}
        defaultValue={props.text}
      />
    );
  }
  return itemElement;
}

export default Top5Item;
