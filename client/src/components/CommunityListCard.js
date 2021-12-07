import { useContext, useState } from "react";
import { GlobalStoreContext } from "../store";
import TextField from "@mui/material/TextField";
import { Grid, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { useHistory } from "react-router-dom";
import AuthContext from "../auth";

import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import { Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Button from "@mui/material/Button";
import DeleteModal from "./DeleteModal.js";

import CommentCard from "./CommentCard";
import Top5ItemCommunity from "./Top5ItemCommunity";
/*

    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/

function CommunityListCard(props) {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const history = useHistory();

  const [expandedList, setExpandedList] = useState(false);
  const [text, setText] = useState("");
  const { idNamePair } = props;
  function handleComment(idList, comment) {
    store.addComment(idList, comment);
  }
  async function handleUpVote() {
    store.upVote(idNamePair._id);
  }
  async function handleDownVote() {
    store.downVote(idNamePair._id);
  }
  function handleExpandMoreList() {
    setExpandedList(true);
    store.addView(idNamePair._id);
  }
  function handleExpandLessList() {
    setExpandedList(false);
  }
  function handleEditList() {
    store.setCurrentList(idNamePair._id);
  }
  function handleDeleteList() {
    store.markListForDeletion(idNamePair._id);
  }
  function deleteIconManager() {
    let location = history.location.pathname.replace("/", "");
    if (
      location === "" &&
      auth.loggedIn &&
      auth.user.email === idNamePair.ownerEmail
    ) {
      return (
        <DeleteIcon
          onClick={() => {
            handleDeleteList();
          }}
        />
      );
    }
  }
  function editManager() {
    if (idNamePair.published) {
      let options = { month: "short" };

      let date = new Date(idNamePair.createdAt);
      let x = 2;
      return (
        <>
          <Grid item>
            <Typography>Published:</Typography>
          </Grid>
          <Grid item ml={1} xs={14}>
            <Typography color={"green"}>
              {new Intl.DateTimeFormat("en-US", options).format(
                date.getMonth()
              )}{" "}
              {date.getDate()}, {date.getFullYear()}
            </Typography>
          </Grid>
        </>
      );
    } else {
      return (
        <>
          <Grid item xs={15}>
            <Typography
              color={"red"}
              style={{
                display: "inline-flex",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => {
                handleEditList();
              }}
            >
              Edit
            </Typography>
          </Grid>
        </>
      );
    }
  }

  function containerTop(idNamePair) {
    return (
      <Grid container direction="row">
        <Grid item xs={10}>
          <Typography>{idNamePair.name}</Typography>
        </Grid>

        <ThumbUpAltOutlinedIcon
          onClick={() => {
            handleUpVote();
          }}
        ></ThumbUpAltOutlinedIcon>

        <Grid item mr={2}>
          <Typography>{idNamePair.stats.like}</Typography>
        </Grid>

        <ThumbDownOutlinedIcon
          onClick={() => handleDownVote()}
        ></ThumbDownOutlinedIcon>

        <Grid item>
          <Typography>{idNamePair.stats.dislike}</Typography>
        </Grid>
        {deleteIconManager()}
      </Grid>
    );
  }
  function containerBot(idNamePair) {
    let button = <ExpandMoreIcon onClick={() => handleExpandMoreList()} />;
    if (expandedList) {
      button = <ExpandLessIcon onClick={() => handleExpandLessList()} />;
    }
    return (
      <Grid container direction="row" spacing={0} columns={20}>
        {editManager()}

        <Grid item ml={0}>
          <Typography>Views: </Typography>
        </Grid>
        <Grid item ml={3} xs={2}>
          <Typography sx={{ color: "red" }}>
            {idNamePair.stats.views}
          </Typography>
        </Grid>
        <Grid>{button}</Grid>
      </Grid>
    );
  }

  function containerMiddle() {
    // If list is active
    // if(auth.user)
    let commentDiv = (
      <TextField
        label="Add Comment"
        onKeyPress={(event) => {
          if (event.key === "Enter" && event.target.value !== "") {
            handleComment(idNamePair._id, event.target.value);
            event.target.value = "";
          }
        }}
        style={{
          marginTop: "20px",

          width: "100%",
        }}
      ></TextField>
    );
    if (auth.user === null) {
      commentDiv = (
        <TextField
          label="Login in order to comment"
          disabled={true}
          style={{
            marginTop: "20px",

            width: "100%",
          }}
        ></TextField>
      );
    }

    if (expandedList) {
      return (
        <Box>
          <Grid container>
            <Top5ItemCommunity key={idNamePair._id} idNamePair={idNamePair} />
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
                height={"25vh"}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "10px",
                  overflow: "auto",
                  marginBottom: "20px",
                }}
              >
                <List>
                  {idNamePair.comments.map((pair) => (
                    <CommentCard
                      key={pair._id}
                      idNamePair={pair}
                      selected={false}
                    />
                  ))}
                </List>
              </Grid>
              <Grid item> {commentDiv}</Grid>
            </Grid>
          </Grid>
        </Box>
      );
    } else {
      return null;
    }
  }

  function container(idNamePair) {
    return (
      <Grid container direction="column">
        <Grid item mb={-2}>
          {containerTop(idNamePair)}
        </Grid>
        <Grid item>{containerMiddle()}</Grid>
        <Grid item mb={-5}>
          {containerBot(idNamePair)}
        </Grid>
      </Grid>
    );
  }

  function colorStatus() {
    // Condition if the list is not published
    if (idNamePair.published) return "#d4d4f5";
    else return "#fffff0";
  }
  // Colors:
  // Blue = LIST already published - #d4d4f5

  // Yellowish = List not published - #fffff0
  function cardElementManager() {
    return (
      <List
        item
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
  }

  return cardElementManager();
}

export default CommunityListCard;
