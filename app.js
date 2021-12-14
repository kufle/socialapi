const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
//const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

//db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
}).then(() => console.log("DB Connected"));

mongoose.connection.on('error', err => {
    console.log(`db connection error : ${err.message}`);
});

//bring in routes
const postRouter = require('./routes/post');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
//middleware
app.use(morgan("dev"));
//app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use("/", postRouter);
app.use("/", authRouter);
app.use("/", userRouter);
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send({error: 'Unauthorized'});
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => { console.log(`A node js , running on listening port ${port}`); });