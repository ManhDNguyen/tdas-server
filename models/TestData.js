const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TestDataSchema = Schema(
  {
    timestamp: { type: Date, required: true },
    metadata: { testId: { type: mongoose.Types.ObjectId, required: true } },
    scan: { type: [Number], required: true },
  },
  {
    timeseries: { timeField: "timestamp", metaField: "metadata" },
  }
);

const TestData = mongoose.model("TestData", TestDataSchema);

module.exports = TestData;
