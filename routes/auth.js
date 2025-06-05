const { Router } = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../database");
const { userSignupSchema, userLoginSchema } = require("../schemas");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const authRouter = Router();

// POST /signup – register a new user
authRouter.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const validatedUser = userSignupSchema.safeParse({username, password, email});

    console.log(validatedUser);

    if(validatedUser.success){
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Not using validatedUser data since validation doesn't mutate original data only checks
		const newUser = new User({ username, hashedPassword, email });

		await newUser.save();
		console.log(newUser);
		// 201 Created
		res.status(201).json({
			message: "User Succesfully Created",
		});

	}else{
        // 400 Bad Request
        res.status(400).json({
            // More detailed Errors can be returned for better Semantic Understanding
            error: "Validation Failed"
        });
    }
});

// POST /login – authenticate and return a token
authRouter.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const validatedUser = userLoginSchema.safeParse({username, password, email});

    // DEBUG ZOD ERROR
    // console.log(validatedUser);

    if(validatedUser.success){
		// const hashedPassword = await bcrypt.hash(password, saltRounds);

        let user;
		if(username){
            user = await User.findOne({
                username
            });
        }else{
            user = await User.findOne({
				email
			});
        }

		if(user){
            console.log(user);
            const isValid = await bcrypt.compare(
				password,
				user.hashedPassword
			);

            if(isValid){
                const token = jwt.sign(
                    {
                        username: user.username,
                        userId: user._id,
                    },
                    process.env.JWT_SECRET
                );
    
                res.json({
                    message: "User Logged in Succesfully",
                    token
                });

            }else{
                res.status(401).json({
					error: "Invalid Credentials"
				});
            }
        }else{
            res.status(401).json({
                error: "No such User Available"
            });
        }

	}else{
        // 400 Bad Request
        res.status(400).json({
            // More detailed Errors can be returned for better Semantic Understanding
            error: "Validation Failed"
        });
    }
});

module.exports = authRouter;