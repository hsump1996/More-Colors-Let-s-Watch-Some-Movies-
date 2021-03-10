const {v4: uuidv4} = require('uuid');

// Session ids will be keys, and values will be an object of name/value pairs
const sessionStore = {};
// manageSession and parseCookies


function parseCookies(req, res, next) {

    const cookieHeader = req.get("cookie");
    req.hwCookies = {};
    const splittedHeaders = cookieHeader.split(';');

    if (splittedHeaders !== undefined) {
        splittedHeaders.forEach(function(cookie){ 
            const nameValuePair = cookie.split('=');
            req.hwCookies[nameValuePair[0]] = nameValuePair[1];
        });
    }

    next();
}



function manageSession(req, res, next) {

    req.hwSession = {};

    if (req.hwCookies.sessionId !== undefined && sessionStore.hasOwnProperty(req.hwCookies.sessionId)){
		req.hwSession.sessionId = sessionStore["sessionId"];
        req.hwSession.sessionId = re.hwCookies.sessionId;
		console.log("session already exists: ", req.hwSession.sessionId);
	}
	else{
        sessionId = uuid.v4();
        sessionStore[sessionId] = {};
		res.append("Set-Cookie", "session_id=" + sessionId + "; HttpOnly");
        req.hwSession.sessionId = sessionId;
		console.log("session generated:", sessionId);
	}

    next();
}
module.exports = {
    parseCookies: parseCookies,
    manageSession: manageSession
};