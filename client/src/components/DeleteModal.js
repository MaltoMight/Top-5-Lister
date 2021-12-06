import { useContext } from "react";
import { GlobalStoreContext } from "../store";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

/*
    This modal is shown when the user asks to delete a list. Note 
    that before this is shown a list has to be marked for deletion,
    which means its id has to be known so that we can retrieve its
    information and display its name in this modal. If the user presses
    confirm, it will be deleted.
    
    @author McKilla Gorilla
*/
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
function DeleteModal() {
  const { store } = useContext(GlobalStoreContext);
  let name = "";
  if (store.listMarkedForDeletion) {
    name = store.listMarkedForDeletion.name;
  }
  function handleDeleteList(event) {
    store.deleteMarkedList();
  }

  function handleCloseModal(event) {
    store.hideDeleteListModal();
  }

  return (
    <Modal open={true}>
      <Box sx={style}>
        <Typography
          variant="h6"
          align="center"
          id="modal-modal-description"
          sx={{ mt: 2 }}
        >
          Delele the Top5 {name} list?
        </Typography>
        <Typography variant="h2" sx={{ mt: 3 }}>
          <Box display="flex" justifyContent="space-evenly">
            <Button
              onClick={handleDeleteList}
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Delete
            </Button>
            <Button
              onClick={handleCloseModal}
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Typography>
      </Box>
    </Modal>
    // <div
    //   className={handleClassNameModal()}
    //   id="delete-modal"
    //   data-animation="slideInOutLeft"
    // >
    //   <div className="modal-dialog">
    //     <header className="dialog-header">Delete the {name} Top 5 List?</header>
    //     <div id="confirm-cancel-container">
    //       <button
    //         id="dialog-yes-button"
    //         className="modal-button"
    //         onClick={handleDeleteList}
    //       >
    //         Confirm
    //       </button>
    //       <button
    //         id="dialog-no-button"
    //         className="modal-button"
    //         onClick={handleCloseModal}
    //       >
    //         Cancel
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
}

export default DeleteModal;
