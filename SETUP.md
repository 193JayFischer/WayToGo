# Switching on applications and the admin hub

The website lives in a public GitHub repository and GitHub Pages only serves
files, so the site itself cannot hold a password or store applications. They
are stored in Firebase, Google's free hosted database, and the site talks to it
directly. Your admin login lives in Firebase Authentication. Nothing in this
repository is secret: the Firebase config values in `config.js` are public by
design, and access is controlled by the security rules and your login.

You only do this once. It takes about fifteen minutes.

## 1. Create the Firebase project

1. Go to https://console.firebase.google.com and sign in with your Google account.
2. Click **Create a project**. Name it `Way To Go NJ`. Turn **off** Google
   Analytics. Click Create, then Continue.

## 2. Create the database

1. In the left menu, open **Build**, then **Firestore Database**.
2. Click **Create database**. Keep the default location (or pick `nam5 (us-central)`).
3. Choose **Start in production mode**. Click Create.

## 3. Turn on email sign-in and make your admin account

1. Open **Build**, then **Authentication**, and click **Get started**.
2. Under **Sign-in method**, click **Email/Password**, switch **Enable** on, and Save.
3. Open the **Users** tab, click **Add user**, and enter the email and a long
   password you will use to sign in to the admin hub. Save the password in a
   password manager. This is the only admin password, and it never goes in GitHub.
4. Open the **Settings** tab, then **User actions**, and **uncheck "Enable
   create (sign-up)"**. Save. This stops anyone else from creating an account.
5. Still in Settings, open **Authorized domains** and add `waytogonj.com` and
   `www.waytogonj.com`.

## 4. Paste the security rules

1. Open **Firestore Database**, then the **Rules** tab.
2. Delete everything there and paste the whole contents of `firestore.rules`
   from this repository.
3. Change `YOUR-ADMIN-EMAIL@waytogonj.com` to the email you created in step 3.
4. Click **Publish**.

## 5. Connect the website

1. Click the gear icon next to **Project Overview**, then **Project settings**.
2. Scroll to **Your apps** and click the **Web** icon (it looks like `</>`).
3. Nickname: `Website`. Leave Firebase Hosting unchecked. Click **Register app**.
4. You will see a block of code containing `const firebaseConfig = { ... }`.
   Copy the values inside the braces.
5. Open https://github.com/193JayFischer/WayToGo/edit/main/config.js and paste
   each value into the matching line (apiKey, authDomain, projectId, and so on).
   Commit the change.

Within a minute the application form, the contact form, and the admin hub are live.

## 6. Test it

1. Open https://waytogonj.com/apply.html and submit a test application.
2. Open https://waytogonj.com/admin.html and sign in with the email and
   password from step 3. The test application should be in the Leads tab.
   Delete it from its Details panel when you are done.

## Changing the admin password

Firebase console, **Authentication**, **Users**, the three dots next to your
user, **Reset password**. Or sign in once and use the reset email flow.

## Adding a second admin

Add the person as a user in step 3, then add their email to the list inside
`isAdmin()` in the Firestore rules and Publish again.

## Leads from Facebook, Indeed, and other apps

Two ways:

- **By hand, in seconds.** The Leads tab has an "Add a lead" form. Pick the
  source, set a follow-up date, done.
- **Automatically.** Any connector that can send a web request (Zapier, Make,
  a Facebook Lead Ads integration) can post straight into the database using
  the Firestore REST API. Target
  `https://firestore.googleapis.com/v1/projects/YOUR-PROJECT-ID/databases/(default)/documents/applications`
  with fields `fullName`, `phone`, `email`, `city`, `notes`, `source` (for
  example `Facebook`), `type` set to `Lead`, `status` set to `New`, and
  `createdAt` as a timestamp. The rules allow creates from anywhere, so no
  secret is needed on the connector side.

## Costs

Firebase's free plan covers roughly 50,000 reads and 20,000 writes a day, far
more than a recruiting site uses. Nothing here needs a paid plan.
