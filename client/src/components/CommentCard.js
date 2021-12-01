import { Typography, List } from "@mui/material";
import { GlobalStoreContext } from "../store";
import { useContext, useState } from "react";

export default function CommentCard(props) {
  return (
    <List
      item
      sx={{ bgcolor: "#d5af36" }}
      style={{
        border: "solid black",
        borderRadius: "10px",
        p: 1,
        marginBottom: "10px",
      }}
    >
      <Typography style={{ color: "blue", fontSize: "15px" }}>
        {props.idNamePair.firstname} {props.idNamePair.lastName}
      </Typography>
      <Typography>{props.idNamePair.message}</Typography>
    </List>
  );
}
