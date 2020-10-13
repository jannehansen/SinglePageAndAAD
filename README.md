---
page_type: sample
languages:
- javascript
- html
products:
- microsoft-authentication-library
- azure-active-directory
- ms-graph
- azure-ad-protected-function
description: "A simple JavaScript Single-Page Application using the Auth Code flow w/ PKCE"
urlFragment: "ms-identity-javascript-v2"
---

# Azure AD authentication in JavaScript Single-page Application

In English:
This repo contains sample apps for my blog article **[Call Azure AD protected Functions from Single Page App](https://jannehansen.com/call-aad-functions-from-spa/)**.

Suomeksi:
Repo sisältää esimerkkisovellukset blogiartikkeliini  **[Azure AD suojattujen funktioiden kutsuminen Single Page – sovelluksista](https://jannehansen.com/fi/aad-funktio-kutsu-spa/)**.

## Description

These examples show how to authenticate users in plain, vanilla javascript single page application.
The credentials are then used to call Azure AD protected MS GraphAPI and your own Azure AD protected function.

The examples show how to configure [MSAL.JS 2.x](https://www.npmjs.com/package/@azure/msal-browser) to login, logout, and acquire an access token for a protected resource such as Microsoft Graph API. This version of the MSAL.js library uses the Authorization Code flow w/ PKCE.

## Contents

| File/folder       | Description                                |
|-------------------|--------------------------------------------|
| `plainlogin`      | Plain login example                        |
| `graphapi`        | Login and call AAD protected MS GraphAPI   |
| `functioncall`    | Login and call AAD protected function      |
| `index.html`      | Contains the UI of the sample.             |
| `authRedirect.js` | Authentication with redirect flow implementation, for each example it's own file. |
| `authConfig.js`   | Contains configuration parameters for each sample. |
| `LICENSE`         | MIT license for the samples.               |

## Prerequisites

You need a web server (like apache, nginx or such) to place the html files to test the logins.
This is because Azure AD authentication needs to be configured with a list of http(s)
addresses where to go after login redirection.

## Setup

1. [Register a new application](https://docs.microsoft.com/azure/active-directory/develop/scenario-spa-app-registration) in the [Azure Portal](https://portal.azure.com). Ensure that the application is enabled for the [authorization code flow with PKCE](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-auth-code-flow). This will require that you redirect URI configured in the portal is of type `SPA`. You need to add uri for each of the samples like https://myserver.com/plainlogin, https://myserver.com/graphapi, https://myserver.com/functioncall.
2. Open the authConfig.js file and provide the required configuration values.

## Running the sample

1. Configure authentication and authorization parameters:
   1. Open `authConfig.js` in each application you want to test.
   2. Replace the string `"Enter_the_Application_Id_Here"` with your app/client ID on AAD Portal.
   3. Replace the string `"Enter_the_Cloud_Instance_Id_HereEnter_the_Tenant_Info_Here"` with `"https://login.microsoftonline.com/common/"` (*note*: This is for multi-tenant applications located on the global Azure cloud. For more information, see the [documentation](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v2-javascript-auth-code)).
   4. Replace the string `"Enter_the_Redirect_Uri_Here"` with the redirect uri you setup on AAD Portal.
2. Copy the files to your own web server, and make sure that paths match the registered redirect uris. 
3. Start testing!

## Key concepts

This sample demonstrates the following MSAL workflows:

* How to configure application parameters.
* How to sign-in with redirect method.
* How to sign-out.
* How to acquire an access token.
* How to make an API call with the access token.
