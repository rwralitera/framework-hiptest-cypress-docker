import faker from 'faker'
import uuidv4 from 'uuid/v4'

// faker.locale = 'fr'

export const generator = {
    generateRandomEmailAddress: () => {
        return new Promise(async resolve => {
            const mail = `qa+${uuidv4()}@test.fr`
            resolve(mail)
        })
    },
    test: () => {
        return new Promise(async resolve => {
            resolve(faker.lorem.words())
        })
    },
    createRandomString: (length) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}