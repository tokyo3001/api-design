import jwt from 'jsonwebtoken'  //provide security in transmission of info among parties
import bcrypt from 'bcrypt'

export const comparePasswords = (password, hash) => {
    return bcrypt.compare(password, hash)
}

export const hashPassword = (password) => {
    return bcrypt.hash(password, 5 )
}

export const createJWT = (user) => {
     const token = jwt.sign({id: user.id, username: user.username }, process.env.JWT_SECRET)
     return token
}

export const protect = (req, res, next) => {
    const bearer = req.headers.authorization  //the details provided for authorization

    if(!bearer) {
        res.status(401)
        res.json({message: 'not authorized'})
        return
    }

    const [, token] = bearer.split(' ')  //to separate the token

    //if token not available the error msg
    if(!token) {
        res.status(401)
        res.json({message: 'not valid token'})
        return
    }
    
    //token is available then verify the token
    //try catch is used so that server does not die if something goes off
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    } catch(e) {
        console.error(e)
        res.status(401)
        res.json({message: 'not valid token'})
        return
    }
}