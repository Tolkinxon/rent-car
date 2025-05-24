const { config } = require('dotenv');
const path = require('path');
config();

const serverConfig = {
    PORT: process.env.PORT || 5000,
    CLOUD_NAME: process.env.CLOUD_NAME, 
    API_KEY: process.env.API_KEY, 
    API_SECRET: process.env.API_SECRET,
    TOKEN_KEY: process.env.TOKEN_KEY,
    dbPath: (fileName) => path.join(process.cwd(), 'db', fileName + '.json'),
    tempFilePath: (fileName) => path.join(process.cwd(), 'src', 'uploads', fileName)
}

module.exports = serverConfig;