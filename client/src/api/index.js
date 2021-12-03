/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

import axios from "axios";
axios.defaults.withCredentials = true;
// axios.defaults.validateStatus = (status) => {
//   return status >= 200;
// };
const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE CALL THE payload, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
export const createTop5List = (payload) => api.post(`/top5list/`, payload);
export const getAllTop5Lists = () => api.get(`/top5lists/`);

export const updateTop5ListById = (id, payload) =>
  api.put(`/top5list/${id}`, payload);
export const deleteTop5ListById = (id) => api.delete(`/top5list/${id}`);
export const getTop5ListById = (id, payload) =>
  api.get(`/top5list/${id}`, { params: payload });

export const getLoggedIn = () => api.get(`/loggedIn/`);
export const registerUser = (payload) => api.post(`/register/`, payload);

export const loginUser = (payload) => api.post(`/login/`, payload); // not implemented
export const logoutUser = () => api.get(`/logout/`); // not implemented

// ******************************************************************/
export const getUserAllTop5List = (payload) =>
  api.get(`/top5listpairs/`, { params: payload });

export const addComment = (payload) => api.post("/addcomment/", payload);

// ******************************************************************/

export const removeLikeVote = (payload) => api.post("/removeLike/", payload);
export const removeDislikeVote = (payload) =>
  api.post("/removeDislike/", payload);

export const addLikeVote = (payload) => api.post("/addLike/", payload);
export const addDislikeVote = (payload) => api.post("/addDislike/", payload);

const apis = {
  createTop5List,
  getAllTop5Lists,
  getUserAllTop5List,
  updateTop5ListById,
  deleteTop5ListById,
  getTop5ListById,

  addComment,

  getLoggedIn,
  registerUser,
  loginUser,
  logoutUser,

  removeLikeVote,
  removeDislikeVote,

  addLikeVote,
  addDislikeVote,
};

export default apis;
