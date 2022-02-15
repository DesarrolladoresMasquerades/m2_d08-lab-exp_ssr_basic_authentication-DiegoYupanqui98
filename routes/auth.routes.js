const express = require("express");
const User = require("../models/User.model");
const router = express.Router();
const saltRound = 10;
const bcrypt = require("bcrypt");

router
	.route("/signup")
	.get((req, res) => {
		res.render("signup");
	})
	.post((req, res) => {
		const username = req.body.username;
		const password = req.body.password;

		// Check the form is NOT empty
		if (!username || !password)
			res.render("signup", { errorMessage: "All filds are required" });

		User.findOne({ username })
			.then(user => {
				console.log(user)
				if (user && user.username) {
					res.render('signup', { errorMessage: "User already taken!" })
					throw new Error("Validation error")
				}

				User.create(
                    { 
                        username, 
                        password: bcrypt.hashSync(password,bcrypt.genSaltSync(saltRound))
                    
                    })
					.then(res.redirect("/auth/signup"))
				//}
			})
			.catch(error => res.render('signup', { errorMessage: error }))
	});

router.route("/login")
	.get((req, res) => {
		res.render("login");
	})

	.post((req, res) => {
		const username = req.body.username,
		password = req.body.password

		// Check the form is NOT empty
		if (!username || !password) {
			res.render("signup", { errorMessage: "All filds are required" });
			throw new Error("Validation error ")
		}

		User.findOne({ username })
			.then(user => {
				if (!user) {
					res.render('login', { errorMessage: "Incorrect credentials" })
					throw new Error("Validation error ")
				}

				const isPwdCorrect = bcrypt.compareSync(password, user.password)

				if (isPwdCorrect) {
					req.session.currentUser = user._id
					
					res.redirect("/auth/main")
				} else {
					res.render('login', { errorMessage: "incorrect credentials" })

				}
			})
			.catch(error => console.log(error))

	})	

router.get("/main", (req, res) => {

	const id = req.session.currentUser;

	User.findById(id)
	.then(user => res.render('main', user))
	.catch(error => console.log(error))
});

router.get("/main", (req, res) => {

	const id = req.session.currentUser;

	User.findById(id)
	.then(user => res.render('main', user))
	.catch(error => console.log(error))
});

router.get("/private", (req, res) => {

	const id = req.session.currentUser;

	User.findById(id)
	.then(user => res.render('private', user))
	.catch(error => console.log(error))
});

router.get("/logout", (req,res)=> {
	
	req.session.destroy(() => res.redirect("/"))
})
module.exports = router;
