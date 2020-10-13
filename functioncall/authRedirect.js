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
// AZURE AD FUNCTION CALL SPECIFIC CONTENT
// *******************************************************

// This is the scope used for function call
const functionCallRequest = {
    scopes: ["https://anotherv.azurewebsites.net/user_impersonation"]
};

function getMyFunctionData() {
    // scope is passed in here!
    getTokenRedirect(functionCallRequest).then(response => {
        callMyFunction(response.accessToken);
    }).catch(error => {
        console.error(error);
    });
}

function callMyFunction(accessToken) {

    // Callback code here
    console.log("Access token: "+accessToken);
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
       if (this.readyState == 4 && this.status == 200)
          myFunctionCallback(this.responseText);
    }

    xmlHttp.open("GET", "https://anotherv.azurewebsites.net/api/Apikutsu?name=world", true); // true for asynchronous
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xmlHttp.send();
}
