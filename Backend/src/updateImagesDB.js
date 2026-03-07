const mongoose = require("mongoose");
require("dotenv").config();

// Import Models
const User = require("./models/user");
const Submission = require("./models/submission");
const Problem = require("./models/problem");

// MongoDB connection
mongoose.connect(process.env.DB_CONNECT_STRING)
    .then(() => {
        console.log("DB Connected");
        addTestCaseExample();
        // cleanUserSolvedProblems();
        // cleanInvalidSubmissions();
        // updateSolvedProblems();
        // updateSolveCounts();
    })
    .catch(err => {
        console.error("DB Connection Error:", err);
    });


const addTestCaseExample = async () => {

    await Problem.updateMany(
        { explainTestCase: { $exists: false } },   // only old problems
        {
            $set: {
                explainTestCase: [
                    {
                        input: "",
                        output: "",
                        explanation: ""
                    }
                ]
            }
        }
    );

    console.log("Problems Updated Successfully");
    process.exit();
}

const cleanUserSolvedProblems = async () => {

    const problems = await Problem.find({}, { _id: 1 });
    const validProblemIds = problems.map(p => p._id.toString());

    const users = await User.find({});

    for (const user of users) {

        const originalSolved = user.problemSolved.map(id => id.toString());

        const filteredSolved = originalSolved.filter(id =>
            validProblemIds.includes(id)
        );

        const deletedCount = originalSolved.length - filteredSolved.length;

        if (deletedCount > 0) {

            await User.updateOne(
                { _id: user._id },
                {
                    problemSolved: filteredSolved,
                    $inc: { solvedCount: -deletedCount }
                }
            );

        }
    }

    console.log("User solved problems cleaned");
};

const cleanInvalidSubmissions = async () => {

    // get all problem ids
    const problems = await Problem.find({}, { _id: 1 });
    const problemIds = problems.map(p => p._id);

    // delete invalid submissions
    const result = await Submission.deleteMany({
        problemId: { $nin: problemIds }
    });

    console.log("Deleted submissions:", result.deletedCount);
};
