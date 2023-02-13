
const userController = {
    //View profile => /api/v1/profile
    viewProfile : (req, res) => {
            res.status(200).json({
                success : true,
                message : "View profile route"
            });
        },
    //Edit profile name and email => /api/v1/profile/edit
    editProfile : (req, res) => {
        res.status(200).json({
            success : true,
            message : "Edit profile name and email route"
        });
    },
    //Edit password => /api/v1/profile/password
    editPassword : (req, res) => {
        res.status(200).json({
            success : true,
            message : "Profile Edit Password "
        });
    },
    //view Game list => /api/v1/list
    viewGameList : (req, res) => {
        res.status(200).json({
            success : true,
            message : "View game list route"
        });
    },
    //view Game statistics => /api/v1/list/:gameId
    gameStats : (req, res) => {
        res.status(200).json({
            success : true,
            message : "Game Stats route"
        });
    },
    //Delete account => /api/v1/delete
    delAccount : (req, res) => {
        res.status(200).json({
            success : true,
            message : "Delete Account route"
        });
    }
}

module.exports = userController