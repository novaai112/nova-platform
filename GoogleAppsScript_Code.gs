/**
 * =========================================================================
 * NOVA AI - COMPLETE ALL-IN-ONE LICENSE MANAGEMENT & SYNC GOOGLE SCRIPT
 * =========================================================================
 * Compatible with your "Excel Licenses" Google Sheet ("Licenses" Tab)
 * Sheet ID: 147DCoroe82SvH3lTIWLTlq-a1Zly2I5ntnX3QqN1qDc
 * 
 * Supports:
 * 1. Ansys ACT Wizard License Verification:   ?action=verify&license_key=NOVA-XXXX
 * 2. Ansys ACT Wizard Machine Registration:    ?action=register&license_key=NOVA-XXXX&mac=...
 * 3. Nova AI Automated License Key Auto-Add:  ?action=add&license_key=NOVA-XXXX&expiry_date=DD-MM-YYYY (or via POST)
 * =========================================================================
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Open your Google Sheet:
 *    https://docs.google.com/spreadsheets/d/147DCoroe82SvH3lTIWLTlq-a1Zly2I5ntnX3QqN1qDc/edit
 * 2. Click "Extensions" > "Apps Script".
 * 3. Paste this entire code into your Apps Script editor, replacing any existing code.
 * 4. Click "Save" (Disk icon or Ctrl+S).
 * 5. Click "Deploy" > "Manage deployments".
 * 6. Click the pencil (Edit) icon on your Active deployment.
 * 7. In the "Version" dropdown, select "New version" (IMPORTANT: do not leave on old version).
 * 8. Click "Deploy".
 * =========================================================================
 */

function handleRequest(e, isPost) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Licenses") || 
                ss.getSheetByName("Software_License_Inventory") || 
                ss.getSheetByName("Excel Licenses") || 
                ss.getSheets()[0];

    var params = {};
    if (e && e.parameter) {
      for (var key in e.parameter) {
        params[key] = e.parameter[key];
      }
    }
    if (e && e.postData && e.postData.contents) {
      try {
        var parsed = JSON.parse(e.postData.contents);
        for (var pkey in parsed) {
          params[pkey] = parsed[pkey];
        }
      } catch (err) {}
    }

    var action = (params.action || (isPost ? "add" : "verify")).toLowerCase();
    var licenseKey = params.license_key || params.licenseKey || params.key || "";
    var mac = params.mac || params.macAddress || params.mac_address || "";
    var expiryDate = params.expiry_date || params.expiryDate || params.expiry || "";
    var registeredOn = params.registered_on || params.registeredOn || "";
    var status = params.status || "active";

    // 1. ACTION: ADD / CREATE / GENERATE (Nova AI Platform Purchase)
    if (action === "add" || action === "create" || action === "add_license" || action === "new" || isPost) {
      if (!licenseKey) {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var code = "";
        for (var i = 0; i < 4; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        licenseKey = "NOVA-" + code;
      }

      if (!registeredOn) {
        registeredOn = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd-MM-yyyy HH:mm:ss");
      }

      // Append row to match exact columns:
      // [License Key, Expiry Date, MAC Address, Registered On, Status]
      sheet.appendRow([licenseKey, expiryDate, mac, registeredOn, status]);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "License generated and added to sheet successfully",
        license_key: licenseKey,
        licenseKey: licenseKey,
        expiry_date: expiryDate,
        expiryDate: expiryDate,
        mac_address: mac,
        registered_on: registeredOn,
        sheet: sheet.getName()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. ACTION: VERIFY (Ansys ACT Wizard Check)
    if (action === "verify") {
      if (!licenseKey) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "error",
          message: "Missing license key parameter."
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var data = sheet.getDataRange().getValues();
      for (var r = 1; r < data.length; r++) {
        var rowKey = String(data[r][0] || "").trim();
        if (rowKey.toLowerCase() === licenseKey.toLowerCase()) {
          var rowExpiry = data[r][1];
          var rowMac = String(data[r][2] || "").trim();
          var rowStatus = String(data[r][4] || "").trim();

          if (mac && rowMac && rowMac.toLowerCase() !== mac.toLowerCase()) {
            return ContentService.createTextOutput(JSON.stringify({
              status: "mac_mismatch",
              message: "License already activated on another MAC."
            })).setMimeType(ContentService.MimeType.JSON);
          }

          return ContentService.createTextOutput(JSON.stringify({
            status: "success",
            expiry_date: rowExpiry,
            mac: rowMac,
            license_status: rowStatus,
            message: "License valid."
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "invalid",
        message: "License key not found."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. ACTION: REGISTER (Ansys ACT Wizard First-Time Activation)
    if (action === "register") {
      if (!licenseKey || !mac) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "error",
          message: "Missing parameters. License key and MAC address required."
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var data = sheet.getDataRange().getValues();
      for (var r = 1; r < data.length; r++) {
        var rowKey = String(data[r][0] || "").trim();
        if (rowKey.toLowerCase() === licenseKey.toLowerCase()) {
          var rowMac = String(data[r][2] || "").trim();
          if (rowMac && rowMac.toLowerCase() !== mac.toLowerCase()) {
            return ContentService.createTextOutput(JSON.stringify({
              status: "mac_mismatch",
              message: "License already bound to another MAC."
            })).setMimeType(ContentService.MimeType.JSON);
          }

          // Register this MAC
          var nowStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd-MM-yyyy HH:mm:ss");
          sheet.getRange(r + 1, 3).setValue(mac);
          sheet.getRange(r + 1, 4).setValue(nowStr);
          sheet.getRange(r + 1, 5).setValue("active");

          return ContentService.createTextOutput(JSON.stringify({
            status: "success",
            message: "License registered successfully to MAC: " + mac,
            license_key: licenseKey,
            registered_on: nowStr
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "invalid",
        message: "License key not found in system."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Unknown action: " + action
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return handleRequest(e, false);
}

function doPost(e) {
  return handleRequest(e, true);
}
