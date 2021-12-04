import { createContext, useContext, useState, useEffect } from "react";
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
    currentPage: 0, // 0 -> home page , 1 -> all list page, 2 -> user list, 3 -> communitylist page
  });
  const history = useHistory();

  // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
  const { auth } = useContext(AuthContext);

  // HERE'S THE DATA STORE'S REDUCER, IT MUST
  // HANDLE EVERY TYPE OF STATE CHANGE
  const storeReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
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

      // ADD COMMENT
      case GlobalStoreActionType.ADD_COMMENT_LIST: {
        return setStore({});
      }
      case GlobalStoreActionType.SET_CURRENTPAGE_HOME: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: store.currentList,
          newListCounter: store.newListCounter,
          isListNameEditActive: store.isItemEditActive,
          isItemEditActive: store.isItemEditActive,
          listMarkedForDeletion: store.listMarkedForDeletion,
          currentPage: payload,
        });
      }
      case GlobalStoreActionType.SET_CURRENT_LIST: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          currentPage: store.currentPage,
        });
      }
      default:
        return store;
    }
  };

  // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
  // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN
  // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

  store.restoreList = async function (id, email) {
    // Check if the ID is valid
    try {
      let payload = { ownerEmail: email };
      await api.getTop5ListById(id, payload);
    } catch (err) {
      // Not valid ID
      if (!err.response) {
        return { success: false, message: "Invalid List" };
      } else {
        return { success: false, message: err.response.data.error };
      }
    }

    // Check if the EMAIL is valid
    let response = await store.setCurrentList(id, email);
    if (!response) {
      return { success: true, message: "" };
    } else {
      return { success: false, message: response };
    }
  };

  store.setCurrentList = async function (id, ownerEmail = null) {
    try {
      let payload = {};
      if (!ownerEmail) {
        payload = { ownerEmail: auth.user.email };
      } else {
        payload = { ownerEmail };
      }
      let response = await api.getTop5ListById(id, payload);
      if (response.data.success) {
        let top5List = response.data.top5List;

        response = await api.updateTop5ListById(top5List._id, top5List);
        if (response.data.success) {
          storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: top5List,
          });
          history.push("/top5list/" + top5List._id);
        }
      } else {
        return response.data.error;
      }
    } catch (err) {
      return err.response.data.error;
    }
  };

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
  store.addView = async function (listId) {
    try {
      let payload = {
        listId: listId,
      };
      let response = await api.incrementViewListById(payload);
      if (response.data.success) {
        store.loadIdNamePairs();
      }
    } catch (error) {
      console.log("error");
    }
  };
  store.checkCurrentPage = function () {
    let location = history.location.pathname;

    if (location === "/") {
      storeReducer({
        type: GlobalStoreActionType.SET_CURRENTPAGE_HOME,
        payload: 0,
      });
    } else if (location === "/all" || location === "/all/") {
      storeReducer({
        type: GlobalStoreActionType.SET_CURRENTPAGE_HOME,
        payload: 1,
      });
    } else if (location === "/all" || location === "/all/") {
      storeReducer({
        type: GlobalStoreActionType.SET_CURRENTPAGE_HOME,
        payload: 1,
      });
    } else if (location === "/user" || location === "/user/") {
      storeReducer({
        type: GlobalStoreActionType.SET_CURRENTPAGE_HOME,
        payload: 2,
      });
    } else if (location === "/community" || location === "/community/") {
      storeReducer({
        type: GlobalStoreActionType.SET_CURRENTPAGE_HOME,
        payload: 3,
      });
    }
  };

  store.publishList = async function (listId) {
    let payload = { ownerEmail: auth.user.email };

    let response = await api.getTop5ListById(listId, payload);
    if (response.data.success) {
      let top5List = response.data.top5List;
      top5List.published = true;
      response = await api.updateTop5ListById(top5List._id, top5List);
      if (response.data.success) {
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: top5List,
        });
        history.push("/");
      }
    }
  };
  store.saveList = async function () {
    const response = await api.updateTop5ListById(
      store.currentList._id,
      store.currentList
    );

    if (response.data.success) {
      storeReducer({
        type: GlobalStoreActionType.SET_CURRENT_LIST,
        payload: store.currentList,
      });
      history.push("/");
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
