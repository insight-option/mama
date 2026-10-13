import { defineAuth } from "@aws-amplify/backend";

/**
 * Email + password sign-in. Users are created manually in the Cognito
 * console; only members of the ADMIN group may use the admin workspace or
 * change products and images.
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ["ADMIN"],
});
