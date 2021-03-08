const {v4: uuidv4} = require('uuid');

// Session ids will be keys, and values will be an object of name/value pairs
const sessionStore = {};
// manageSession and parseCookies


function parseCookies(req, res, next) {

    const cookieHeader = req.get('Set-Cookie');
    req.hwCookies = {};

    const splittedHeader = cookieHeader.split(';');

    splittedHeader.map(headers => {
        let nameValuePair = headers.split('=');
        req.hwCookies[nameValuePair[0]] = nameValuePair[1];

    })

    next();
}



function manageSession(req, res, next) {

    req.hwSession = {};
    req.hwSession.sessionId = sessionStore["sessionId"];

    if (req.hwCookies)






    next();
}
module.exports = {
    parseCookies: parseCookies,
    manageSession: manageSession
};