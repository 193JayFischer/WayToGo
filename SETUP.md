# Setting up applications and the admin portal

The website is static and lives in a public GitHub repository, so it cannot keep
a secret. Applications are therefore stored in a Google Sheet inside your Google
Workspace account, behind a small Google Apps Script. The admin key lives in that
script, not in GitHub. Nothing in this repository is secret.

You only do this once. It takes about ten minutes.

## 1. Create the spreadsheet

1. Go to https://sheets.new while signed in to your Google Workspace account.
2. Name it **Way To Go Applications**. Leave it empty.

## 2. Add the script

1. In that spreadsheet, click **Extensions**, then **Apps Script**.
2. Delete everything in the editor and paste the whole contents of
   `apps-script/Code.gs` from this repository.
3. Click the save icon. Name the project **Applications gateway**.

## 3. Set the admin key

1. Make a long random key. On a Mac or Linux terminal:
   `openssl rand -base64 36`
   On Windows PowerShell:
   `-join ((48..57)+(65..90)+(97..122) | Get-Random -Count 40 | % {[char]$_})`
   Or use a password manager to generate a 40 character password.
2. In the Apps Script editor, click the gear icon (**Project Settings**).
3. Scroll to **Script Properties** and click **Add script property**.
4. Property: `ADMIN_KEY`. Value: the key you generated. Save.
5. Store the key in your password manager. This is what you type into the
   admin portal on the website. Do not put it anywhere in GitHub.

## 4. Run the check once

1. Back in the editor, pick `setupCheck` in the function dropdown and click **Run**.
2. Google will ask you to authorize the script. Click through **Review permissions**,
   choose your account, click **Advanced**, then **Go to Applications gateway (unsafe)**.
   This warning appears for every script you write yourself.
3. The log should say the sheet is ready and ADMIN_KEY is set.

## 5. Deploy it

1. Click **Deploy**, then **New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Description: `v1`. Execute as: **Me**. Who has access: **Anyone**.
   "Anyone" is required so the public form can submit. The admin list is still
   protected by the key.
4. Click **Deploy**, then copy the **Web app URL**. It ends in `/exec`.

## 6. Put the URL in the website

1. Open https://github.com/193JayFischer/WayToGo/edit/main/config.js
2. Paste the URL between the quotes after `endpoint:` and commit.
3. Within a minute the form and the admin portal are live.

## Changing the code later

Whenever `apps-script/Code.gs` changes, paste the new version into the editor,
then click **Deploy**, **Manage deployments**, the pencil icon, set Version to
**New version**, and **Deploy**. The URL stays the same.

## Leads from Facebook, Indeed, and other apps

The same web app URL accepts leads from any tool that can send a web request,
such as Zapier, Make, or a Facebook Lead Ads integration. Send a POST with a
JSON body using the field names in `FIELDS` inside `Code.gs`, and set `source`
to the app name, for example `Facebook`. Each lead lands in the same sheet,
emails you, and shows in the admin portal with its source. Rows typed straight
into the sheet show there too.

## Changing the admin key

Edit the `ADMIN_KEY` script property. No redeploy needed. Anyone still logged in
to the portal is logged out on their next refresh.
