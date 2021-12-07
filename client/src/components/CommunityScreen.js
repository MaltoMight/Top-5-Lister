import { useEffect, useContext, React } from "react";
import { GlobalStoreContext } from "../store";
import AuthContext from "../auth";
import CommunityListCard from "./CommunityListCard.js";
import List from "@mui/material/List";
import { useHistory, useLocation, useMemo } from "react-router-dom";

export default function CommunityScreen() {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    store.clearAllList();
    console.log(history.location);
    store.loadCommunityList();

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
          <CommunityListCard
            key={pair._id}
            idNamePair={pair}
            selected={false}
          />
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
