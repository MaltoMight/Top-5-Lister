import { useEffect, useContext } from "react";
import { GlobalStoreContext } from "../store";
import AuthContext from "../auth";

export default function AllListScreen() {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    store.loadAllPublishedList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return "aidjqwidqwidqwd";
}
