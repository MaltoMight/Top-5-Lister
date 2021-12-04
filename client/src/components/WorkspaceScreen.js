import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import { GlobalStoreContext } from "../store/index.js";
import AuthContext from "../auth";
import TextField from "@mui/material/TextField";
import WorkspaceItem from "./WorkspaceItem.js";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
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
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const history = useHistory();
  const currentList = store.currentList;
  const location = useLocation();
  const [titleName, setTitleName] = useState("");

  // console.log(auth);

  useEffect(() => {
    let pathName = location.pathname;
    let id = pathName.substring("/top5list/".length);
    checkPermission(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function checkPermission(id) {
    auth.tokenStatus().then((email) => {
      if (!email) {
        // setModalStatus(false);
        // setErrorMessage("Unauthorized access");
      } else {
        store.restoreList(id, email).then((response) => {
          // setModalStatus(response.success);
          // setErrorMessage(response.message);
        });
      }
    });
  }
  function modalController() {
    let itemList = "";
    if (currentList) {
      itemList = currentList.items.map((item) => {
        return <WorkspaceItem />;
      });
      console.log(itemList);
      return itemList;
    }
  }
  const handleTitleChange = (event) => {
    setTitleName(event.target.value);
  };
  const handleSaveList = () => {
    store.currentList.name = titleName;
    store.saveList();
  };
  function getTitle() {
    let title = store.currentList ? store.currentList.name : "N/A";

    return (
      <TextField
        size="small"
        sx={{ bgcolor: "white" }}
        defaultValue={title}
        onChange={handleTitleChange}
        style={{
          "border-radius": "10px",
          width: "50%",
          fontFamily: "Lexend Exa",
        }}
      />
    );
  }
  let items;
  if (currentList) {
    items = currentList.items.map((item, index) => {
      return <WorkspaceItem index={index} item={item} />;
    });
  }
  return (
    <div id="top5-workspace">
      <Box ml={1} mt={1} pl={1}>
        {getTitle()}
      </Box>
      <Grid
        container
        direction="row"
        mt={2}
        ml={2}
        mr={2}
        style={{
          "border-radius": "10px",
          width: "98%",
          height: "82%",
          backgroundColor: "#2c2f70",
        }}
      >
        <Grid
          container
          item
          mt={2}
          ml={2}
          mr={2}
          mb={2}
          style={{
            "border-radius": "10px",
            width: "6%",
            gap: 10,
          }}
          rowSpacing={5}
          justifyContent="space-evenly"
        >
          <Box
            display="flex"
            width={"100%"}
            bgcolor="#d4af36"
            alignItems="center"
            justifyContent="center"
            style={{ "border-style": "solid", "border-radius": "10px" }}
          >
            <Typography variant="h3">1.</Typography>
          </Box>
          <Box
            display="flex"
            width={"100%"}
            bgcolor="#d4af36"
            alignItems="center"
            justifyContent="center"
            style={{ "border-style": "solid", "border-radius": "10px" }}
          >
            <Typography variant="h3">2.</Typography>
          </Box>
          <Box
            display="inline-flex"
            width={"100%"}
            bgcolor="#d4af36"
            alignItems="center"
            justifyContent="center"
            style={{ "border-style": "solid", "border-radius": "10px" }}
          >
            <Typography variant="h3">3.</Typography>
          </Box>
          <Box
            display="flex"
            width={"100%"}
            bgcolor="#d4af36"
            alignItems="center"
            justifyContent="center"
            style={{ "border-style": "solid", "border-radius": "10px" }}
          >
            <Typography variant="h3">4.</Typography>
          </Box>
          <Box
            display="flex"
            width={"100%"}
            bgcolor="#d4af36"
            alignItems="center"
            justifyContent="center"
            style={{ "border-style": "solid", "border-radius": "10px" }}
          >
            <Typography variant="h3">5.</Typography>
          </Box>
        </Grid>
        <Grid
          mt={2}
          mb={2}
          mr={2}
          item
          container
          style={{
            "border-radius": "10px",
            "flex-grow": "1",
            width: "30%",
            gap: 10,
          }}
        >
          {items}
          {/* <Box
            display="flex"
            width={"100%"}
            bgcolor="lightgreen"
            alignItems="center"
            bgcolor="#d4af36"
            style={{ "border-style": "solid", "border-radius": "10px" }}
          >
            <Typography variant="h3">item</Typography>
          </Box>
          <Box
            display="flex"
            width={"100%"}
            bgcolor="lightgreen"
            alignItems="center"
            bgcolor="#d4af36"
            style={{ "border-style": "solid", "border-radius": "10px" }}
          >
            <Typography variant="h3">item</Typography>
          </Box>
          <Box
            display="flex"
            width={"100%"}
            bgcolor="lightgreen"
            alignItems="center"
            bgcolor="#d4af36"
            style={{ "border-style": "solid", "border-radius": "10px" }}
          >
            <Typography variant="h3">item</Typography>
          </Box>
          <Box
            display="flex"
            width={"100%"}
            bgcolor="lightgreen"
            alignItems="center"
            bgcolor="#d4af36"
            style={{ "border-style": "solid", "border-radius": "10px" }}
          >
            <Typography variant="h3">item</Typography>
          </Box>
          <Box
            display="flex"
            width={"100%"}
            bgcolor="lightgreen"
            bgcolor="#d4af36"
            alignItems="center"
            style={{ "border-style": "solid", "border-radius": "10px" }}
          >
            <Typography variant="h3">item</Typography>
          </Box> */}
        </Grid>
      </Grid>
      <div id="workspace-button">
        <Button onClick={handleSaveList}> Save</Button>
        <Button
          onClick={() => {
            store.publishList(currentList._id);
          }}
        >
          Publish
        </Button>
      </div>
    </div>
  );
}

export default WorkspaceScreen;
