const multer = require("multer");
const XLSX = require("xlsx");
const TestInfo = require("../models/TestInfo");
const TestData = require("../models/TestData");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // read excel file sent from the client
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    if (workbook.SheetNames.length !== 4) {
      // return res.status(400).json({
      //   error: "invalid file: The Excel file must have exactly 4 sheets.",
      // });
      return res.status(400).send({
        error: "invalid file: The Excel file must have exactly 4 sheets.",
      });
    }
    const sheetsData = workbook.SheetNames.reduce((sheets, sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const sheetAsArray = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      sheets[sheetName] = sheetAsArray;
      return sheets;
    }, {});

    // remove empty rows at the end of the file
    var indexOfFirstEmptyRow = 0;
    for (var i = 1; i < sheetsData.DAQ.length; i++) {
      try {
        if (!sheetsData.DAQ[i][1]) {
          indexOfFirstEmptyRow = i;
          break;
        }
      } catch {
        indexOfFirstEmptyRow = i;
        break;
      }
    }

    // only try to remove empty rows if there actually are empty rows
    if (indexOfFirstEmptyRow != 0) {
      const length = sheetsData.DAQ.length;
      for (var i = length - 1; i >= indexOfFirstEmptyRow; i--) {
        sheetsData.DAQ.splice(i, 1);
      }
    }

    // remove unwanted timestamp columns from each row
    const timestampIndexes = sheetsData.DAQ[0]
      .map((value, index) => (value.indexOf("Timestamp") !== -1 ? index : -1))
      .filter((index) => index !== -1);
    timestampIndexes.splice(0, 1);
    timestampIndexes.reverse();
    for (var i = 0; i < sheetsData.DAQ.length; i++) {
      timestampIndexes.forEach((index) => sheetsData.DAQ[i].splice(index, 1));
    }

    // create the TestInfo document
    const headers = sheetsData.DAQ.shift();
    headers.shift();
    const info = {
      headers: headers,
      setup: {
        title: sheetsData.Test_Setup[1][0],
        author: sheetsData.Test_Setup[1][1],
        datetime: stringToDate(sheetsData.Test_Setup[1][2]),
      },
      details: {
        operator: sheetsData["Test Details_Stream"][1][0],
        projectNo: sheetsData["Test Details_Stream"][1][2],
        partNo: sheetsData["Test Details_Stream"][1][4],
        serialNo: sheetsData["Test Details_Stream"][1][6],
        fluid: sheetsData["Test Details_Stream"][1][8],
        fillRatio: sheetsData["Test Details_Stream"][1][10],
        chillerTemp: sheetsData["Test Details_Stream"][1][12],
        orientation: sheetsData["Test Details_Stream"][1][14],
        testDesignation: sheetsData["Test Details_Stream"][1][16],
        clampPressureOrTorque: sheetsData["Test Details_Stream"][1][18],
        tim: sheetsData["Test Details_Stream"][1][20],
        comments: sheetsData["Test Details_Stream"][1][22],
        retest: sheetsData["Test Details_Stream"][1][24],
        timestamp: serialToDate(sheetsData["Test Details_Stream"][1][30]),
      },
    };

    // insert the TestInfo document and get the tests objectId
    const testInfo = new TestInfo(info);
    const testInfoRes = await testInfo.save();

    // generate the TestData documents
    const timestamps = [];
    const scans = [];
    for (var i = 0; i < sheetsData.DAQ.length; i++) {
      timestamps.push(serialToDate(sheetsData.DAQ[i].shift()));
      scans.push(sheetsData.DAQ[i]);
    }
    const documents = [];
    for (var i = 0; i < timestamps.length; i++) {
      const obj = {
        timestamp: timestamps[i],
        metadata: { testId: testInfoRes._id },
        scan: scans[i],
      };
      documents.push(obj);
    }

    // insert the TestData documents
    TestData.insertMany(documents);

    res.json({ testId: testInfoRes._id });
  } catch (e) {
    console.log(e);
    res.json({ testId: undefined });
    res.sendStatus(500);
  }
};

module.exports = {
  handleFileUpload,
  upload,
};

// date conversion functions specific to reading the excel files:

const serialToDate = (serial) => {
  const baseDate = new Date(1900, 0, 1);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  if (serial > 60) {
    serial -= 1;
  }
  const date = new Date(baseDate.getTime() + (serial - 1) * millisecondsPerDay);

  return date;
};

function stringToDate(str) {
  const [datePart, timePart] = str.split("_");
  const [year, month, day] = datePart.split(".").map(Number);
  const [hour, minute, second] = timePart.split(".").map(Number);
  const milliseconds = timePart.split(".")[3]
    ? Number(timePart.split(".")[3])
    : 0;
  const date = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
    milliseconds
  );
  return date;
}

// how to display the date to a user:
// new Date('2023-02-28T22:15:02.000+00:00').toLocaleString();
// outputs: "2/28/2023, 4:15:02 PM"
