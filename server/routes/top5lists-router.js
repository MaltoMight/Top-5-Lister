const auth = require("../auth");
const express = require("express");
const Top5ListController = require("../controllers/top5list-controller");
const UserController = require("../controllers/user-controller");
const router = express.Router();

router.put("/top5list/:id", auth.verify, Top5ListController.updateTop5List);
router.delete("/top5list/:id", auth.verify, Top5ListController.deleteTop5List);
router.get("/top5list/:id", auth.verify, Top5ListController.getTop5ListById);
// router.get("/top5lists", auth.verify, Top5ListController.getTop5Lists);
router.get("/allLists", Top5ListController.getAllPublishedLists);

router.post("/register", UserController.registerUser);
router.get("/loggedIn", UserController.getLoggedIn);
router.post("/login", UserController.loginUser);
router.get("/logout", UserController.logoutUser);

// **************************************************

router.post("/top5list", auth.verify, Top5ListController.createTop5List);

router.post("/addcomment", Top5ListController.addComment); // add comment
router.get(
  "/top5listpairs",
  auth.verify,
  Top5ListController.getUserAllTop5List
);

// *************************** STATS ***********************

router.post("/removeLike", Top5ListController.removeLikeVote);
router.post("/removeDislike", Top5ListController.removeDislikeVote);
router.post("/addLike", Top5ListController.addLikeVote);
router.post("/addDislike", Top5ListController.addDislikeVote);
router.post("/incrementView", Top5ListController.incrementView);
module.exports = router;
