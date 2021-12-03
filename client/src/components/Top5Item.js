import { Grid, Typography } from "@mui/material";
import { useContext } from "react";
import { GlobalStoreContext } from "../store/index.js";

export default function Top5Item(props) {
  const { store } = useContext(GlobalStoreContext);
  const { idNamePair } = props;

  return (
    <Grid
      item
      width={"40%"}
      sx={{ bgcolor: "#2c2f70" }}
      style={{ overflow: "auto", borderRadius: "10px", marginRight: "10px" }}
    >
      {idNamePair.items.map((item) => (
        <Typography
          style={{
            fontSize: "35px",
            paddingTop: "10px",
            paddingLeft: "12px",
            color: "#d5af36",
          }}
        >
          {item}
        </Typography>
      ))}
    </Grid>
  );
}
