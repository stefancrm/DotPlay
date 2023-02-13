
const authController = {
    //Register
    register : (req, res) => {
            res.status(200).json({
                success : true,
                message : "Register route"
            });
        },
    //Login
    login : (req, res) => {
        res.status(200).json({
            success : true,
            message : "Login route"
        });
    },
    //Logout
    logout : (req, res) => {
        res.status(200).json({
            success : true,
            message : "Logout route"
        });
    },
    //Send Reset Password email
    forgot : (req, res) => {
        res.status(200).json({
            success : true,
            message : "Email Reset password route"
        });
    },
    //Reset password from email link
    reset : (req, res) => {
        res.status(200).json({
            success : true,
            message : "Reset password route"
        });
    },
}

module.exports = authController