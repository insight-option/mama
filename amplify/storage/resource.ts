import { defineStorage } from "@aws-amplify/backend";

/**
 * Product photos uploaded from the admin workspace. Everyone (including
 * visitors who are not signed in) can read them; only the ADMIN group can
 * upload, replace or delete.
 */
export const storage = defineStorage({
  name: "mamaFoodMedia",
  access: (allow) => ({
    "products/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read"]),
      allow.groups(["ADMIN"]).to(["read", "write", "delete"]),
    ],
  }),
});
