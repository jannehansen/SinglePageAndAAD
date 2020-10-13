// *******************************************************
// START: THIS PART REMAINS THE SAME, DON'T MODIFY
// *******************************************************

// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
const myMSALObj = new msal.PublicClientApplication(msalConfig);

let accessToken;
let username = "";

// Redirect: once login is successful and redirects with tokens, call Graph API
myMSALObj.handleRedirectPromise().then(handleResponse).catch(err => {
    console.error(err);
});

function handleResponse(resp) {
    if (resp !== null) {
        username = resp.account.username;
        loginCallback(resp.account);
    } else {
        /**
         * See here for more info on account retrieval: 
         * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
         */
        const currentAccounts = myMSALObj.getAllAccounts();
        if (currentAccounts === null) {
            return;
        } else if (currentAccounts.length > 1) {
            // Add choose account code here
            console.warn("Multiple accounts detected.");
        } else if (currentAccounts.length === 1) {
            username = currentAccounts[0].username;
            loginCallback(currentAccounts[0]);
        }
    }
}

function signIn() {
    myMSALObj.loginRedirect(loginRequest);
}

function signOut() {
    const logoutRequest = {
        account: myMSALObj.getAccountByUsername(username)
    };

    myMSALObj.logout(logoutRequest);
}

function getTokenRedirect(request) {
    /**
     * See here for more info on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    request.account = myMSALObj.getAccountByUsername(username);
    return myMSALObj.acquireTokenSilent(request).catch(error => {
            console.warn("silent token acquisition fails. acquiring token using redirect");
            if (error instanceof msal.InteractionRequiredAuthError) {
                // fallback to interaction when silent call fails
                return myMSALObj.acquireTokenRedirect(request);
            } else {
                console.warn(error);   
            }
        });
}

// *******************************************************
// END: THE ABOVE PART REMAINS THE SAME, DON'T MODIFY
// *******************************************************


// *******************************************************
// GRAPH API CALL SPECIFIC CONTENT
// *******************************************************

// This is the scope definition for graph api call to read user basic data.
// If you wanted to access user mail content as well, you'd add new scope to the array.
const tokenRequest = {
    scopes: ["User.Read"],
    forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token
};


// THIS IS TO GET USER INFORMATION FROM 
function seeProfile() {
    getTokenRedirect(tokenRequest).then(response => {
        callMSGraph(response.accessToken, myInfoReceivedCallback);
    }).catch(error => {
        console.error(error);
    });
}

// Helper function to call MS Graph API endpoint 
// using authorization bearer token scheme
function callMSGraph(token, callback) {

    var endpoint = "https://graph.microsoft.com/v1.0/me";
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    console.log('request made to Graph API at: ' + new Date().toString());

    fetch(endpoint, options)
        .then(response => response.json())
        .then(response => callback(response, endpoint))
        .catch(error => console.log(error));
}

