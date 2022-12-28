const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 5000
const User = require('./models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const JWT_SECRET = 'xnq28ne81dwn'
const multer = require('multer')

mongoose.connect('mongodb+srv://abdullah:hiN7sp1hnEUkymEC@cluster0.3ihwxyn.mongodb.net/userdb?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log('connected to mongo yeahhh')
})

mongoose.connection.on('error', (err) => {
    console.log('error', err)
})

app.use(express.json())
app.use(cors())

app.get('/users', async (req, res) => {
    console.log('db users', req.user);
    const data = await User.find({})
    res.status(200).send({ status: 200, success: true, data: data })
    console.log('data', data);
})

app.get('/users/:id', async (req, res) => {
    const findById = await User.findById({ _id: req.params.id })
    try {
        if (!findById) {
            return res.status(400).send({ success: false, message: "User not found" })
        }
        res.status(200).send({ success: true, data: findById })
    } catch (error) {
        console.log(error);
    }
})

app.post('/signup', async (req, res) => {
    const { username, email, password, phone } = req.body
    const user = await User.findOne({ email })
    const hashedPassword = await bcrypt.hash(password, 12)
    try {
        if (!username || !email || !password || !phone) {
            return res.status(400).send({ error: "Please fill all fields" })
        }
        if (!email.includes('@') || !email.includes('.')) {
            return res.status(400).send({ error: "Please enter valid email" })
        }
        if (isNaN(phone)) {
            return res.status(400).send({ error: "Phone number type should be a number" })
        }
        if (phone.length > 12 || phone.length < 12) {
            return res.status(400).send({ error: "Phone number should be 12 digits" })
        }
        if (user) {
            return res.status(400).send({ error: "User already exists please try another email" })
        }
        await new User({ username, email, password: hashedPassword, phone }).save()
        res.status(200).send({ message: "Signup successfully" })
    } catch (err) {
        console.log(err)
    }
})

app.patch('/users/:id', async (req, res) => {
    const updateUser = await User.findByIdAndUpdate({ _id: req.params.id, username: req.body.username })
    res.status(200).send({ message: updateUser })
})

app.delete('/users/:id', async (req, res) => {
    const removeUser = await User.findByIdAndDelete({ _id: req.params.id })
    res.status(200).send({ message: removeUser })
})

app.post('/login', async (req, res) => {
    const { username, email, password, phone } = req.body
    const user = await User.findOne({ email })
    const isMatch = bcrypt.compare(password, user.password)
    try {
        if (!email || !password) {
            return res.status(400).send({ error: "Please fill all fields" })
        }
        if (!email.includes('@') || !email.includes('.')) {
            return res.status(400).send({ error: "Please enter valid email" })
        }
        if (!user) {
            return res.status(400).send({ error: "Email does not exist" })
        }
        if (!isMatch) {
            return res.status(400).send({ message: "Password do not match" })
        }
        if (isMatch) {
            const token = jwt.sign({ userId: user._id }, JWT_SECRET)
            return res.status(200).send({ message: "Login success", token, data: user })
        }
    } catch (err) {
        console.log(err)
    }
})

app.listen(PORT, () => {
    console.log("Server is running...", PORT);
})

// hiN7sp1hnEUkymEC
// TIgyFbrfVFu795CP
// mongodb+srv://abdullah:hiN7sp1hnEUkymEC@cluster0.3ihwxyn.mongodb.net/userdb?retryWrites=true&w=majority