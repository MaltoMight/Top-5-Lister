import { useContext } from "react";
import { GlobalStoreContext } from "../store";
import Button from "@mui/material/Button";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import CloseIcon from "@mui/icons-material/HighlightOff";

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
  const { store } = useContext(GlobalStoreContext);

  function handleUndo() {
    store.undo();
  }
  function handleRedo() {
    store.redo();
  }
  function handleClose() {
    store.closeCurrentList();
  }
  function redoButtonStatus() {
    if (store.redoSize() === 0 || store.isItemEditActive) return true;
    else return false;
  }
  function undoButtonStatus() {
    if (store.undoSize() === 0 || store.isItemEditActive) return true;
    else return false;
  }

  // function editStatus() {
  //   if (store.isListNameEditActive || store.isItemEditActive) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  function editCloseStatus() {
    if (!store.currentList || store.isItemEditActive) {
      return true;
    } else return false;
  }
  return (
    <div id="edit-toolbar">
      <Button
        disabled={undoButtonStatus()}
        id="undo-button"
        onClick={handleUndo}
        variant="contained"
      >
        <UndoIcon />
      </Button>
      <Button
        id="redo-button"
        disabled={redoButtonStatus()}
        onClick={handleRedo}
        variant="contained"
      >
        <RedoIcon />
      </Button>
      <Button
        disabled={editCloseStatus()}
        id="close-button"
        onClick={handleClose}
        variant="contained"
      >
        <CloseIcon />
      </Button>
    </div>
  );
}

export default EditToolbar;
