import { Configuration, PublicClientApplication } from "@azure/msal-browser";

// MSAL configuration
const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || "",
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

// Authentication request configuration
export const loginRequest = {
  scopes: ["User.Read", "User.ReadBasic.All"],
};

// Initialize MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Helper function to get active account
export const getActiveAccount = () => {
  const activeAccount = msalInstance.getActiveAccount();
  if (!activeAccount && msalInstance.getAllAccounts().length > 0) {
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
    return msalInstance.getAllAccounts()[0];
  }
  return activeAccount;
};
