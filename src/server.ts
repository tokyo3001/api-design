import express from 'express'
import router from './router'
import morgan from 'morgan'
import cors from 'cors'
import { protect } from './modules/auth'
import { createNewUser, signin } from './handlers/users'

const app = express()

//this is how we can give arguments in middleware
const customLogger = (message) => (req, res, next) => {
    console.log(`Hello from ${message}`)
    next()
}

app.use(cors()) //anybody can access the api until the ip address is blocked 
//middleware for the whole app i.e, every req has to go through whatever morgan contains
app.use(morgan('dev')) //morgan is the middleware
app.use(express.json()) //client sends us json
app.use(express.urlencoded({extended: true})) //allows a client to add query string, decode & encode properly otherwise all will be treated as a string
app.use(customLogger('customer logger'))

//this is middleware which will be implemented before the get request below
app.use((req, res, next) => {
    req.shhhh_secret = 'doggy'
    next()  //this will help in moving to the next part of the code
})

app.get('/', (req, res, next) => {
    res.json({message: 'hello'})
})

// use allows to apply global options or config to whole app or certain parts and in this case it is for certain parts
app.use('/api',protect, router)  //without /api, the url will not work
//before accessing the route, pass the protect check for authorization
//protect is the middleware that check for authorization
app.post('/user', createNewUser)
app.post('/signin', signin)

app.use((err, req, res, next) => {
    if(err.type === 'auth') {
        res.status(401).json({message: 'unauthorized'})
    } else if (err.type === 'input') {
        res.status(400).json({message: 'invalid input'})
    } else {
        res.status(500).json({message: 'oops its on us'})
    }
})

export default app