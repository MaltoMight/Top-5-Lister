import { Box } from "@mui/system";
import { Typography, TextField } from "@mui/material";
import { useState, useContext } from "react";
import { GlobalStoreContext } from "../store";

export default function WorskpaceItem(props) {
  const [editActive, setEditActive] = useState(false);
  const { store } = useContext(GlobalStoreContext);

  function handleClick() {
    console.log("index:", props.index);
  }
  const handleChange = (event) => {
    if (store.currentList) {
      store.currentList.items[props.index] = event.target.value;
    }
  };
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
      <TextField
        onChange={handleChange}
        style={{ flexGrow: "1" }}
        defaultValue={props.item}
      />
    </Box>
  );
}
