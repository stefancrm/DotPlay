# DotPlay
Simple RESTful API made with Node Js for keeping track and publishing games
Edit "/config/config.env" file with the necesary information an rename it to ".env"

              Node js packages used :
Express - framework

Mongoose - database

Nodemailer - email sending

dotenv - enviorment variables loader

bcrypt - password hashing

slugify - Slugifies a String

validator - to check the validity or syntactical correctness

jsonwebtoken - token generation for authentification

cookie-parser - for cookie parsing

                        API functions:

User registration
http://localhost:3000/api/v1/register
 
User login
http://localhost:3000/api/v1/login

User logout
http://localhost:3000/api/v1/logout

User password reset request
http://localhost:3000/api/v1/forgot

User password reset (link from email)
http://localhost:3000/api/v1/reset/:token

User view profile
http://localhost:3000/api/v1/profile

User edit profile details
http://localhost:3000/api/v1/profile/edit

User edit password
http://localhost:3000/api/v1/logout/password

User view registered games list (not yet implemented)
http://localhost:3000/api/v1/list 

User view game statistics (not yet implemented)
http://localhost:3000/api/v1/list/:gameId

User delete account request
http://localhost:3000/api/v1/delete

User delete account confirm (link from email)
http://localhost:3000/api/v1/delete/:token

List all games
http://localhost:3000/api/v1/games

Create a game ( user must be developer)
http://localhost:3000/api/v1/game/new

Update game
http://localhost:3000/api/v1/game/update/:id

Delete Game
http://localhost:3000/api/v1/game/delete/:id

User join Game
http://localhost:3000/api/v1/game/join/:id

User play game ( update game statistics for the game) (not yet implemented)
http://localhost:3000/api/v1/play/:id

Admin list all users (not yet implemented)
http://localhost:3000/api/v1/admin/users

Admin promote user to developer (not yet implemented)
http://localhost:3000/api/v1/admin/promote/:id

Admin delete user (not yet implemented)
http://localhost:3000/api/v1/admin/delete/user/:id

Admin delete game (not yet implemented)
http://localhost:3000/api/v1/admin/delete/game/:id
