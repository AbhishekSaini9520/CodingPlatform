const mongoose = require("mongoose");
require("dotenv").config();

// Import Models
const User = require("./models/user");
const Submission = require("./models/submission");

// MongoDB connection
mongoose.connect(process.env.DB_CONNECT_STRING)
    .then(() => {
        console.log("DB Connected");
        updateSolveCounts();
    })
    .catch(err => {
        console.error("DB Connection Error:", err);
    });

async function updateSolveCounts() {

    try {

        const result = await Submission.aggregate([
            {
                $match: { status: "Accepted" } // change if your schema uses status_id
            },
            {
                $group: {
                    _id: "$userId",
                    solvedProblems: { $addToSet: "$problemId" }
                }
            },
            {
                $project: {
                    solveCount: { $size: "$solvedProblems" }
                }
            }
        ]);

        for (const user of result) {
            await User.updateOne(
                { _id: user._id },
                { $set: { solveCount: user.solveCount } }
            );
        }

        console.log("Solve counts updated successfully");

        process.exit();

    } catch (error) {

        console.error("Error updating solve counts:", error);
        process.exit(1);

    }

}


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

