const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Top5ListSchema;
const CommunityListSchema = new Schema(
  {
    name: { type: String, required: true },
    items: [Schema.Types.Mixed],
    // votes: { type: [Number], required: true },
    // ownerEmail: { type: String, required: true },
    stats: {
      like: { type: [String], required: true },
      dislike: { type: [String], required: true },
      views: { type: Number, required: true },
    },
    published: { type: Boolean, required: true },
    // firstName: { type: String, required: true },
    // lastName: { type: String, required: true },
    comments: [Schema.Types.Mixed],
    // comments: {
    //   type: [{ firstName: String }, { lastName: String }, { comment: String }],
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommunityList", CommunityListSchema);
