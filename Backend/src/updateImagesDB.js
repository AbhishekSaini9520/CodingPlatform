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
        // cleanUserSolvedProblems();
        // cleanInvalidSubmissions();
        // updateSolvedProblems();
        // updateSolveCounts();
    })
    .catch(err => {
        console.error("DB Connection Error:", err);
    });

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
// updateSolvedProblems();

// const mongoose = require("mongoose");
// require("dotenv").config();

// // Import User model
// const User = require("./models/user");

// // MongoDB connection
// mongoose.connect(process.env.DB_CONNECT_STRING)
//     .then(() => {
//         console.log("DB Connected");
//         updateUsers();
//     })
//     .catch(err => {
//         console.error("DB Connection Error:", err);
//     });

// async function updateUsers() {

//     try {

//         // Add profileImage if missing
//         const profileResult = await User.updateMany(
//             { profileImage: { $exists: false } },
//             {
//                 $set: {
//                     profileImage: "https://res.cloudinary.com/diq2vbfgs/image/upload/v1772708785/defaultProfile_eo9p4m.png"
//                 }
//             }
//         );

//         console.log("Profile images updated:", profileResult.modifiedCount);


//         // Add coverImage if missing
//         const coverResult = await User.updateMany(
//             { coverImage: { $exists: false } },
//             {
//                 $set: {
//                     coverImage: "https://res.cloudinary.com/diq2vbfgs/image/upload/v1772708785/defaultCover_dpdodu.png"
//                 }
//             }
//         );

//         console.log("Cover images updated:", coverResult.modifiedCount);

//         console.log("Update Completed");

//         process.exit();

//     } catch (error) {

//         console.error("Error updating users:", error);
//         process.exit(1);

//     }

// }

