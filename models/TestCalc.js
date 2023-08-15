const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TestCalcSchema = Schema({
  testId: { type: mongoose.Types.ObjectId, required: true },
  calculations: [
    {
      id: { type: String },
      operator: { type: String },
      columns: { type: [String] },
    },
  ],
});

const TestCalc = mongoose.model("TestCalc", TestCalcSchema);

module.exports = TestCalc;
