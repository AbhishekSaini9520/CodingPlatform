const mongoose = require("mongoose");
require("dotenv").config();

// Import User model
const User = require("./models/user");
const Problem = require("./models/problem");

// MongoDB connection
mongoose.connect(process.env.DB_CONNECT_STRING)
    .then(() => {
        console.log("DB Connected");
        updateProblems();
        // updateUsers();
        // cleanUserSolvedProblems();
        // cleanInvalidSubmissions();
        // updateSolvedProblems();
        // updateSolveCounts();
    })
    .catch(err => {
        console.error("DB Connection Error:", err);
    });

async function updateProblems() {
    try {
        const result = await Problem.updateMany(
            { ytlink: { $exists: false } },   // jisme ytlink nahi hai
            { $set: { ytlink: "" } }          // field add karo
        );

        console.log("Problems updated:", result.modifiedCount);

        mongoose.connection.close();
    } catch (error) {
        console.error("Error:", error);
        mongoose.connection.close();
    }
}

async function updateUsers() {
    try {
        const result = await Problem.updateMany(
            { ytlink: { $exists: false } },  // only users without ytlink
            { $set: { ytlink: "" } }         // add field with default value
        );

        console.log(`Problem updated: ${result.modifiedCount}`);

        mongoose.connection.close();
    } catch (error) {
        console.error("Error updating users:", error);
        mongoose.connection.close();
    }
}

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