const Top5List = require("../models/top5list-model");
const CommunityList = require("../models/community-model");
const mongoose = require("mongoose");

// const LIKE = 0;
// const DISLIKE = 1;
updateTop5List = async (req, res) => {
  const body = req.body;
  console.log("updateTop5List: " + JSON.stringify(body));
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update",
    });
  }

  Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
    console.log("top5List found: " + JSON.stringify(top5List));
    if (err) {
      return res.status(404).json({
        err,
        message: "Top 5 List not found!",
      });
    }

    // console.log("body:", body);
    console.log("req", body);
    top5List.name = body.name;
    top5List.items = body.items;
    top5List.published = body.published;
    top5List.comments = body.comments;
    top5List.stats = body.stats;
    top5List
      .save()
      .then(() => {
        console.log("SUCCESS!!!");
        return res.status(200).json({
          success: true,
          id: top5List._id,
          message: "Top 5 List updated!",
        });
      })
      .catch((error) => {
        console.log("FAILURE: " + JSON.stringify(error));
        return res.status(404).json({
          error,
          message: "Top 5 List not updated!",
        });
      });
  });
};

deleteTop5List = async (req, res) => {
  Top5List.findById({ _id: req.params.id }, (err, top5List) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "Top 5 List not found!",
      });
    }
    Top5List.findOneAndDelete({ _id: req.params.id }, () => {
      return res.status(200).json({ success: true, data: top5List });
    }).catch((err) => console.log(err));
  });
};

getTop5ListById = async (req, res) => {
  let { ownerEmail } = req.query;

  console.log("ownerEmail:", ownerEmail);
  let isValidId = mongoose.Types.ObjectId.isValid(req.params.id);

  if (!isValidId) {
    return res.status(400).json({ success: false, error: "Invalid Id" });
  }
  await Top5List.findById({ _id: req.params.id }, (err, list) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!list) {
      return res.status(400).json({ success: false, error: "Invalid List" });
    }
    if (list.ownerEmail != ownerEmail) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized Acess" });
    }
    return res.status(200).json({ success: true, top5List: list });
  }).catch((err) => console.log(err));
};
getTop5Lists = async (req, res) => {
  await Top5List.find({}, (err, top5Lists) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!top5Lists.length) {
      return res
        .status(404)
        .json({ success: false, error: `Top 5 Lists not found` });
    }
    return res.status(200).json({ success: true, data: top5Lists });
  }).catch((err) => console.log(err));
};
// ******************************************** Workable *********************************************************//

createTop5List = (req, res) => {
  const body = req.body;
  console.log("body:", body);
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a Top 5 List",
    });
  }

  const top5List = new Top5List(body);
  console.log("creating top5List: " + JSON.stringify(top5List));
  if (!top5List) {
    return res.status(400).json({ success: false, error: err });
  }

  top5List
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        top5List: top5List,
        message: "Top 5 List Created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Top 5 List Not Created!",
      });
    });
};

///////////////////////////////////////////////////////////////////////////////
getAllUserPublishedLists = async (req, res) => {
  console.log(req.body);
  let { ownerEmail } = req.body;
  console.log(ownerEmail);
  await Top5List.find({ ownerEmail: ownerEmail }, (err, top5Lists) => {
    // console.log("top55555555list:", top5Lists);
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!top5Lists) {
      console.log("!top5Lists.length");
      return res
        .status(404)
        .json({ success: false, error: "Top 5 Lists not found" });
    } else {
      // PUT ALL THE LISTS INTO ID, NAME PAIRS

      let pairs = [];
      let publishedLists = top5Lists.filter((item) => {
        return item.published === true;
      });

      for (let key in publishedLists) {
        let list = publishedLists[key];

        let pair = {
          _id: list._id,
          name: list.name,
          stats: {
            like: list.stats.like.length,
            dislike: list.stats.dislike.length,
            views: list.stats.views,
          },
          items: list.items,
          ownerEmail: list.ownerEmail,
          firstName: list.firstName,
          lastName: list.lastName,
          comments: list.comments,
          published: list.published,
          createdAt: list.createdAt,
        };
        pairs.push(pair);
      }
      return res.status(200).json({ success: true, idNamePairs: pairs });
    }
  }).catch((err) => console.log(err));
};
getUserAllTop5List = async (req, res) => {
  let { ownerEmail } = req.query;
  console.log(ownerEmail);
  await Top5List.find({ ownerEmail: ownerEmail }, (err, top5Lists) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!top5Lists) {
      console.log("!top5Lists.length");
      return res
        .status(404)
        .json({ success: false, error: "Top 5 Lists not found" });
    } else {
      // PUT ALL THE LISTS INTO ID, NAME PAIRS

      let pairs = [];
      for (let key in top5Lists) {
        let list = top5Lists[key];
        console.log("list:", list);

        let pair = {
          _id: list._id,
          name: list.name,
          stats: {
            like: list.stats.like.length,
            dislike: list.stats.dislike.length,
            views: list.stats.views,
          },
          items: list.items,
          ownerEmail: list.ownerEmail,
          firstName: list.firstName,
          lastName: list.lastName,
          comments: list.comments,
          published: list.published,
          createdAt: list.createdAt,
        };
        pairs.push(pair);
      }
      return res.status(200).json({ success: true, idNamePairs: pairs });
    }
  }).catch((err) => console.log(err));
};

getAllPublishedLists = async (req, res) => {
  console.log("retrieving all the published lists");
  await Top5List.find({ published: true }, (err, top5Lists) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!top5Lists) {
      console.log("!top5Lists.length");
      return res
        .status(404)
        .json({ success: false, error: "Top 5 Lists not found" });
    } else {
      // PUT ALL THE LISTS INTO ID, NAME PAIRS

      let pairs = [];
      for (let key in top5Lists) {
        let list = top5Lists[key];
        // console.log("list:", list);

        let pair = {
          _id: list._id,
          name: list.name,
          stats: {
            like: list.stats.like.length,
            dislike: list.stats.dislike.length,
            views: list.stats.views,
          },
          items: list.items,
          ownerEmail: list.ownerEmail,
          firstName: list.firstName,
          lastName: list.lastName,
          comments: list.comments,
          published: list.published,
          createdAt: list.createdAt,
        };
        pairs.push(pair);
      }
      return res.status(200).json({ success: true, idNamePairs: pairs });
    }
  }).catch((err) => console.log(err));
};

addComment = async (req, res) => {
  console.log("adding comment");
  // console.log("req:", req);
  let { message, firstName, lastName, communityList } = req.body;
  console.log(message, firstName, lastName);
  if (!communityList) {
    Top5List.findOne({ _id: req.body._id }, (err, top5List) => {
      console.log(top5List);
      top5List.comments.addToSet({
        firstname: firstName,
        lastName: lastName,
        message: message,
      });
      console.log(top5List);
      // top5List.save();
      top5List
        .save()
        .then(() => {
          console.log("SUCCESS!!!");
          return res.status(200).json({
            success: true,
            comment: {
              firstName: firstName,
              lastName: lastName,
              message: message,
            },
            id: top5List._id,
            message: "Top 5 List updated!",
          });
        })
        .catch((error) => {
          console.log("FAILURE: " + JSON.stringify(error));
          return res.status(404).json({
            error,
            message: "Top 5 List not updated!",
          });
        });
    });
  } else {
    CommunityList.findOne({ _id: req.body._id }, (err, top5List) => {
      console.log(top5List);
      top5List.comments.addToSet({
        firstname: firstName,
        lastName: lastName,
        message: message,
      });
      console.log(top5List);
      // top5List.save();
      top5List
        .save()
        .then(() => {
          console.log("SUCCESS!!!");
          return res.status(200).json({
            success: true,
            comment: {
              firstName: firstName,
              lastName: lastName,
              message: message,
            },
            id: top5List._id,
            message: "Top 5 List updated!",
          });
        })
        .catch((error) => {
          console.log("FAILURE: " + JSON.stringify(error));
          return res.status(404).json({
            error,
            message: "Top 5 List not updated!",
          });
        });
    });
  }
};

addLikeVote = async (req, res) => {
  let { userEmail, listId, communityList } = req.body;
  if (!communityList) {
    Top5List.findOne({ _id: listId }, (err, top5List) => {
      let voteList = top5List.stats.like;
      voteList.push(userEmail);

      top5List
        .save()
        .then(() => {
          return res
            .status(200)
            .json({ success: true, error: "Added Like Success" });
        })
        .catch(() => {
          return res
            .status(400)
            .json({ success: false, error: "Error to add like" });
        });
    });
  } else {
    CommunityList.findOne({ _id: listId }, (err, top5List) => {
      let voteList = top5List.stats.like;
      voteList.push(userEmail);

      top5List
        .save()
        .then(() => {
          return res
            .status(200)
            .json({ success: true, error: "Added Like Success" });
        })
        .catch(() => {
          return res
            .status(400)
            .json({ success: false, error: "Error to add like" });
        });
    });
  }
};
addDislikeVote = async (req, res) => {
  let { userEmail, listId, communityList } = req.body;
  if (!communityList) {
    Top5List.findOne({ _id: listId }, (err, top5List) => {
      let voteList = top5List.stats.dislike;
      voteList.push(userEmail);

      top5List
        .save()
        .then(() => {
          return res
            .status(200)
            .json({ success: true, message: "Added Dislike Success" });
        })
        .catch(() => {
          return res
            .status(400)
            .json({ success: false, error: "Error to add dislike" });
        });
    });
  } else {
    CommunityList.findOne({ _id: listId }, (err, top5List) => {
      let voteList = top5List.stats.dislike;
      voteList.push(userEmail);

      top5List
        .save()
        .then(() => {
          return res
            .status(200)
            .json({ success: true, message: "Added Dislike Success" });
        })
        .catch(() => {
          return res
            .status(400)
            .json({ success: false, error: "Error to add dislike" });
        });
    });
  }
};
removeDislikeVote = async (req, res) => {
  let { userEmail, listId, communityList } = req.body;
  console.log("removing DISLIKE");
  console.log(userEmail, listId);
  if (!communityList) {
    Top5List.findOne({ _id: listId }, (err, top5List) => {
      let elementIndexDislike = top5List.stats.dislike.indexOf(userEmail);

      console.log("REMOVE DISLIKE:");
      console.log("ElementIndexDislike:", elementIndexDislike);

      // User didnot vote before
      if (elementIndexDislike === -1) {
        return res
          .status(200)
          .json({ success: true, message: "User did not voted for dislike" });
      } else {
        top5List.stats.dislike = top5List.stats.dislike.filter(
          (item) => item !== userEmail
        );
        top5List.save().then(() => {
          return res
            .status(200)
            .json({ success: true, message: "Removed successfully" });
        });
      }
    });
  } else {
    CommunityList.findOne({ _id: listId }, (err, top5List) => {
      let elementIndexDislike = top5List.stats.dislike.indexOf(userEmail);

      console.log("REMOVE DISLIKE:");
      console.log("ElementIndexDislike:", elementIndexDislike);

      // User didnot vote before
      if (elementIndexDislike === -1) {
        return res
          .status(200)
          .json({ success: true, message: "User did not voted for dislike" });
      } else {
        top5List.stats.dislike = top5List.stats.dislike.filter(
          (item) => item !== userEmail
        );
        top5List.save().then(() => {
          return res
            .status(200)
            .json({ success: true, message: "Removed successfully" });
        });
      }
    });
  }
};

removeLikeVote = async (req, res) => {
  let { userEmail, listId, communityList } = req.body;
  if (!communityList) {
    console.log("removing Like");
    console.log(userEmail, listId);

    Top5List.findOne({ _id: listId }, (err, top5List) => {
      let elementIndexLike = top5List.stats.like.indexOf(userEmail);

      console.log("REMOVE LIKE:");
      console.log("ElementIndexlike:", elementIndexLike);

      // User didnot vote before
      if (elementIndexLike === -1) {
        return res
          .status(200)
          .json({ success: true, message: "User did not voted for Like" });
      } else {
        // top5List.stats.dislike.splice(elementIndexLike, 1);
        top5List.stats.like = top5List.stats.like.filter(
          (item) => item !== userEmail
        );
        top5List.save().then(() => {
          return res
            .status(200)
            .json({ success: true, message: "Removed successfully" });
        });
      }
    });
  } else {
    console.log("removing Like");
    console.log(userEmail, listId);

    CommunityList.findOne({ _id: listId }, (err, top5List) => {
      let elementIndexLike = top5List.stats.like.indexOf(userEmail);

      console.log("REMOVE LIKE:");
      console.log("ElementIndexlike:", elementIndexLike);

      // User didnot vote before
      if (elementIndexLike === -1) {
        return res
          .status(200)
          .json({ success: true, message: "User did not voted for Like" });
      } else {
        // top5List.stats.dislike.splice(elementIndexLike, 1);
        top5List.stats.like = top5List.stats.like.filter(
          (item) => item !== userEmail
        );
        top5List.save().then(() => {
          return res
            .status(200)
            .json({ success: true, message: "Removed successfully" });
        });
      }
    });
  }
};
checkVoteDislike = async (req, res) => {
  let { listId, userEmail, communityList } = req.body;
  if (!communityList) {
    Top5List.findOne({ _id: listId }, (err, top5List) => {
      let elementIndexDislike = top5List.stats.dislike.indexOf(userEmail);
      if (elementIndexDislike === -1) {
        return res.status(200).json({
          success: true,
          containsUser: false,
          message: "User did not vote for Dislike",
        });
      } else {
        return res.status(200).json({
          success: true,
          containsUser: true,
          message: "User did  vote for Dislike",
        });
      }
    });
  } else {
    CommunityList.findOne({ _id: listId }, (err, top5List) => {
      let elementIndexDislike = top5List.stats.dislike.indexOf(userEmail);
      if (elementIndexDislike === -1) {
        return res.status(200).json({
          success: true,
          containsUser: false,
          message: "User did not vote for Dislike",
        });
      } else {
        return res.status(200).json({
          success: true,
          containsUser: true,
          message: "User did  vote for Dislike",
        });
      }
    });
  }
};
checkVoteLike = async (req, res) => {
  let { listId, userEmail, communityList } = req.body;
  if (!communityList) {
    Top5List.findOne({ _id: listId }, (err, top5List) => {
      let elementIndexLike = top5List.stats.like.indexOf(userEmail);
      if (elementIndexLike === -1) {
        return res.status(200).json({
          success: true,
          containsUser: false,
          message: "User did not vote for Like",
        });
      } else {
        return res.status(200).json({
          success: true,
          containsUser: true,
          message: "User did  vote for Like",
        });
      }
    });
  } else {
    CommunityList.findOne({ _id: listId }, (err, top5List) => {
      let elementIndexLike = top5List.stats.like.indexOf(userEmail);
      if (elementIndexLike === -1) {
        return res.status(200).json({
          success: true,
          containsUser: false,
          message: "User did not vote for Like",
        });
      } else {
        return res.status(200).json({
          success: true,
          containsUser: true,
          message: "User did  vote for Like",
        });
      }
    });
  }
};

incrementView = async (req, res) => {
  let { listId, communityList } = req.body;
  if (!communityList) {
    Top5List.findOne({ _id: listId }, (err, top5List) => {
      top5List.stats.views++;
      top5List
        .save()
        .then(() => {
          return res
            .status(200)
            .json({ success: true, message: "Incremented View" });
        })
        .catch(() => {
          return res
            .status(400)
            .json({ success: false, error: "Error to increment the view" });
        });
    });
  } else {
    CommunityList.findOne({ _id: listId }, (err, top5List) => {
      top5List.stats.views++;
      top5List
        .save()
        .then(() => {
          return res
            .status(200)
            .json({ success: true, message: "Incremented View" });
        })
        .catch(() => {
          return res
            .status(400)
            .json({ success: false, error: "Error to increment the view" });
        });
    });
  }
};

updateCommunityList = async (req, res) => {
  // console.log("community:", req.body);
  let titleList = req.body.name;
  CommunityList.findOne(
    { name: { $regex: new RegExp(titleList, "i") } },
    (err, communityList) => {
      // If community list does not exists
      if (communityList === null) {
        let body = {
          name: req.body.name,
          items: [
            { itemName: req.body.items[0], vote: 5 },
            { itemName: req.body.items[1], vote: 4 },
            { itemName: req.body.items[2], vote: 3 },
            { itemName: req.body.items[3], vote: 2 },
            { itemName: req.body.items[4], vote: 1 },
          ],

          stats: req.body.stats,
          published: true,
          comments: req.body.comments,
        };
        const newCommunityList = new CommunityList(body);
        if (!newCommunityList) {
          return res.status(400).json({ success: false, error: err });
        }
        newCommunityList
          .save()
          .then(() => {
            return res.status(200).json({
              success: true,
              communityList: newCommunityList,
              message: "Community List Created!",
            });
          })
          .catch((error) => {
            return res.status(400).json({
              error,
              message: "Community List Not Created!",
            });
          });
      }
      // If community list already exist
      else {
        // Check if the items to append exists in to the community List

        let itemsExisted = communityList.items;
        let itemsToAppend = req.body.items;
        let votesToAppend = [5, 4, 3, 2, 1];
        console.log("itemsExisted:", itemsExisted);
        console.log("itemsToAppend:", itemsToAppend);
        let lengthToSearch = 5;
        for (let i = 0; i < lengthToSearch; i++) {
          for (let j = 0; j < itemsExisted.length; j++) {
            let a = itemsToAppend[i];
            a = a.toLowerCase();
            let b = itemsExisted[j].itemName.toLowerCase();

            if (a === b) {
              // console.log(itemsExisted[j].vote);

              itemsExisted[j].vote += votesToAppend[i];
              itemsToAppend = itemsToAppend.filter(
                (item) => item.toLowerCase() !== itemsToAppend[i].toLowerCase()
              );
              votesToAppend = votesToAppend.filter(
                (item) => item !== votesToAppend[i]
              );
              lengthToSearch--;
            }
          }
        }
        if (itemsToAppend.length !== 0) {
          for (let i = 0; i < itemsToAppend.length; i++) {
            itemsExisted.push({
              itemName: itemsToAppend[i],
              vote: votesToAppend[i],
            });
          }
        }

        console.log("RESULT");
        communityList.items = itemsExisted;
        console.log(communityList);

        communityList.markModified("items");
        communityList
          .save()
          .then(() => {
            return res.status(200).json({
              success: true,
              communityList: communityList,
              message: "Community List Created!",
            });
          })
          .catch((error) => {
            return res.status(400).json({
              error,
              message: "Community List Not Created!",
            });
          });
      }
    }
  );
};
getCommunityList = async (req, res) => {
  console.log("retrieving all the COMMUNITY lists");
  await CommunityList.find({}, (err, top5Lists) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!top5Lists) {
      return res
        .status(404)
        .json({ success: false, error: "CommunityList not found" });
    } else {
      // PUT ALL THE LISTS INTO ID, NAME PAIRS

      let pairs = [];
      for (let key in top5Lists) {
        let list = top5Lists[key];

        let items = list.items;
        items.sort((a, b) => (a.vote < b.vote ? 1 : -1));
        items = items.slice(0, 5);
        let pair = {
          _id: list._id,
          name: list.name,
          stats: {
            like: list.stats.like.length,
            dislike: list.stats.dislike.length,
            views: list.stats.views,
          },
          items: items,
          comments: list.comments,
          published: list.published,
          createdAt: list.createdAt,
        };
        pairs.push(pair);
      }

      return res.status(200).json({ success: true, idNamePairs: pairs });
    }
  }).catch((err) => console.log(err));
};
module.exports = {
  createTop5List,
  updateTop5List,
  deleteTop5List,
  getTop5Lists,
  getUserAllTop5List,
  getTop5ListById,
  addComment,

  removeLikeVote,
  removeDislikeVote,

  addLikeVote,
  addDislikeVote,
  getAllPublishedLists,
  incrementView,

  checkVoteLike,
  getAllUserPublishedLists,
  checkVoteDislike,
  updateCommunityList,
  getCommunityList,
};
