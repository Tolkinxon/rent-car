const { sign, verify } = require('jsonwebtoken');
const { TOKEN_KEY } = require('../config');

const tokenService = {
    createToken: (payload) => sign(payload, TOKEN_KEY, {expiresIn: '1d'}),
    verifyToken: (token) => verify(token, TOKEN_KEY),
}

module.exports = tokenService;