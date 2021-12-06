import { useEffect, useContext, React } from "react";
import { GlobalStoreContext } from "../store";
import AuthContext from "../auth";
import ListCard from "./ListCard.js";
import List from "@mui/material/List";
import { useHistory, useLocation, useMemo } from "react-router-dom";

export default function UserScreen() {
  function useQuery() {
    return new URLSearchParams(window.location.search);
  }

  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const history = useHistory();
  let query = useQuery();

  useEffect(() => {
    console.log(history.location);
    let username = query.get("username");
    if (username) {
      store.loadAllUserList(username);
    } else {
      store.clearAllList();
    }

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
      <div id="list-selector-heading"></div>
      <div id="list-selector-list">{listCard}</div>
    </div>
  );
}
