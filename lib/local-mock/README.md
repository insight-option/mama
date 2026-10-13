# Local mock mode

Test the admin workspace and the customer site on this computer without
AWS.

```powershell
npm run dev:mock            # http://localhost:3000
npm run dev:mock -- -p 3200 # another port
```

A dashed **LOCAL MOCK** label shows on every page while it runs.

## What is simulated

| Real backend (Amplify)          | Local mock                                   |
| ------------------------------- | -------------------------------------------- |
| Cognito sign-in, `ADMIN` group  | Fake session in the browser (localStorage)   |
| AppSync + DynamoDB `Product`    | `.local-mock/products.json`                  |
| S3 `products/*` photos          | `.local-mock/uploads/`                       |
| Signed S3 link from `/api/img`  | Redirect to `/api/local-mock/files/…`        |

`.local-mock/` is gitignored. Delete it to start again from an empty catalogue.

### Test sign-ins (no real accounts or passwords)

| Email          | Password  | Result                                   |
| -------------- | --------- | ---------------------------------------- |
| any            | any       | Signed in as ADMIN                       |
| `staff@…`      | any       | Signed in, not ADMIN (blocked)           |
| `new@…`        | any       | Must set a new password first            |
| any            | `wrong`   | "Incorrect email or password"            |
| Reset code     | `123456`  | Accepted; any other code is rejected     |

## Safety

- On only when `NEXT_PUBLIC_LOCAL_MOCK=1` **and** `next dev`
  (`lib/local-mock/flag.ts`). Production builds force it off, and
  `next.config.js` replaces the mock modules with `disabled.ts`, so no mock
  code reaches the browser.
- `/api/local-mock/*` answers 404 outside mock mode.
- In mock mode the app never calls Cognito, AppSync or S3, even though
  `amplify_outputs.json` is present.

## Still needs a real AWS staging sandbox

The mock cannot prove these; test them with `npx ampx sandbox` before going live:

- Real Cognito sign-in, first-login new password, reset-code emails, and the
  pool's password policy
- `ADMIN` group membership coming from real tokens (`cognito:groups`)
- AppSync authorization: public API key can only read; only `ADMIN` can write
- S3 access rules: guests read `products/*`, only `ADMIN` writes or deletes
- Signed S3 URLs from `/api/img/<id>` (WhatsApp/social previews)
- Catalogue caching (`revalidate` 30–60 s) on Amplify Hosting, and API key expiry
