import { Grid, Typography } from "@mui/material";

export default function Top5Item(props) {
  return (
    <Grid
      item
      width={"40%"}
      sx={{ bgcolor: "#2c2f70" }}
      style={{ borderRadius: "10px", marginRight: "10px" }}
    >
      <Typography>Item #1</Typography>
      <Typography>Item #2</Typography>
      <Typography>Item #3</Typography>
      <Typography>Item #4</Typography>
      <Typography>Item #5</Typography>
    </Grid>
  );
}
