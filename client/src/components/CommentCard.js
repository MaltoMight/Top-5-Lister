import { Typography, List } from "@mui/material";
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
        Author
      </Typography>
      <Typography>Comments</Typography>
    </List>
  );
}
