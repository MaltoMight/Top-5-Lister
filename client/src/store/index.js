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
  LOAD_SORTED_LIST: "LOAD_SORTED_LIST",
  LOAD_HOMEPAGE_LIST: "LOAD_HOMEPAGE_LIST",
  CLEAR_ALL_LIST: "CLEAR_ALL_LIST",
  LOAD_COMMUNITY_LIST: "LOAD_COMMUNITY_LIST",
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
    sortCode: -1,
    communityList: false,
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
          currentPage: 0,
          sortCode: store.sortCode,
          communityList: store.communityList,
        });
      }
      // GET ALL THE LISTS SO WE CAN PRESENT THEM
      case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
        return setStore({
          idNamePairs: payload.lists,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          currentPage: payload.currentPage,
          sortCode: store.sortCode,
          communityList: store.communityList,
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
          sortCode: -1,
          communityList: store.communityList,
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
          sortCode: store.sortCode,
          communityList: store.communityList,
        });
      }
      case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          currentPage: store.currentPage,
          sortCode: store.sortCode,
          communityList: store.communityList,
        });
      }
      case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: payload,
          currentPage: store.currentPage,
          sortCode: store.sortCode,
          communityList: store.communityList,
        });
      }
      case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          currentPage: store.currentPage,
          sortCode: store.sortCode,
          communityList: store.communityList,
        });
      }
      case GlobalStoreActionType.LOAD_SORTED_LIST: {
        return setStore({
          idNamePairs: payload.newList,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          currentPage: store.currentPage,

          sortCode: payload.sortCode,
          communityList: store.communityList,
        });
      }
      case GlobalStoreActionType.LOAD_HOMEPAGE_LIST: {
        return setStore({
          idNamePairs: payload,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          currentPage: store.currentPage,
          sortCode: -1,
          communityList: store.communityList,
        });
      }
      case GlobalStoreActionType.CLEAR_ALL_LIST: {
        return setStore({
          idNamePairs: [],
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          currentPage: store.currentPage,
          sortCode: store.sortCode,
          communityList: store.communityList,
        });
      }
      case GlobalStoreActionType.LOAD_COMMUNITY_LIST: {
        return setStore({
          idNamePairs: payload,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          currentPage: 3,
          sortCode: store.sortCode,
          communityList: true,
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
  store.loadIdNamePairs = async function (list = null) {
    let pairsArray;
    let currentPage = store.checkCurrentPage();
    if (!list) {
      let payload = {
        ownerEmail: auth.user.email,
      };
      const response = await api.getUserAllTop5List(payload);
      if (response.data.success) {
        pairsArray = response.data.idNamePairs;

        storeReducer({
          type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
          payload: { lists: pairsArray, currentPage: currentPage },
        });
      } else {
        console.log("API FAILED TO GET THE LIST PAIRS");
      }
    } else {
      pairsArray = list;
    }
    storeReducer({
      type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
      payload: { lists: pairsArray, currentPage: currentPage },
    });
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
    if (response.data.success && store.currentPage === 1) {
      store.loadAllPublishedList();
    } else if (response.data.success && store.currentPage === 2) {
      function usingQuery() {
        return new URLSearchParams(window.location.search);
      }
      let query = usingQuery();
      store.loadAllUserList(query.get("username"));
    } else {
      payload = {
        ownerEmail: auth.user.email,
      };
      response = await api.getUserAllTop5List(payload);
      if (response.data.success) {
        let pairsArray = response.data.idNamePairs;
        let currentPage = store.checkCurrentPage();
        storeReducer({
          type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
          payload: { lists: pairsArray, currentPage: currentPage },
        });
      } else {
        console.log("API FAILED TO GET THE LIST PAIRS");
      }
    }
  };

  store.upVote = async function (listId) {
    try {
      let payload = {
        userEmail: auth.user.email,
        listId: listId,
      };
      let email = auth.user.email;

      // Check if the user already voted for like;
      let response = await api.checkVoteLike(payload);
      if (response.data.success && response.data.containsUser) {
        console.log("USER ALREADY VOTED");
        return false;
      }

      response = await api.removeDislikeVote(payload);
      if (response.data.success) {
        response = await api.addLikeVote(payload);
      }
      if (store.checkCurrentPage() === 1) {
        store.loadAllPublishedList();
        return true;
      } else if (store.checkCurrentPage() === 2) {
        function usingQuery() {
          return new URLSearchParams(window.location.search);
        }
        let query = usingQuery();
        store.loadAllUserList(query.get("username"));
        return true;
      }

      payload = { ownerEmail: auth.user.email, listId: listId };
      response = await api.getTop5ListById(listId, payload);
      if (response.data.success) {
        payload = {
          userEmail: email,
          listId: listId,
        };
        if (store.checkCurrentPage() > 0) {
          store.loadAllPublishedList();
        } else {
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
        userEmail: auth.user.email,
        listId: listId,
      };
      let email = auth.user.email;

      // Check if the user already voted for dislike;
      let response = await api.checkVoteDislike(payload);
      if (response.data.success && response.data.containsUser) {
        console.log("USER ALREADY VOTED");
        return false;
      }
      response = await api.removeLikeVote(payload);
      if (response.data.success) {
        response = await api.addDislikeVote(payload);
      }
      if (store.checkCurrentPage() === 1) {
        store.loadAllPublishedList();
        return true;
      } else if (store.checkCurrentPage() === 2) {
        function usingQuery() {
          return new URLSearchParams(window.location.search);
        }
        let query = usingQuery();
        store.loadAllUserList(query.get("username"));
        return true;
      }
      payload = { ownerEmail: auth.user.email, listId: listId };
      response = await api.getTop5ListById(listId, payload);
      if (response.data.success) {
        payload = {
          userEmail: email,
          listId: listId,
        };
        if (store.checkCurrentPage() === 1) {
          store.loadAllPublishedList();
        } else {
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
        communityList: store.communityList,
      };
      let response = await api.incrementViewListById(payload);
      if (response.data.success) {
        if (store.sortCode != -1) {
          store.sortCurrentListLoaded();
        } else if (store.currentPage === 1) {
          store.loadAllPublishedList();
        } else if (store.currentPage === 2) {
          function usingQuery() {
            return new URLSearchParams(window.location.search);
          }
          let query = usingQuery();
          store.loadAllUserList(query.get("username"));
        } else if (store.currentPage === 3) {
          store.loadCommunityList();
        } else {
          store.loadIdNamePairs();
        }
      }
    } catch (error) {
      console.log("error");
    }
  };
  store.checkCurrentPage = function () {
    let location = history.location.pathname;

    if (location === "/") {
      return 0;
    } else if (location === "/all" || location === "/all/") {
      return 1;
    } else if (location === "/user" || location === "/user/") {
      return 2;
    } else if (location === "/community" || location === "/community/") {
      return 3;
    }
  };

  store.publishList = async function (listId, title) {
    if (title === "") {
      title = store.currentList.name;
    }
    store.currentList.name = title;
    let response = await api.updateTop5ListById(
      store.currentList._id,
      store.currentList
    );

    let payload = { ownerEmail: auth.user.email };
    response = await api.getTop5ListById(listId, payload);
    if (response.data.success) {
      let top5List = response.data.top5List;
      top5List.published = true;
      response = await api.updateTop5ListById(top5List._id, top5List);
      if (response.data.success) {
        response = await api.updateCommunityList(top5List);

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

  // WHen user initializes the deletion process
  store.markListForDeletion = async function (id) {
    let payload = {
      ownerEmail: auth.user.email,
    };
    let response = await api.getTop5ListById(id, payload);
    if (response.data.success) {
      let top5List = response.data.top5List;
      storeReducer({
        type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
        payload: top5List,
      });
    }
  };
  store.deleteMarkedList = async function () {
    store.deleteList(store.listMarkedForDeletion._id);
  };
  // dELETEs after user's confirmation
  store.deleteList = async function (idList) {
    let response = await api.deleteTop5ListById(idList);
    if (response.data.success) {
      store.loadIdNamePairs();
      history.push("/");
    }
  };
  store.hideDeleteListmodal = async function () {
    storeReducer({
      type: GlobalStoreActionType.HIDE_DELETE_LIST.ADD_COMMENT_LIST,
      payload: null,
    });
    store.closeCurrentList();
  };
  store.closeCurrentList = async function () {
    storeReducer({
      type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
      payload: {},
    });
    history.push("/");
  };
  store.hideDeleteListModal = function () {
    storeReducer({
      type: GlobalStoreActionType.HIDE_DELETE_LIST,
      payload: null,
    });
    store.closeCurrentList();
  };

  // Internally sort method
  store.sortListByCode = function (sortType) {
    let currentList = store.idNamePairs;
    if (!currentList) {
      return false;
    }
    // 1. sorting by newest date
    // 2. sorting by oldest date
    // 3. sorting by views
    // 4. sorting by like
    // 5. sorting by dislike
    let nonPublishedList = currentList.filter(function (obj) {
      return obj.published === false;
    });
    let publishedList = currentList.filter(function (obj) {
      return obj.published === true;
    });
    switch (sortType) {
      case 1:
        publishedList.sort((a, b) => {
          let dateA = new Date(a.createdAt);
          let dateB = new Date(b.createdAt);
          return dateB - dateA;
        });
        break;
      case 2:
        publishedList.sort((a, b) => {
          let dateA = new Date(a.createdAt);
          let dateB = new Date(b.createdAt);

          return dateA - dateB;
        });
        break;
      case 3:
        publishedList.sort((a, b) => (a.stats.views > b.stats.views ? 1 : -1));
        break;
      case 4:
        publishedList.sort((a, b) => (a.stats.like > b.stats.like ? 1 : -1));
        break;
      case 5:
        publishedList.sort((a, b) =>
          a.stats.dislike > b.stats.dislike ? 1 : -1
        );
        break;
      default:
        return false;
    }
    let payload = {
      newList: publishedList.concat(nonPublishedList),
      sortCode: sortType,
    };
    let newList = publishedList.concat(nonPublishedList);
    storeReducer({
      type: GlobalStoreActionType.LOAD_SORTED_LIST,
      payload: payload,
    });
  };

  // Externally sort methods
  store.sortListByNewestDate = function () {
    store.sortListByCode(1);
  };
  store.sortListByOldestDate = function () {
    store.sortListByCode(2);
  };
  store.sortListByViews = function () {
    store.sortListByCode(3);
  };
  store.sortListByLike = function () {
    store.sortListByCode(2);
  };
  store.sortListByDislike = function () {
    store.sortListByCode(5);
  };

  store.sortCurrentListLoaded = function () {
    store.sortListByCode(store.sortCode);
  };

  store.restoreHomePage = async function () {
    let payload = {
      ownerEmail: auth.user.email,
    };
    const response = await api.getUserAllTop5List(payload);
    if (response.data.success) {
      let pairsArray = response.data.idNamePairs;
      storeReducer({
        type: GlobalStoreActionType.LOAD_HOMEPAGE_LIST,
        payload: pairsArray,
      });
    } else {
      console.log("API FAILED TO GET THE LIST PAIRS");
    }
  };
  // *****************************************************************************/

  // ALL list
  store.loadAllPublishedList = async function () {
    const response = await api.loadAllPublishedList();
    if (response.data.success) {
      let pairsArray = response.data.idNamePairs;
      store.loadIdNamePairs(pairsArray);
    } else {
      console.log("API FAILED TO GET THE LIST PAIRS");
    }
  };

  //USER LISTS
  store.loadAllUserList = async function (userName) {
    let payload = { ownerEmail: userName };
    const response = await api.loadAllUserPublishedList(payload);
    if (response.data.success) {
      let pairsArray = response.data.idNamePairs;
      store.loadIdNamePairs(pairsArray);
    } else {
      console.log("API FAILED TO GET THE LIST PAIRS");
    }
  };
  store.clearAllList = async function () {
    storeReducer({
      type: GlobalStoreActionType.CLEAR_ALL_LIST,
      payload: {},
    });
  };
  // ******************************************************************************/
  store.loadCommunityList = async function () {
    let response = await api.getCommunityList();
    if (response.data.success) {
      let pairsArray = response.data.idNamePairs;
      storeReducer({
        type: GlobalStoreActionType.LOAD_COMMUNITY_LIST,
        payload: pairsArray,
      });
    }
  };
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
