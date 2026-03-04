const User = require("../models/user");

const getUserRank = async (req, res) => {
    try {

        // console.log(req.result);
        const userId = req.result._id;
        // console.log("yah bhi chal raha hai")
        const currentUser =
            await User.findById(userId);

        const betterUsers =
            await User.countDocuments({
                solvedCount: {
                    $gt: currentUser.solvedCount
                }
            });

        console.log(betterUsers);

        // const betterUsers = 5;

        const rank = betterUsers + 1;

        const totalUsers = await User.countDocuments();

        console.log(totalUsers)
        // const totalUsers = 10;
        const topPercent =
            ((rank / totalUsers) * 100).toFixed(2);


        res.json({
            rank,
            topPercent,
            solved:
                currentUser.solvedCount
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

module.exports = getUserRank;