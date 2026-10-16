/**
 * Way To Go NJ - applications gateway
 *
 * Runs inside your Google account as a Google Apps Script web app.
 * - POST: a new application or lead. Appended to the "Applications" sheet
 *         and emailed to you.
 * - GET ?action=list&key=...: returns every row as JSON for the admin portal.
 *         Only works when "key" matches the ADMIN_KEY script property.
 *
 * The admin key is stored in Project Settings > Script Properties, never in
 * GitHub. See SETUP.md in the website repository.
 */

var SHEET_NAME = 'Applications';

// Field name sent by the form  ->  column header in the sheet
var FIELDS = [
  ['source',            'Source'],
  ['fullName',          'Full name'],
  ['phone',             'Phone'],
  ['email',             'Email'],
  ['city',              'City'],
  ['zip',               'ZIP'],
  ['over21',            'At least 21'],
  ['hasCdl',            'Holds CDL'],
  ['cdlClass',          'CDL class'],
  ['cdlState',          'License state'],
  ['endorsements',      'Endorsements'],
  ['cleanRecord',       'Clean driving record'],
  ['experienceYears',   'School bus experience'],
  ['lastEmployer',      'Most recent employer'],
  ['otherExperience',   'Other passenger experience'],
  ['positionType',      'Position wanted'],
  ['shifts',            'Shifts'],
  ['startDate',         'Earliest start'],
  ['reliableTransport', 'Reliable transportation'],
  ['canPass',           'Able to pass'],
  ['hearAbout',         'Heard about us'],
  ['referral',          'Referred by'],
  ['notes',             'Notes'],
  ['consent',           'Consent'],
  ['submittedFrom',     'Submitted from']
];

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data.website) return json_({ ok: true });                 // honeypot: silently ignore bots
    if (!data.fullName || !data.phone) return json_({ ok: false, error: 'Full name and phone are required' });

    var sheet = getSheet_();
    var row = [new Date()].concat(FIELDS.map(function (f) { return clean_(data[f[0]]); }));
    sheet.appendRow(row);
    notify_(data);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  var key = (e && e.parameter && e.parameter.key) || '';
  var expected = PropertiesService.getScriptProperties().getProperty('ADMIN_KEY') || '';
  if (!expected || expected.length < 16 || !safeEqual_(key, expected)) {
    Utilities.sleep(800);                                          // slow down guessing
    return json_({ ok: false, error: 'Unauthorized' });
  }
  var sheet = getSheet_();
  var values = sheet.getDataRange().getValues();
  var headers = values.shift();
  var rows = values.map(function (r) {
    var o = {};
    headers.forEach(function (h, i) {
      var v = r[i];
      o[h] = (v instanceof Date) ? v.toISOString() : v;
    });
    return o;
  }).reverse();                                                    // newest first
  return json_({ ok: true, rows: rows });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Received'].concat(FIELDS.map(function (f) { return f[1]; })));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, FIELDS.length + 1).setFontWeight('bold');
  }
  return sheet;
}

function clean_(v) {
  if (v == null) return '';
  if (Array.isArray(v)) return v.join(', ');
  return String(v).slice(0, 5000);
}

function safeEqual_(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function notify_(data) {
  try {
    var to = Session.getEffectiveUser().getEmail();
    var lines = FIELDS.map(function (f) { return f[1] + ': ' + clean_(data[f[0]]); });
    MailApp.sendEmail({
      to: to,
      subject: 'New driver application: ' + clean_(data.fullName),
      body: 'A new application arrived.\n\n' + lines.join('\n') + '\n\nOpen the admin portal on the website to see everything.'
    });
  } catch (err) {
    // Email is best-effort. The row is already saved.
  }
}

/** Run this once from the editor to confirm the sheet and headers are created. */
function setupCheck() {
  var sheet = getSheet_();
  var key = PropertiesService.getScriptProperties().getProperty('ADMIN_KEY') || '';
  Logger.log('Sheet "%s" ready with %s columns. ADMIN_KEY is %s.', sheet.getName(), sheet.getLastColumn(), key ? 'set (' + key.length + ' characters)' : 'NOT SET');
}
