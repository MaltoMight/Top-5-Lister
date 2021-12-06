import { useEffect, useContext } from "react";
import { GlobalStoreContext } from "../store";
import AuthContext from "../auth";
import ListCard from "./ListCard.js";
import List from "@mui/material/List";
import { useHistory } from "react-router-dom";

export default function UserScreen() {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    console.log(history.location);
    console.log("kekw");
    // store.loadAllUserList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let listCard = "";
  if (store) {
    listCard = (
      <List
        sx={{
          width: "95%",
          left: "2%",
          // bgcolor: "background.paper",
        }}
      >
        {store.idNamePairs.map((pair) => (
          <ListCard key={pair._id} idNamePair={pair} selected={false} />
        ))}
      </List>
    );
  }
  return (
    <div id="top5-list-selector">
      QWDQWDQWDQ
      <div id="list-selector-heading"></div>
      <div id="list-selector-list">{listCard}</div>
    </div>
  );
}
