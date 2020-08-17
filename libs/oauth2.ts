import { google } from "googleapis";
import scopes from "../config/scopes";
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import credentials from '../config/credential';

const keys = credentials.web;

/**
 * Create a new OAuth2 client with the configured keys.
 */
const oauth2Client = new google.auth.OAuth2(keys.client_id, keys.client_secret, keys.redirect_uris[0]);

/**
 * This is one of the many ways you can configure googleapis to use authentication credentials.  In this method, we're setting a global reference for all APIs.  Any other API you use here, like google.drive('v3'), will now use this auth client. You can also override the auth client at the service and method call levels.
 */
google.options({ auth: oauth2Client });

export const authClient = async (code) => {
  const res = await oauth2Client.getToken(code);
  return {
    id_token: res.tokens.id_token,
    refresh_token: res.tokens.refresh_token,
    userInfo: jwt.decode(res.tokens.id_token),
  };
};

export const getLoginUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes.join(" "),
  });
};

export const getOauth2Client = async (refresh_token) => {
  const localOauth2Client = new google.auth.OAuth2(
    keys.client_id,
    keys.client_secret,
    keys.redirect_uris[0]
  );

  localOauth2Client.setCredentials({
    refresh_token,
  });

  await localOauth2Client.getAccessToken();

  return localOauth2Client;
};

export const getAccessToken = async (refresh_token: string) => {
  const localOauth2Client = new google.auth.OAuth2(
    keys.client_id,
    keys.client_secret,
    keys.redirect_uris[0]
  );

  localOauth2Client.setCredentials({
    refresh_token,
  });

  const res = await localOauth2Client.getAccessToken();

  return res.token;
};

export const getGoogleObject = (oauth2ClientObject) => {
  const google = require('googleapis').google;
  google.options({
      auth: oauth2ClientObject,
  });
  return google;
};
