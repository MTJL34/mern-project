const mongoose = require("mongoose");

mongoose
    .connect('mongodb+srv://'+ process.env.DB_USER_PASS + '@mern-project.szhrl.mongodb.net/mern-project',
    {
        useNewURLParser: true,
        useUnifiedTopology: true,
    })
    .then(() =>console.log("Connected to MongoDB"))
    .catch((err) => console.log("Failed to connect to MongoDB", err));