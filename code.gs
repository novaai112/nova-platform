/**
 * ==========================================================================================
 * NOVA AI TECHNOLOGIES - 24/7 ANSYS ACT LICENSE ENGINE & SUPABASE SYNC
 * ==========================================================================================
 * Google Sheet: "Excel Licenses"
 * Primary Tab: "Software_License_Inventory" (Fallback: "Licenses")
 * 
 * KEY FEATURES:
 * 1. 24/7 CONTINUOUS AUTO-SYNC: Checks Supabase 'nova_orders' continuously every minute in the
 *    background via Google Cloud trigger. Zero manual refresh needed.
 * 2. PURCHASE TIME (NO MAC, NO REG ON, NO STATUS):
 *    - Only Column A (License Key) and Column B (Expiry Date) are written.
 *    - Column C (MAC Address), Column D (Registered On), and Column E (Status) are left BLANK!
 * 3. FIRST TIME RUN IN ANSYS (AUTO-ADDED):
 *    - When the user launches the ACT Wizard in Ansys Workbench for the first time,
 *      the Python script calls ?action=verify or ?action=register.
 *    - Google Script detects empty MAC and AUTOMATICALLY fills in:
 *      * Column C: Workstation MAC Address
 *      * Column D: Registration Timestamp (DD-MM-YYYY HH:mm:ss)
 *      * Column E: "active" Status
 * 4. GUARANTEED EMAIL DELIVERY:
 *    - Sends a high-converting, professional dark-mode HTML email directly to the purchaser's
 *      inbox via Google's native MailApp (100% deliverability, no external API keys required).
 *    - Column I tracks delivery status: 'SENT (DD-MM-YYYY HH:mm)' to prevent duplicate emails.
 * ==========================================================================================
 */

// ==========================================================================================
// CONFIGURATION
// ==========================================================================================
var NOVA_CONFIG = {
  // Supabase live REST credentials (Nova2 database)
  supabaseUrl: "https://opzfhsonosqqxometiou.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wemZoc29ub3NxcXhvbWV0aW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NDY2ODQsImV4cCI6MjA5MDAyMjY4NH0.djVj3tSjSYgt4H8vTTS8dBChtk6EU3fRmftqkvEiHIQ",
  
  // Sheet Tab Names (matches user's active sheet: Software_License_Inventory)
  sheetTabNames: ["Software_License_Inventory", "Licenses", "Excel Licenses"],
  
  // Support & Branding
  supportEmail: "analysis.ai.nova@gmail.com",
  platformName: "NOVA AI Technologies",
  platformUrl: "https://nova-platform.vercel.app",
  
  // Timezone
  timezone: "Asia/Kolkata"
};

// ==========================================================================================
// 1. ONE-CLICK INSTALL FOR 24/7 BACKGROUND AUTO-SYNC (RUN ONCE FROM EDITOR OR MENU)
// ==========================================================================================
function install247AutoSyncTrigger() {
  // Remove any duplicate triggers
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "syncFromSupabase") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  // Create permanent 1-minute recurring time trigger in Google Cloud
  ScriptApp.newTrigger("syncFromSupabase")
    .timeBased()
    .everyMinutes(1)
    .create();

  // Run initial sync right away
  var result = syncFromSupabase();

  var msg = "✅ 24/7 Live Auto-Sync is now ACTIVE! Checking Supabase every 1 minute.\n" +
            "New Licenses Added: " + (result.new_licenses_added || 0) + "\n" +
            "Emails Sent: " + (result.emails_sent || 0);

  try {
    SpreadsheetApp.getActiveSpreadsheet().toast("✅ 24/7 Auto-Sync Activated!", "NOVA Licensing", 6);
  } catch (e) {}

  Logger.log(msg);
  return msg;
}

// ==========================================================================================
// 2. CORE ENGINE: LIVE SYNC FROM SUPABASE & DISPATCH DELIVERY EMAILS
// ==========================================================================================
function syncFromSupabase() {
  var sheet = getLicenseSheet();
  if (!sheet) {
    Logger.log("License sheet not found.");
    return { status: "error", message: "Sheet tab not found" };
  }

  ensureSheetHeaders(sheet);

  // 1. Fetch wizard orders from Supabase REST API
  var url = NOVA_CONFIG.supabaseUrl + "/rest/v1/nova_orders?is_wizard=eq.true&order=created_at.desc&limit=100";
  var options = {
    method: "GET",
    headers: {
      "apikey": NOVA_CONFIG.supabaseAnonKey,
      "Authorization": "Bearer " + NOVA_CONFIG.supabaseAnonKey,
      "Content-Type": "application/json"
    },
    muteHttpExceptions: true
  };

  var response;
  try {
    response = UrlFetchApp.fetch(url, options);
  } catch (fetchErr) {
    Logger.log("Supabase fetch error: " + fetchErr);
    return { status: "error", message: "Supabase connection failed: " + fetchErr.toString() };
  }

  if (response.getResponseCode() >= 400) {
    return { status: "error", code: response.getResponseCode(), message: response.getContentText() };
  }

  var orders = [];
  try {
    orders = JSON.parse(response.getContentText());
  } catch (e) {
    return { status: "error", message: "JSON parse error: " + e.toString() };
  }

  if (!orders || !orders.length) {
    return { status: "success", message: "No wizard orders found in Supabase.", new_licenses_added: 0, emails_sent: 0 };
  }

  // 2. Index existing keys and email status in Google Sheet
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var existingKeys = {};
  var emailStatusMap = {};

  for (var r = 1; r < values.length; r++) {
    var rawKey = String(values[r][0] || "").trim().toUpperCase();
    if (rawKey) {
      existingKeys[rawKey] = r + 1; // 1-indexed row number
      var emailCol = values[r].length >= 9 ? String(values[r][8] || "").trim() : "";
      emailStatusMap[rawKey] = emailCol;
    }
  }

  var newLicensesAdded = 0;
  var emailsSentCount = 0;

  // 3. Process each purchase
  for (var i = 0; i < orders.length; i++) {
    var ord = orders[i];
    var licenseKey = String(ord.license_key || "").trim();
    if (!licenseKey) continue;

    var licUpper = licenseKey.toUpperCase();
    var expiryDate = String(ord.expiry_date || "").trim();
    if (!expiryDate) {
      var d = ord.created_at ? new Date(ord.created_at) : new Date();
      d.setMonth(d.getMonth() + 6);
      expiryDate = formatDate(d);
    }

    var userEmail = String(ord.user_email || "").trim();
    var userName = String(ord.user_name || "Valued Engineer").trim();
    var productName = String(ord.plan_name || ord.plan_display || "Full Nozzle Ansys ACT Wizard (.WBEX)").trim();
    var invoiceNo = String(ord.invoice_no || ord.order_id || "INV-2026-" + Math.floor(100000 + Math.random() * 900000)).trim();
    var wbexFile = String(ord.wbex_filename || "Full_Nozzle.wbex").trim();
    var term = String(ord.billing_cycle || "6 Months Commercial License").trim();

    var existingRow = existingKeys[licUpper];

    if (!existingRow) {
      /**
       * CASE A: NEW PURCHASE DETECTED IN SUPABASE
       * - Write Col A: License Key
       * - Write Col B: Expiry Date
       * - Col C: BLANK (MAC Address - added on first Ansys run)
       * - Col D: BLANK (Registered On - added on first Ansys run)
       * - Col E: BLANK (Status - added on first Ansys run)
       * - Col F: Customer Email
       * - Col G: Product Name
       * - Col H: Invoice No
       * - Col I: Email Status
       */
      var emailDeliveryStatus = "NOT_SENT";

      if (userEmail && userEmail.indexOf("@") !== -1) {
        try {
          sendBrandedLicenseEmail({
            customerEmail: userEmail,
            customerName: userName,
            licenseKey: licenseKey,
            expiryDate: expiryDate,
            productName: productName,
            invoiceNo: invoiceNo,
            term: term,
            wbexFilename: wbexFile,
            workstations: 2
          });
          emailDeliveryStatus = "SENT (" + Utilities.formatDate(new Date(), NOVA_CONFIG.timezone, "dd-MM-yyyy HH:mm") + ")";
          emailsSentCount++;
        } catch (mailErr) {
          Logger.log("Email dispatch error for " + userEmail + ": " + mailErr);
          emailDeliveryStatus = "FAILED: " + mailErr.message;
        }
      }

      sheet.appendRow([
        licenseKey,          // Col A: License Key
        expiryDate,          // Col B: Expiry Date
        "",                  // Col C: MAC Address (BLANK)
        "",                  // Col D: Registered On (BLANK)
        "",                  // Col E: Status (BLANK)
        userEmail,           // Col F: Customer Email
        productName,         // Col G: Product Name
        invoiceNo,           // Col H: Invoice No
        emailDeliveryStatus  // Col I: Email Delivery Status
      ]);

      existingKeys[licUpper] = sheet.getLastRow();
      emailStatusMap[licUpper] = emailDeliveryStatus;
      newLicensesAdded++;

    } else {
      /**
       * CASE B: LICENSE EXISTS IN SHEET BUT EMAIL WAS MISSED OR INTERRUPTED
       */
      var currentDelivery = emailStatusMap[licUpper] || "";
      if (userEmail && userEmail.indexOf("@") !== -1 && (!currentDelivery || currentDelivery === "NOT_SENT" || currentDelivery.indexOf("FAILED") !== -1)) {
        try {
          sendBrandedLicenseEmail({
            customerEmail: userEmail,
            customerName: userName,
            licenseKey: licenseKey,
            expiryDate: expiryDate,
            productName: productName,
            invoiceNo: invoiceNo,
            term: term,
            wbexFilename: wbexFile,
            workstations: 2
          });
          var mark = "SENT (" + Utilities.formatDate(new Date(), NOVA_CONFIG.timezone, "dd-MM-yyyy HH:mm") + ")";
          sheet.getRange(existingRow, 9).setValue(mark);
          emailStatusMap[licUpper] = mark;
          emailsSentCount++;
        } catch (e2) {
          Logger.log("Retry email error: " + e2);
        }
      }
    }
  }

  return {
    status: "success",
    message: "Supabase live sync completed.",
    total_supabase_orders: orders.length,
    new_licenses_added: newLicensesAdded,
    emails_sent: emailsSentCount
  };
}

// ==========================================================================================
// 3. FIRST-TIME RUN IN ANSYS -> AUTO-ADDS MAC ADDRESS, REGISTERED ON, STATUS
// ==========================================================================================
function verifyLicense(sheet, licenseKey, macAddress) {
  var data = sheet.getDataRange().getValues();
  var startRow = sheet.getDataRange().getRow();

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var storedKey = String(row[0] || "").trim();

    if (storedKey.toLowerCase() === licenseKey.toLowerCase()) {
      var storedExpiry = formatDate(row[1]);
      var storedMac = String(row[2] || "").trim();
      var storedStatus = String(row[4] || "").trim().toLowerCase();

      if (storedStatus === "revoked") {
        return jsonResponse({
          status: "revoked",
          message: "License has been revoked."
        });
      }

      var actualRow = startRow + i;

      /**
       * FIRST TIME RUN IN ANSYS WORKBENCH:
       * If MAC Address is empty (""), this is the user's first launch!
       * Auto-add MAC Address, current date/time, and status "active"
       */
      if (storedMac === "" && macAddress) {
        var nowStr = Utilities.formatDate(new Date(), NOVA_CONFIG.timezone, "dd-MM-yyyy HH:mm:ss");
        sheet.getRange(actualRow, 3).setValue(macAddress); // Col C: MAC Address
        sheet.getRange(actualRow, 4).setValue(nowStr);     // Col D: Registered On
        sheet.getRange(actualRow, 5).setValue("active");    // Col E: Status

        return jsonResponse({
          status: "success",
          expiry_date: storedExpiry,
          message: "First-time launch verified. Workstation MAC bound and status activated.",
          registered_mac: macAddress,
          registered_on: nowStr,
          license_status: "active"
        });
      }

      // If already bound to another MAC
      if (storedMac !== "" && macAddress && storedMac.toLowerCase() !== macAddress.toLowerCase()) {
        return jsonResponse({
          status: "mac_mismatch",
          message: "License already activated on another MAC workstation (" + storedMac + ")."
        });
      }

      return jsonResponse({
        status: "success",
        expiry_date: storedExpiry,
        message: "License valid."
      });
    }
  }

  return jsonResponse({
    status: "invalid",
    message: "License key not found."
  });
}

function registerLicense(sheet, licenseKey, macAddress, registeredOn) {
  var range = sheet.getDataRange();
  var data = range.getValues();
  var startRow = range.getRow();

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var storedKey = String(row[0] || "").trim();

    if (storedKey.toLowerCase() === licenseKey.toLowerCase()) {
      var storedExpiry = formatDate(row[1]);
      var storedMac = String(row[2] || "").trim();
      var storedStatus = String(row[4] || "").trim().toLowerCase();

      if (storedStatus === "revoked") {
        return jsonResponse({ status: "revoked", message: "License has been revoked." });
      }

      if (storedMac !== "" && macAddress && storedMac.toLowerCase() !== macAddress.toLowerCase()) {
        return jsonResponse({ status: "mac_mismatch", message: "License already bound to another MAC workstation." });
      }

      var actualRow = startRow + i;
      var nowStr = registeredOn || Utilities.formatDate(new Date(), NOVA_CONFIG.timezone, "dd-MM-yyyy HH:mm:ss");

      // Auto-add MAC, Registered On, and Status
      sheet.getRange(actualRow, 3).setValue(macAddress); // Col C
      sheet.getRange(actualRow, 4).setValue(nowStr);     // Col D
      sheet.getRange(actualRow, 5).setValue("active");    // Col E

      return jsonResponse({
        status: "success",
        expiry_date: storedExpiry,
        message: "Workstation registered and license activated successfully."
      });
    }
  }

  return jsonResponse({ status: "invalid", message: "License key not found in system." });
}

// ==========================================================================================
// 4. WORLD-CLASS HTML EMAIL DISPATCH (Native MailApp - 100% Reliable Delivery)
// ==========================================================================================
function sendBrandedLicenseEmail(data) {
  var email = data.customerEmail;
  var name = data.customerName || "Valued Engineer";
  var licKey = data.licenseKey;
  var expiry = data.expiryDate;
  var prodName = data.productName || "Full Nozzle Ansys ACT Wizard (.WBEX)";
  var invNo = data.invoiceNo || ("INV-2026-" + Math.floor(100000 + Math.random() * 900000));
  var term = data.term || "6 Months Commercial License";
  var wbexFile = data.wbexFilename || "Full_Nozzle.wbex";
  var workstations = data.workstations || 2;
  var platformUrl = NOVA_CONFIG.platformUrl;

  var subject = "🔐 Your Ansys ACT Wizard Commercial License & Download — " + prodName + " (" + licKey + ")";

  var htmlBody = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '<title>' + subject + '</title>',
    '</head>',
    '<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; -webkit-font-smoothing: antialiased;">',
    '  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 30px 10px;">',
    '    <tr>',
    '      <td align="center">',
    '        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #111827; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">',
    '          ',
    '          <!-- HEADER -->',
    '          <tr>',
    '            <td style="padding: 36px 36px 28px 36px; background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border-bottom: 1px solid #334155; text-align: center;">',
    '              <div style="display: inline-block; background-color: rgba(99, 102, 241, 0.15); border: 1px solid rgba(129, 140, 248, 0.3); border-radius: 12px; padding: 8px 16px; margin-bottom: 14px;">',
    '                <span style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #a5b4fc; text-transform: uppercase;">NOVA AI TECHNOLOGIES</span>',
    '              </div>',
    '              <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Commercial ACT Extension License</h1>',
    '              <p style="margin: 0; font-size: 13px; color: #94a3b8;">Autonomous Pressure Vessel FEA Platform & Ansys ACT Extensions</p>',
    '            </td>',
    '          </tr>',
    '',
    '          <!-- BODY -->',
    '          <tr>',
    '            <td style="padding: 32px 36px;">',
    '              <p style="margin: 0 0 16px 0; font-size: 15px; color: #cbd5e1; line-height: 1.6;">Dear <strong style="color: #ffffff;">' + name + '</strong>,</p>',
    '              <p style="margin: 0 0 24px 0; font-size: 14px; color: #94a3b8; line-height: 1.6;">Thank you for your purchase of <strong style="color: #e2e8f0;">' + prodName + '</strong>. Your commercial license key has been generated. When you open Ansys Workbench on your workstation for the first time, your workstation MAC will automatically bind to the license.</p>',
    '',
    '              <!-- LICENSE KEY CARD -->',
    '              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); border: 2px solid #6366f1; border-radius: 16px; padding: 24px; margin-bottom: 28px; box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.2);">',
    '                <tr>',
    '                  <td>',
    '                    <div style="font-size: 11px; font-weight: 800; color: #818cf8; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px;">AUTHORIZED LICENSE KEY</div>',
    '                    <div style="background-color: #020617; border: 1px dashed #475569; border-radius: 10px; padding: 14px 18px; margin-bottom: 16px; text-align: center;">',
    '                      <span style="font-family: \'Courier New\', Courier, monospace; font-size: 26px; font-weight: 800; color: #38bdf8; letter-spacing: 3px;">' + licKey + '</span>',
    '                    </div>',
    '                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; color: #cbd5e1;">',
    '                      <tr>',
    '                        <td style="padding: 4px 0;"><strong>Expiry Date:</strong></td>',
    '                        <td align="right" style="padding: 4px 0; font-family: monospace; font-weight: 700; color: #34d399;">' + expiry + '</td>',
    '                      </tr>',
    '                      <tr>',
    '                        <td style="padding: 4px 0;"><strong>Term Validity:</strong></td>',
    '                        <td align="right" style="padding: 4px 0; font-weight: 600; color: #ffffff;">' + term + '</td>',
    '                      </tr>',
    '                      <tr>',
    '                        <td style="padding: 4px 0;"><strong>Authorized Nodes:</strong></td>',
    '                        <td align="right" style="padding: 4px 0; font-weight: 600; color: #ffffff;">' + workstations + ' Workstation(s) (Node-Locked MAC)</td>',
    '                      </tr>',
    '                      <tr>',
    '                        <td style="padding: 4px 0;"><strong>Tax Invoice No:</strong></td>',
    '                        <td align="right" style="padding: 4px 0; font-family: monospace; color: #94a3b8;">' + invNo + '</td>',
    '                      </tr>',
    '                      <tr>',
    '                        <td style="padding: 4px 0;"><strong>Activation Mode:</strong></td>',
    '                        <td align="right" style="padding: 4px 0; font-weight: 800; color: #38bdf8;">⚡ Auto-Binds on First Launch</td>',
    '                      </tr>',
    '                    </table>',
    '                  </td>',
    '                </tr>',
    '              </table>',
    '',
    '              <!-- INSTALLATION GUIDE -->',
    '              <h3 style="margin: 0 0 14px 0; font-size: 16px; font-weight: 700; color: #ffffff;">',
    '                📘 4-Step Ansys Workbench Installation Guide',
    '              </h3>',
    '              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; margin-bottom: 28px; font-size: 13px; color: #94a3b8;">',
    '                <tr>',
    '                  <td style="padding: 14px 18px; border-bottom: 1px solid #1e293b;">',
    '                    <span style="display: inline-block; width: 22px; height: 22px; line-height: 22px; text-align: center; border-radius: 50%; background-color: #6366f1; color: #ffffff; font-weight: bold; margin-right: 10px; font-size: 11px;">1</span>',
    '                    <strong style="color: #e2e8f0;">Download Extension:</strong> Save <code style="color: #38bdf8; background: #1e293b; padding: 2px 6px; border-radius: 4px;">' + wbexFile + '</code> to your workstation.',
    '                  </td>',
    '                </tr>',
    '                <tr>',
    '                  <td style="padding: 14px 18px; border-bottom: 1px solid #1e293b;">',
    '                    <span style="display: inline-block; width: 22px; height: 22px; line-height: 22px; text-align: center; border-radius: 50%; background-color: #6366f1; color: #ffffff; font-weight: bold; margin-right: 10px; font-size: 11px;">2</span>',
    '                    <strong style="color: #e2e8f0;">Open Workbench:</strong> Launch Ansys Workbench, click <strong style="color: #cbd5e1;">Extensions</strong> &rarr; <strong style="color: #cbd5e1;">Install Extension...</strong>, and select the file.',
    '                  </td>',
    '                </tr>',
    '                <tr>',
    '                  <td style="padding: 14px 18px; border-bottom: 1px solid #1e293b;">',
    '                    <span style="display: inline-block; width: 22px; height: 22px; line-height: 22px; text-align: center; border-radius: 50%; background-color: #6366f1; color: #ffffff; font-weight: bold; margin-right: 10px; font-size: 11px;">3</span>',
    '                    <strong style="color: #e2e8f0;">Load Extension:</strong> Go to <strong style="color: #cbd5e1;">Extensions</strong> &rarr; <strong style="color: #cbd5e1;">Manage Extensions...</strong>, check the box next to <em>' + prodName.split(' (')[0] + '</em>.',
    '                  </td>',
    '                </tr>',
    '                <tr>',
    '                  <td style="padding: 14px 18px;">',
    '                    <span style="display: inline-block; width: 22px; height: 22px; line-height: 22px; text-align: center; border-radius: 50%; background-color: #6366f1; color: #ffffff; font-weight: bold; margin-right: 10px; font-size: 11px;">4</span>',
    '                    <strong style="color: #e2e8f0;">First-Time License Entry:</strong> When prompted on first launch, enter License Key <strong style="color: #38bdf8;">' + licKey + '</strong>. Your workstation MAC will automatically bind.',
    '                  </td>',
    '                </tr>',
    '              </table>',
    '',
    '              <!-- ACTION BUTTON -->',
    '              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px; text-align: center;">',
    '                <tr>',
    '                  <td>',
    '                    <a href="' + platformUrl + '" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);">',
    '                      🚀 Access NOVA Platform & Documentation',
    '                    </a>',
    '                  </td>',
    '                </tr>',
    '              </table>',
    '',
    '              <!-- SUPPORT DESK -->',
    '              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #1e293b; padding-top: 20px; font-size: 13px; color: #94a3b8;">',
    '                <tr>',
    '                  <td>',
    '                    <p style="margin: 0 0 6px 0;"><strong>Need Assistance?</strong></p>',
    '                    <p style="margin: 0; line-height: 1.5;">Our engineering team is on standby to assist with ACT installation or workstation transfers. Reply directly to this email or contact <a href="mailto:' + NOVA_CONFIG.supportEmail + '" style="color: #818cf8; text-decoration: none;">' + NOVA_CONFIG.supportEmail + '</a>.</p>',
    '                  </td>',
    '                </tr>',
    '              </table>',
    '            </td>',
    '          </tr>',
    '',
    '          <!-- FOOTER -->',
    '          <tr>',
    '            <td style="padding: 24px 36px; background-color: #0a0f1d; border-top: 1px solid #1e293b; text-align: center; font-size: 11px; color: #64748b; line-height: 1.6;">',
    '              <p style="margin: 0 0 6px 0;">NOVA AI TECHNOLOGIES PVT. LTD. &bull; Autonomous Pressure Vessel & FEA Automation</p>',
    '              <p style="margin: 0;">This email was sent to ' + email + ' regarding Order #' + invNo + '. Authorized for licensed workstation deployment only.</p>',
    '            </td>',
    '          </tr>',
    '        </table>',
    '      </td>',
    '    </tr>',
    '  </table>',
    '</body>',
    '</html>'
  ].join('\n');

  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    name: "NOVA AI Licensing & Distribution",
    replyTo: NOVA_CONFIG.supportEmail
  });
}

// ==========================================================================================
// 5. HTTP HANDLERS: doGet & doPost (Web App API Endpoints)
// ==========================================================================================
function doGet(e) {
  return handleHttpRequest(e, false);
}

function doPost(e) {
  return handleHttpRequest(e, true);
}

function handleHttpRequest(e, isPost) {
  try {
    var params = {};
    if (e && e.parameter) {
      for (var k in e.parameter) {
        params[k] = e.parameter[k];
      }
    }
    if (e && e.postData && e.postData.contents) {
      try {
        var parsed = JSON.parse(e.postData.contents);
        for (var pk in parsed) {
          params[pk] = parsed[pk];
        }
      } catch (parseErr) {}
    }

    var action = String(params.action || "").trim().toLowerCase();
    var sheet = getLicenseSheet();

    if (!sheet) {
      return jsonResponse({ status: "error", message: "Sheet tab not found." });
    }

    ensureSheetHeaders(sheet);

    // 1. ACTION: VERIFY (Ansys ACT Workbench Python script)
    if (action === "verify") {
      var licKey = String(params.license_key || params.licenseKey || params.key || "").trim();
      var mac = String(params.mac_address || params.macAddress || params.mac || "").trim();
      if (!licKey) {
        return jsonResponse({ status: "error", message: "Missing license_key parameter." });
      }
      return verifyLicense(sheet, licKey, mac);
    }

    // 2. ACTION: REGISTER (Ansys ACT Workbench Python script)
    if (action === "register") {
      var licKey = String(params.license_key || params.licenseKey || params.key || "").trim();
      var mac = String(params.mac_address || params.macAddress || params.mac || "").trim();
      var regOn = String(params.registered_on || params.registeredOn || "").trim();
      if (!licKey || !mac) {
        return jsonResponse({ status: "error", message: "Missing license_key or mac_address parameter." });
      }
      return registerLicense(sheet, licKey, mac, regOn);
    }

    // 3. ACTION: SYNC SUPABASE
    if (action === "sync" || action === "sync_supabase") {
      var syncResult = syncFromSupabase();
      return jsonResponse(syncResult);
    }

    // 4. ACTION: ADD / INSERT LICENSE (Direct instant push from Web App upon checkout)
    if (action === "add_license" || action === "add" || action === "create" || (isPost && params.license_key)) {
      var syncRes = syncFromSupabase();
      return jsonResponse(syncRes);
    }

    // Default: Run live sync from Supabase automatically and return status
    var liveSync = syncFromSupabase();
    return jsonResponse({
      status: "online",
      service: "NOVA AI 24/7 Autonomous Licensing Engine",
      active_sheet: sheet.getName(),
      total_licenses: Math.max(0, sheet.getLastRow() - 1),
      sync_result: liveSync,
      timestamp: Utilities.formatDate(new Date(), NOVA_CONFIG.timezone, "dd-MM-yyyy HH:mm:ss")
    });

  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

// ==========================================================================================
// 6. SPREADSHEET CUSTOM MENU & TEST ACTIONS
// ==========================================================================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🚀 NOVA Licensing")
    .addItem("⚡ Start 24/7 Live Auto Sync (Click Once to Enable)", "install247AutoSyncTrigger")
    .addItem("🔄 Run Live Sync Right Now", "menuSyncNow")
    .addSeparator()
    .addItem("📧 Test Send License Email to Myself", "menuTestDeliveryEmail")
    .addItem("📊 Check Auto-Sync Status", "menuCheckStatus")
    .addToUi();
}

function menuSyncNow() {
  var ui = SpreadsheetApp.getUi();
  var result = syncFromSupabase();
  ui.alert(
    "Supabase Live Sync Complete",
    "Total Orders in Supabase: " + (result.total_supabase_orders || 0) + "\n" +
    "New Licenses Added to Sheet: " + (result.new_licenses_added || 0) + "\n" +
    "Delivery Emails Dispatched: " + (result.emails_sent || 0),
    ui.ButtonSet.OK
  );
}

function menuCheckStatus() {
  var ui = SpreadsheetApp.getUi();
  var triggers = ScriptApp.getProjectTriggers();
  var isInstalled = false;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "syncFromSupabase") {
      isInstalled = true;
      break;
    }
  }

  var msg = isInstalled ? 
    "✅ 24/7 Live Auto-Sync is ACTIVE and running automatically every 1 minute." : 
    "⚠️ 24/7 Auto-Sync trigger is NOT active yet.\nClick 'Start 24/7 Live Auto Sync' from the menu to activate it.";

  ui.alert("Auto-Sync Trigger Status", msg, ui.ButtonSet.OK);
}

function menuTestDeliveryEmail() {
  var ui = SpreadsheetApp.getUi();
  var userEmail = Session.getActiveUser().getEmail() || NOVA_CONFIG.supportEmail;
  try {
    sendBrandedLicenseEmail({
      customerEmail: userEmail,
      customerName: "Dinesh Kumar",
      licenseKey: "NOVA-TEST-2026",
      expiryDate: "04-10-2027",
      productName: "Full Nozzle Ansys ACT Wizard (.WBEX)",
      invoiceNo: "INV-2026-TEST",
      term: "6 Months Commercial License",
      wbexFilename: "Full_Nozzle.wbex",
      workstations: 2
    });
    ui.alert("Test Email Sent", "A commercial license delivery email was sent to: " + userEmail, ui.ButtonSet.OK);
  } catch (err) {
    ui.alert("Email Error", err.toString(), ui.ButtonSet.OK);
  }
}

// ==========================================================================================
// 7. UTILITY HELPERS
// ==========================================================================================
function getLicenseSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  for (var i = 0; i < NOVA_CONFIG.sheetTabNames.length; i++) {
    var s = ss.getSheetByName(NOVA_CONFIG.sheetTabNames[i]);
    if (s) return s;
  }
  return ss.getSheets()[0];
}

function ensureSheetHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "License Key",
      "Expiry Date",
      "MAC Address",
      "Registered On",
      "Status",
      "Customer Email",
      "Product Name",
      "Invoice No",
      "Email Delivery"
    ]);
  } else {
    var headers = sheet.getRange(1, 1, 1, Math.max(9, sheet.getLastColumn())).getValues()[0];
    if (!headers[0]) sheet.getRange(1, 1).setValue("License Key");
    if (!headers[1]) sheet.getRange(1, 2).setValue("Expiry Date");
    if (!headers[2]) sheet.getRange(1, 3).setValue("MAC Address");
    if (!headers[3]) sheet.getRange(1, 4).setValue("Registered On");
    if (!headers[4]) sheet.getRange(1, 5).setValue("Status");
    if (!headers[5]) sheet.getRange(1, 6).setValue("Customer Email");
    if (!headers[6]) sheet.getRange(1, 7).setValue("Product Name");
    if (!headers[7]) sheet.getRange(1, 8).setValue("Invoice No");
    if (!headers[8]) sheet.getRange(1, 9).setValue("Email Delivery");
  }
}

function formatDate(rawDate) {
  if (rawDate instanceof Date) {
    var dd = String(rawDate.getDate()).padStart(2, '0');
    var mm = String(rawDate.getMonth() + 1).padStart(2, '0');
    var yyyy = rawDate.getFullYear();
    return dd + "-" + mm + "-" + yyyy;
  }
  return String(rawDate || "").trim();
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}