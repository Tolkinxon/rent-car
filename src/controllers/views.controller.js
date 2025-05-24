const { globalError } = require('shokhijakhon-error-handler');

module.exports = {
    MAIN: async function(req, res){
        try{
            return res.render('index');
        }
        catch(error){
            globalError(error, res)
        }
    },
    REGISTER_PAGE: async function(req, res){
        try{
            return res.render('register');
        }
        catch(error){
            globalError(error, res)
        }
    },
    LOGIN_PAGE: async function(req, res){
        try{
            return res.render('login');
        }
        catch(error){
            globalError(error, res)
        }
    }
}