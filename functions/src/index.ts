
// To explicitly use 1st generation functions, you must import the
// 'functions' object from 'firebase-functions/v1'
import * as functions from "firebase-functions/v1";
import {CallableContext, HttpsError} from "firebase-functions/v1/https";
import fetch from "node-fetch";
// Note: To resolve TypeScript errors for 'node-fetch',
// npm i --save-dev @types/node-fetch

// Import the Firebase Admin SDK to perform privileged actions
import * as admin from "firebase-admin";
admin.initializeApp();

// Import defineSecret from firebase-functions/params (this is compatible
// with both v1 and v2 functions)
import {defineSecret} from "firebase-functions/params";

// Define your secret. The string "ZIINA_API_KEY" is the name of the secret
// that will be stored in Google Cloud Secret Manager.
const ZIINA_API_KEY_SECRET = defineSecret("ZIINA_API_KEY");

const ZIINA_API_URL = "https://api-v2.ziina.com/api/payment_intent/";

/**
 * =================================================================
 * NEW FUNCTION: Set Admin Claim
 * =================================================================
 * This function triggers when a new document is added to the 'admins'
 * collection in Firestore. It takes the email from the document, finds
 * the corresponding user in Firebase Auth, and sets a custom claim
 * to make them an admin.
 */
export const setAdminClaimOnNewAdmin = functions.firestore
  .document("admins/{docId}")
  .onCreate(async (snap) => {
    const newAdmin = snap.data();
    if (!newAdmin || !newAdmin.email) {
      functions.logger.log("Admin document created without an email.");
      return;
    }

    const email = newAdmin.email;
    try {
      // 1. Find the user by their email address.
      const user = await admin.auth().getUserByEmail(email);

      // 2. Set the custom claim.
      await admin.auth().setCustomUserClaims(user.uid, {isAdmin: true});

      functions.logger.log(
        `✅ Success! Custom claim { isAdmin: true } set for user: ${email}`
      );
    } catch (error) {
      functions.logger.error(
        `❌ Error setting custom claim for ${email}:`,
        error
      );
    }
  });


/**
 * =================================================================
 * EXISTING FUNCTION: Create Ziina Payment Intent
 * =================================================================
 */
export const createZiinaPaymentIntent = functions
  .runWith({secrets: [ZIINA_API_KEY_SECRET]})
  .https.onCall(async(data: any, context: CallableContext)=>{
    // Now, ZIINA_API_KEY will be available in process.env
    const ZIINA_API_KEY = process.env.ZIINA_API_KEY;

    // 1. Check for authentication. 'context.auth' is now correctly typed.
    if (!context.auth) {
      throw new HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.",
      );
    }

    // Add a check to ensure the API key was actually loaded
    if (!ZIINA_API_KEY) {
      functions.logger.error("ZIINA_API_KEY is undefined. Secret not " +
                "loaded or configured correctly.");
      throw new HttpsError(
        "internal",
        "Ziina API key is not configured or loaded.",
      );
    }

    // 2. The data sent from the client is available in the 'data' parameter.
    const {totalPrice, customer, successUrl, failureUrl} = data;
    if (!totalPrice || !customer || !successUrl) {
      throw new HttpsError(
        "invalid-argument",
        "Required data is missing.",
      );
    }

    // Calculate expiry timestamp: current time + 3 hours in milliseconds.
    const threeHoursInMilliseconds = 3 * 60 * 60 * 1000;
    // Ziina usually expects a timestamp in seconds or a date string.
    // Following the request for milliseconds and converting to string.
    const expiryValue = (Date.now() + threeHoursInMilliseconds).toString();


    // 3. Prepare the payload for Ziina
    const ziinaPayload = {
      "amount": Math.round(totalPrice * 100), // Use 'amount' directly
      "currency_code": "AED",
      "message": "", // Optional, provide default if not sent
      "success_url": successUrl,
      // Set cancel_url to be the same as failure_url
      "cancel_url": failureUrl || "",
      "failure_url": failureUrl || "", // Optional
      "test": false, // Optional, default to false
      "expiry": expiryValue, // Set to current time + 3 hours in milliseconds
      "allow_tips": false, // Optional, default to false
      // --- FIX: Include customer data in metadata for tracking ---
      "metadata": {
          "user_id": customer.id,
          "customer_email": customer.email,
      }
      // -----------------------------------------------------------
    };

    const requestHeaders = {
      "Authorization": `Bearer ${ZIINA_API_KEY}`,
      "Content-Type": "application/json",
    };

    try {
      // Log the request payload being sent to Ziina API
      functions.logger.info("Request sent to Ziina API:",
        JSON.stringify(ziinaPayload));

      // Log headers for debugging (redacting the key for security)
      functions.logger.info("Request headers (for debugging):",
        JSON.stringify({
          "Authorization": `Bearer ${ZIINA_API_KEY ? 'REDACTED_' + ZIINA_API_KEY.substring(0, 4) + '...' : 'MISSING'}`,
          "Content-Type": requestHeaders["Content-Type"],
        }));

      // 4. Call the Ziina API from the secure backend
      // --- DEBUG ADDITION: Confirming execution before fetch ---
      functions.logger.info("Initiating external POST request to Ziina URL.");
      // ---------------------------------------------------------
      const response = await fetch(ZIINA_API_URL, {
        "method": "POST",
        "headers": requestHeaders,
        "body": JSON.stringify(ziinaPayload),
      });

      // --- DEBUG ADDITION: Response Handling ---
      let responseData: any;
      try {
        const responseText = await response.text();
        
        // *** NEW AGGRESSIVE LOGGING USING CONSOLE.LOG ***
        console.log(`[*** ZIINA API STATUS ***] ${response.status}`);
        console.log(`[*** ZIINA RAW BODY ***] ${responseText}`);
        // ***********************************************

        // Attempt to parse the text response (if it's valid JSON)
        responseData = JSON.parse(responseText);

      } catch (parseError) {
        // If parsing fails (e.g., non-JSON response), log the status and
        // generic error.
        functions.logger.error("Failed to parse Ziina API response as JSON. Status:",
          response.status, "Error:", parseError);
        // Use a placeholder object for consistent error handling below
        responseData = { error: "Failed to parse JSON response." };
      }
      // -----------------------------------------


      if (!response.ok) {
        // This is a clear "fail" log from a non-200 HTTP response.
        functions.logger.error("Ziina API Error (HTTP not OK) - FAILURE:", responseData);
        functions.logger.error("API Key:",
          ZIINA_API_KEY ? "Loaded (value redacted)" : "Not Loaded");
        throw new HttpsError(
          "internal",
          "Failed to create payment intent with Ziina.",
        );
      }

      // --- NEW: Robust redirect_url extraction and validation ---
      const redirectUrlFromZiina = (responseData as { redirect_url?: string | null })?.redirect_url;

      if (!redirectUrlFromZiina || typeof redirectUrlFromZiina !== 'string' || redirectUrlFromZiina.trim() === '') {
        functions.logger.error(
          "Ziina API response missing or invalid 'redirect_url'. Raw response:",
          JSON.stringify(responseData)
        );
        throw new HttpsError(
          "internal",
          "Ziina API did not return a valid redirect URL. Please try again or contact support."
        );
      }
      const finalRedirectUrl = redirectUrlFromZiina.trim(); // Trim for safety

      // 5. Return the redirect URL to the frontend app
      // FIX: Wrap the response in a 'data' object as expected by Firebase Callable Functions on the client side.
      const finalResponse = { data: {redirectUrl: finalRedirectUrl}}; // Store the object being returned

      // --- SUCCESS LOG ADDITION: USING CONSOLE.LOG FOR MAX VISIBILITY ---
      console.log("!!! FINAL SUCCESS RESPONSE TO CLIENT:", JSON.stringify(finalResponse));
      // ---------------------------------------------------------------------------
      return finalResponse; // Return the logged object
    } catch (error) {
      // This is the general "fail" log for unexpected errors (network, parsing, etc.).
      // --- ENHANCED AND SIMPLIFIED FAILURE LOGGING TO ENSURE VISIBILITY ---
      functions.logger.error("!!! FATAL NETWORK ERROR ENCOUNTERED !!!");
      functions.logger.error("Error message:", (error as Error).message);
      functions.logger.error("Error stack:", (error as Error).stack);
      // Stringify the whole object to ensure it is logged even if it's not a standard Error type
      functions.logger.error("Raw error object (stringified):", JSON.stringify(error));
      // ---------------------------------------------------------------------

      functions.logger.error("API Key:",
        ZIINA_API_KEY ? "Loaded (value redacted)" : "Not Loaded");
      throw new HttpsError(
        "internal",
        "An unexpected error occurred while processing the payment.",
      );
    }
  });
