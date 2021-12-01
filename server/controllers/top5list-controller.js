const Top5List = require("../models/top5list-model");
const mongoose = require("mongoose");

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
    console.log("req", req);
    top5List.name = body.name;
    top5List.items = body.items;
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
// *****************************************************************************************************//

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
            like: list.stats.like,
            dislike: list.stats.dislike,
            views: list.stats.views,
          },
          items: list.items,
          ownerEmail: list.ownerEmail,
          firstName: list.firstName,
          lastName: list.lastName,
          comments: list.comments,
          published: list.published,
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
  let { message, firstName, lastName } = req.body;
  console.log(message, firstName, lastName);
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
};
module.exports = {
  createTop5List,
  updateTop5List,
  deleteTop5List,
  getTop5Lists,
  getUserAllTop5List,
  getTop5ListById,
  addComment,
};
