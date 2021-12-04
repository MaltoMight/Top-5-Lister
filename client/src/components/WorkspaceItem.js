import { Box } from "@mui/system";
import { Typography, TextField } from "@mui/material";
import { useState } from "react";

export default function WorskpaceItem(props) {
  const [editActive, setEditActive] = useState(false);
  function handleClick() {
    console.log("index:", props.index);
  }

  return (
    <Box
      display="flex"
      width={"100%"}
      bgcolor="lightgreen"
      alignItems="center"
      onClick={() => handleClick()}
      bgcolor="#d4af36"
      style={{ "border-style": "solid", "border-radius": "10px" }}
    >
      <TextField defaultValue={props.item} />
      {/* <Typography variant="h3">{props.item}</Typography> */}
    </Box>
  );
}
