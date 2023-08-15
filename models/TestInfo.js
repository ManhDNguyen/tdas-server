const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TestInfoSchema = new Schema({
  headers: { type: [String], required: true },
  setup: {
    title: String,
    author: String,
    datetime: Date,
  },
  details: {
    operator: String,
    projectNo: String,
    partNo: String,
    serialNo: String,
    fluid: String,
    fillRatio: Number,
    chillerTemp: Number,
    orientation: Number,
    testDesignation: String,
    clampPressureOrTorque: Number,
    tim: String,
    comments: String,
    retest: String,
    timestamp: Date,
  },
});

const TestInfo = mongoose.model("TestInfo", TestInfoSchema);

module.exports = TestInfo;
