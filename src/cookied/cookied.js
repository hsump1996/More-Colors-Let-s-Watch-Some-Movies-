const {v4: uuidv4} = require('uuid');

// Session ids will be keys, and values will be an object of name/value pairs
//Key: session id Value: name/value pair
const sessionStore = {};
// manageSession and parseCookies

function parseCookies(req, res, next) {

    //Used req.get to retrieve the Cookie header from the request
    let cookieHeader = req.get('cookie')

    //Created a property called hwCookies,which is initialized as an empty object
    req.hwCookies = {};
    
    //Add the names and values parsed from the Cookie as properties and values on req.hwCookies
    if (cookieHeader !== undefined) {

        //Splits the headers with ;

        let splittedHeaders = cookieHeader.split(';');
        splittedHeaders.forEach(function(cookie){ 
            const nameValuePair = cookie.split('=');
            req.hwCookies[nameValuePair[0]] = nameValuePair[1];
        });
    }
    next();
}


function manageSession(req, res, next) {


    //req should have a property called hwSession where data received from the
    //session store is placed
    req.hwSession = {};

    //Check if sessionId is in req.hwCookies and check if that session id exists within 
    //session store
    if (req.hwCookies.sessionId !== undefined && sessionStore.hasOwnProperty(req.hwCookies.sessionId)){
		
        //Sets req.hwSession to the data that's in session store for that sessionId
        req.hwSession = sessionStore[req.hwCookies.sessionId];
		console.log("session already exists: ", req.hwSession.sessionId);
	}
	else{
        sessionId = uuidv4();
        //Generated a new session id and created an empty object for that ids data 
        //from the session store
        sessionStore[sessionId] = {};
		res.append("Set-Cookie", "sessionId=" + sessionId + "; HttpOnly");
		console.log("session generated:", sessionId);
	}

    req.hwSession.sessionId = sessionId;
    next();
}
module.exports = {
    parseCookies: parseCookies,
    manageSession: manageSession
};