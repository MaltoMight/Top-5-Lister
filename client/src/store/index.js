import { createContext, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import jsTPS from "../common/jsTPS";
import api from "../api";

import AuthContext from "../auth";

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
  CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
  CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
  CREATE_NEW_LIST: "CREATE_NEW_LIST",
  LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
  MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
  UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
  SET_CURRENT_LIST: "SET_CURRENT_LIST",
  SET_ITEM_EDIT_ACTIVE: "SET_ITEM_EDIT_ACTIVE",
  SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
  CLOSE_ITEM_EDIT_ACTIVE: "CLOSE_ITEM_EDIT_ACTIVE",
};

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
  // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
  const [store, setStore] = useState({
    idNamePairs: [],
    currentList: null,
    newListCounter: 0,
    listNameActive: false,
    itemActive: false,
    listMarkedForDeletion: null,
  });
  const history = useHistory();

  // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
  const { auth } = useContext(AuthContext);

  // HERE'S THE DATA STORE'S REDUCER, IT MUST
  // HANDLE EVERY TYPE OF STATE CHANGE
  const storeReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      // LIST UPDATE OF ITS NAME
      case GlobalStoreActionType.CHANGE_LIST_NAME: {
        return setStore({
          idNamePairs: payload.idNamePairs,
          // currentList: payload.top5List,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
        });
      }
      // STOP EDITING THE CURRENT LIST
      case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
        });
      }
      // CREATE A NEW LIST
      case GlobalStoreActionType.CREATE_NEW_LIST: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload,
          newListCounter: store.newListCounter + 1,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
        });
      }
      // GET ALL THE LISTS SO WE CAN PRESENT THEM
      case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
        return setStore({
          idNamePairs: payload,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
        });
      }
      // PREPARE TO DELETE A LIST
      case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: payload,
        });
      }
      // PREPARE TO DELETE A LIST
      case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
        });
      }
      // UPDATE A LIST
      case GlobalStoreActionType.SET_CURRENT_LIST: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
        });
      }
      // START EDITING A LIST ITEM
      case GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: store.currentList,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: true,
          listMarkedForDeletion: null,
        });
      }
      // Close edit a list item
      case GlobalStoreActionType.CLOSE_ITEM_EDIT_ACTIVE: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: store.currentList,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
        });
      }
      // START EDITING A LIST NAME
      case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload,
          newListCounter: store.newListCounter,
          isListNameEditActive: true,
          isItemEditActive: false,
          listMarkedForDeletion: null,
        });
      }

      // ADD COMMENT
      case GlobalStoreActionType.ADD_COMMENT_LIST: {
        return setStore({});
      }
      default:
        return store;
    }
  };

  // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
  // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN
  // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

  // THIS FUNCTION CREATES A NEW LIST
  store.createNewList = async function () {
    let newKey = store.getListCounter();
    let newListName = "Untitled" + newKey;
    console.log("auth:", auth);
    let payload = {
      name: newListName,
      items: ["?", "?", "?", "?", "?"],
      ownerEmail: auth.user.email,
      stats: { like: [], dislike: [], views: 0 },
      published: false,
      firstName: auth.user.firstName,
      lastName: auth.user.lastName,
      comments: [],
    };
    const response = await api.createTop5List(payload);
    if (response.data.success) {
      tps.clearAllTransactions();
      let newList = response.data.top5List;
      storeReducer({
        type: GlobalStoreActionType.CREATE_NEW_LIST,
        payload: newList,
      });
      store.storeListCounter(parseInt(newKey) + 1); // Updates the local browser database

      // IF IT'S A VALID LIST THEN LET'S START EDITING IT
      history.push("/top5list/" + newList._id);
    } else {
      console.log("API FAILED TO CREATE A NEW LIST");
    }
  };

  // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
  store.loadIdNamePairs = async function () {
    let payload = {
      ownerEmail: auth.user.email,
    };
    const response = await api.getUserAllTop5List(payload);
    if (response.data.success) {
      let pairsArray = response.data.idNamePairs;
      storeReducer({
        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
        payload: pairsArray,
      });
    } else {
      console.log("API FAILED TO GET THE LIST PAIRS");
    }
  };

  store.getListCounter = function () {
    let counter = localStorage.getItem("counter");
    if (!counter) {
      counter = 0;
    }
    // Returns value to avoid multiple payload which can overrites the previous one
    return counter;
  };
  store.storeListCounter = function (value) {
    localStorage.setItem("counter", value);
  };

  store.addComment = async function (listId, comments) {
    let payload = {
      _id: listId,
      firstName: auth.user.firstName,
      lastName: auth.user.lastName,
      message: comments,
    };
    console.log("payload:", payload);
    let response = await api.addComment(payload);
    // let comment = {
    //   firstName: response.data.firstName,
    //   lastName: response.data.lastName,
    //   message: response.data.message,
    // };
    payload = {
      ownerEmail: auth.user.email,
    };
    response = await api.getUserAllTop5List(payload);
    if (response.data.success) {
      let pairsArray = response.data.idNamePairs;
      storeReducer({
        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
        payload: pairsArray,
      });
    } else {
      console.log("API FAILED TO GET THE LIST PAIRS");
    }
  };

  store.upVote = async function (listId) {
    try {
      let payload = {
        ownerEmail: auth.user.email,
      };
      let email = auth.user.email;
      let response = await api.getTop5ListById(listId, payload);
      if (response.data.success) {
        payload = {
          userEmail: email,
          listId: listId,
        };

        // Check if the can vote up

        response = await api.removeDislikeVote(payload);
        // Add the vote on list
        if (response.data.success) {
          response = await api.addLikeVote(payload);
          store.loadIdNamePairs();
        }
      }
    } catch (error) {
      console.log("error");
    }
  };

  store.downVote = async function (listId) {
    try {
      let payload = {
        ownerEmail: auth.user.email,
      };
      let email = auth.user.email;
      let response = await api.getTop5ListById(listId, payload);
      if (response.data.success) {
        payload = {
          userEmail: email,
          listId: listId,
        };
        response = await api.removeLikeVote(payload);
        console.log(response);
        // Add the vote on list
        if (response.data.success) {
          response = await api.addDislikeVote(payload);
          store.loadIdNamePairs();
        }
      }
    } catch (error) {
      console.log("error");
    }
  };
  // *****************************************************************************/

  return (
    <GlobalStoreContext.Provider
      value={{
        store,
      }}
    >
      {props.children}
    </GlobalStoreContext.Provider>
  );
}
export default GlobalStoreContext;
export { GlobalStoreContextProvider };
