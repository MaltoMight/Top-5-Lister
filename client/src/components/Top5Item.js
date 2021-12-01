import { Grid, Typography } from "@mui/material";

export default function Top5Item(props) {
  return (
    <Grid
      item
      width={"40%"}
      sx={{ bgcolor: "#2c2f70" }}
      style={{ overflow: "auto", borderRadius: "10px", marginRight: "10px" }}
    >
      <Typography
        style={{
          fontSize: "35px",
          paddingTop: "10px",
          paddingLeft: "12px",
          color: "#d5af36",
        }}
      >
        1.
      </Typography>
      <Typography
        style={{
          fontSize: "35px",
          paddingLeft: "10px",
          paddingTop: "12px",
          color: "#d5af36",
        }}
      >
        2.
      </Typography>{" "}
      <Typography
        style={{
          fontSize: "35px",
          paddingLeft: "12px",
          paddingTop: "10px",
          color: "#d5af36",
        }}
      >
        3.
      </Typography>
      <Typography
        style={{
          fontSize: "35px",
          paddingLeft: "12px",
          paddingTop: "10px",
          color: "#d5af36",
        }}
      >
        4.
      </Typography>
      <Typography
        style={{
          fontSize: "35px",
          paddingLeft: "12px",
          paddingTop: "10px",
          color: "#d5af36",
        }}
      >
        5.
      </Typography>
    </Grid>
  );
}
