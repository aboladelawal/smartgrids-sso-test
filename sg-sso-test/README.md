# Smart Grids SSO test (task 1.1)

A throwaway test site. It proves that a teacher logged into our portal can open a
Pickaxe grid without logging in again. It is not the real portal: the login is a
fake list of test teachers, and there is no database.

## What it does

1. `/` shows a fake login. Pick a test teacher and click Log in.
2. `/grid` shows one Pickaxe grid. Behind the scenes the page asks our server for
   a signed token ("this is the teacher, we checked them") and hands it to Pickaxe.
3. A Test log under the grid records each step, plus the browser details.
   Screenshot it for the write-up.

## Setup

### 1. Make the keys (once)

On your Mac, in Terminal, in a folder outside the repo:

```bash
openssl genpkey -algorithm EC -pkeyopt ec_paramgen_curve:P-256 -out private.pem
openssl pkey -in private.pem -pubout -out public.pem
```

- `public.pem` goes into Pickaxe.
- `private.pem` goes into Vercel. Never commit it or share it in chat.

### 2. Deploy to Vercel

1. Push this folder to its own GitHub repo (for example `smartgrids-sso-test`).
2. In Vercel: Add New > Project > import the repo > Deploy.
3. Note the production address, for example `https://smartgrids-sso-test.vercel.app`.
   Use this address everywhere below, not the preview links, because those change on every deploy.

### 3. Environment variables in Vercel

Project > Settings > Environment Variables. See `.env.example` for the full list.

| Name | Value |
|---|---|
| PICKAXE_WORKSPACE_ID | from Pickaxe (ask Laura) |
| PICKAXE_DEPLOYMENT_ID | the deployment ID of the grid to test |
| PICKAXE_ISSUER | the production address from step 2 |
| PICKAXE_KEY_ID | `smartgrids-test-key-1` |
| PICKAXE_PRIVATE_KEY | the whole contents of `private.pem` |
| SESSION_SECRET | any long random string |
| TEST_TEACHERS | e.g. `you+sgtest1@gmail.com,you+sgtest2@gmail.com` |
| EXISTING_TEACHER_EMAIL | the existing Pickaxe user Laura names |

Then redeploy (Deployments > the latest one > Redeploy) so the values take effect.

### 4. Pickaxe settings

In Pickaxe, Workspace Settings > Embed SSO:

- Turn on customer-authenticated embeds.
- Trusted issuer: the production address, exactly as in PICKAXE_ISSUER (watch for a trailing slash).
- Signing key ID: `smartgrids-test-key-1`
- Public key: paste the contents of `public.pem`.
- Allowed host origins: the production address.

Also add the address to the grid's normal embed domain allowlist (on the grid's Deploy or embed settings).
Pickaxe needs both.

### 5. Check the embed code matches

Open the grid's embed code in Pickaxe and compare it with `app/grid/PickaxeEmbed.js`.
This app uses a `<div id="deployment-ID">` and the script
`https://studio.pickaxe.co/api/embed/bundle.js`, as in Pickaxe's docs. If the
embed code Pickaxe gives you differs, follow Pickaxe's version.

## Running the checks

| Check | How |
|---|---|
| No second login | Log in as a new test teacher, open the grid. It should open with no Pickaxe login screen. |
| School devices | Repeat on Safari (Mac), iPad, Chromebook, and Chrome with third-party cookies blocked (Settings > Privacy > Third-party cookies). Refresh: still logged in? Chat history kept? |
| New user appears | After the first test teacher, check Pickaxe's Users page for that email. |
| Existing user matched | Log in as EXISTING_TEACHER_EMAIL. Check the Users page: matched to the old account, or a duplicate? |
| Usage recorded | Chat with the grid, then check Pickaxe for usage against that teacher. |

## If it doesn't work

The Test log shows where it stopped:

- "Token request failed: 500": an environment variable is missing in Vercel.
- "Token sent to Pickaxe" but a login screen still appears: Pickaxe rejected it.
  Check that the issuer, key ID, public key and allowed origins match exactly.
- "Pickaxe asked for a token" never appears: the embed code or deployment ID is wrong.

If a check fails for a reason that isn't a typo in the settings, tell Laura before trying anything else.
