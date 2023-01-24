import * as user from '../users'

describe('user handler', () => {
    it('should do something when something happens', async () => {
        const req = {body: {username: 'hello', password: 'hi'}}
        const res = {json({token}) {
            expect(token).toBeTruthy()
        }}
        await user.createNewUser(req, res, () => {})
    })
})//unit testing using jest

