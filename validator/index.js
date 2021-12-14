const createPostValidator = (req,res,next) => {
    req.check('title', "Title required").notEmpty();
    req.check('title', "Title must be between 4 to 150 characters").isLength({
        min: 4,
        max: 150
    });

    req.check('body', "body required").notEmpty();
    req.check('body', "body must be between 4 to 2000 characters").isLength({
        min: 4,
        max: 2000
    });

    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({error: firstError});
    }

    next();
}

const userSignupValidator = (req, res, next) => {
    req.check('name', "Name required").notEmpty();
    req.check('email',"Email must be between 3 to 32 characters")
        .matches(/.+\@.+\..+/)
        .withMessage("Email must valid")
        .isLength({
            min: 3,
            max: 32
        });
    req.check('password', "Password required").notEmpty();
    req.check('password').isLength({min: 6})
        .withMessage("Password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("password must contain a number");

    //check for error
    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({error: firstError});
    }

    next();
}

module.exports = {
    createPostValidator,
    userSignupValidator
}