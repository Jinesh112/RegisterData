require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bcrypt = require("bcrypt");
const path = require("path");
const hbs = require("hbs");
const jwt = require("jsonwebtoken");

const db = require("../src/db/conn");
const members = require("../src/models/members");
const staticPath = path.join(__dirname, "../public");
const tempPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", tempPath);
hbs.registerPartials(partialPath);
app.use(express.static(staticPath));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log(process.env.SECRET);

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/register", (req, res) => {
    res.render("register");
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if (password === cpassword) {
            const data = new members({
                username: req.body.username,
                email: req.body.email,
                password: password,
                cpassword: cpassword
            })
            // console.log(`the success part {data}`);
            const token = await data.generateAuthToken();
            // console.log(`the token part is {token}`);

            const newData = await data.save();
            // console.log(newData);
            res.status(201).render("index");
        } else {
            res.send("invalid");
        }
    } catch (e) {
        res.status(404).send(e);
    }
})

app.post("/login", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const name = await members.findOne({ username: username });

        const isMatch = await bcrypt.compare(password, name.password);
        const token = await name.generateAuthToken();
        // console.log(`the token part is {token}`);
        if (isMatch) {
            res.status(201).render("index");
        } else {
            res.send("<h1>invalid</h1>");
        }
    } catch (e) {
        res.status(404).send(e);
    }
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})



