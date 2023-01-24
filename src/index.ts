import * as dotenv from 'dotenv'
dotenv.config() //whole app can use the env file
import config from './config'

import app from './server'

app.listen(config.port, () => {
    console.log(`server on http://localhost:${config.port}`)
})  