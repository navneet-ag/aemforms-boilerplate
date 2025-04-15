/**
 * Get Full Name
 * @name getFullName Concats first name and last name
 * @param {string} firstname in Stringformat
 * @param {string} lastname in Stringformat
 * @return {string}
 */
function getFullName(firstname, lastname) {
  return `${firstname} ${lastname}`.trim();
}

/**
 * Calculate the number of days between two dates.
 * @param {*} endDate
 * @param {*} startDate
 * @returns {number} returns the number of days between two dates
 */
function days(endDate, startDate) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  // return zero if dates are valid
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const diffInMs = Math.abs(end.getTime() - start.getTime());
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

/**
 * Base URL for all API calls
 * @type {string}
 */
const API_BASE_URL = 'http://bumblebee:3000/api';

/**
 * Generic fetch function to handle API calls
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {Object} body - Request body for POST requests
 * @returns {Object} - API response
 */
function fetchAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return fetch(`${API_BASE_URL}${endpoint}`, options)
      .then(response => response.json())
      .catch(error => {
        console.error(`Error in API call to ${endpoint}:`, error);
        return { status: 'FAILURE', message: 'Network error', errorCode: 'NETWORK_ERROR' };
      });
  } catch (error) {
    console.error(`Error in API call to ${endpoint}:`, error);
    return Promise.resolve({ status: 'FAILURE', message: 'Network error', errorCode: 'NETWORK_ERROR' });
  }
}

/**
 * Generates access token for API authentication
 * @returns {Object} - Response containing:
 *   @returns {string} access_token - The authentication token
 *   @returns {string} token_type - Type of token (e.g., "Bearer")
 *   @returns {number} expires_in - Token expiration time in seconds
 *   @returns {string} scope - Token scope
 */
function oauthProxy() {
  return fetchAPI('/oauth-proxy', 'POST');
}

/**
 * Generates OTP for mobile verification
 * @param {string} mobileNumber - Mobile number to send OTP
 * @returns {Object} - Response containing:
 *   @returns {string} status - Status of the request ("SUCCESS" or "FAILURE")
 *   @returns {string} message - Response message
 *   @returns {string} referenceId - Reference ID for OTP validation
 *   @returns {number} otpExpiry - OTP expiry time in seconds
 */
function otpGeneration(mobileNumber) {
  return fetchAPI('/otp-generation', 'POST', { mobileNumber });
}

/**
 * Validates OTP sent to mobile
 * @param {string} referenceId - Reference ID from OTP generation
 * @param {string} otp - OTP entered by user
 * @returns {Object} - Response containing:
 *   @returns {string} status - Status of the request ("SUCCESS" or "FAILURE")
 *   @returns {string} message - Response message
 *   @returns {string} token - Authentication token on successful validation
 */
function otpValidation(referenceId, otp) {
  return fetchAPI('/otp-validation', 'POST', { referenceId, otp });
}

/**
 * Submit details for Factiva check
 * @param {string} name - Customer name
 * @param {string} dob - Date of birth
 * @param {string} pan - PAN number
 * @param {string} entityType - Type of entity
 * @returns {Object} - Response containing:
 *   @returns {string} status - Status of the request ("SUCCESS" or "FAILURE")
 *   @returns {string} message - Response message
 *   @returns {string} requestId - ID for tracking the Factiva check request
 */
function factivaInput(name, dob, pan, entityType) {
  return fetchAPI('/factiva-input', 'POST', { name, dob, pan, entityType });
}

/**
 * Get results of Factiva check
 * @param {string} requestId - Request ID from Factiva input
 * @returns {Object} - Response containing:
 *   @returns {string} status - Status of the request ("SUCCESS" or "FAILURE")
 *   @returns {string} requestId - The input request ID
 *   @returns {boolean} matchFound - Whether a match was found in Factiva
 *   @returns {number} matchScore - Score indicating match confidence
 */
function factivaOutput(requestId) {
  return fetchAPI(`/factiva-output?requestId=${requestId}`);
}

/**
 * Verify PAN details
 * @param {string} pan - PAN number to verify
 * @returns {Object} - Response containing:
 *   @returns {string} status - Status of the request ("SUCCESS" or "FAILURE")
 *   @returns {string} pan - PAN number
 *   @returns {string} name - Name as per PAN records
 *   @returns {string} dob - Date of birth as per PAN records
 *   @returns {boolean} verified - Whether PAN is verified
 */
function panVerification(pan) {
  return fetchAPI('/pan-verification', 'POST', { pan });
}

/**
 * Fetch existing account details
 * @param {string} mobileNumber - Customer mobile number
 * @param {string} pan - PAN number (optional)
 * @param {string} dob - Date of birth (optional)
 * @returns {Object} - Response containing:
 *   @returns {string} status - Status of the request ("SUCCESS" or "FAILURE")
 *   @returns {string} customerType - Customer type ("NTB" or "ETB")
 *   @returns {string} customerId - Customer ID
 *   @returns {Array<Object>} accounts - List of accounts:
 *     @returns {string} accountNumber - Account number
 *     @returns {string} accountType - Type of account
 *     @returns {string} status - Account status
 */
function fetchCasaDetails(mobileNumber, pan, dob) {
  return fetchAPI('/fetch-casa-details', 'POST', { mobileNumber, pan, dob });
}

/**
 * Match names from different ID proofs
 * @param {string} panName - Name from PAN
 * @param {string} aadhaarName - Name from Aadhaar
 * @returns {Object} - Response containing:
 *   @returns {string} status - Status of the request ("SUCCESS" or "FAILURE")
 *   @returns {number} matchPercentage - Percentage match between names
 *   @returns {number} threshold - Threshold percentage for match approval
 *   @returns {boolean} passed - Whether the name match passed the threshold
 */
function posidexNameMatch(panName, aadhaarName) {
  return fetchAPI('/posidex-name-match', 'POST', { panName, aadhaarName });
}

/**
 * Get credit bureau check results
 * @param {string} pan - PAN number
 * @param {string} name - Customer name
 * @param {string} dob - Date of birth
 * @returns {Object} - Response containing:
 *   @returns {string} status - Status of the request ("SUCCESS" or "FAILURE")
 *   @returns {string} bureauSource - Source of credit bureau data
 *   @returns {number} creditScore - Credit score from bureau
 *   @returns {string} reportDate - Date of credit report
 *   @returns {boolean} eligibility - Whether customer is eligible based on credit score
 */
function multibureauService(pan, name, dob) {
  return fetchAPI('/multibureau-service', 'POST', { pan, name, dob });
}

/**
 * Create lead in CRM
 * @param {string} customerName - Customer name
 * @param {string} mobileNumber - Mobile number
 * @param {string} pan - PAN number (optional)
 * @param {string} productCode - Product code
 * @returns {Object} - Response containing:
 *   @returns {string} status - Status of the request ("SUCCESS" or "FAILURE")
 *   @returns {string} leadId - Generated lead ID
 *   @returns {string} message - Response message
 */
function crmSave(customerName, mobileNumber, productCode, pan) {
  return fetchAPI('/crm-save', 'POST', { customerName, mobileNumber, productCode, pan });
}

/**
 * Open new account for new to bank customers
 * @param {string} customerName - Customer name
 * @param {string} mobileNumber - Mobile number
 * @param {string} pan - PAN number
 * @param {string} aadhaar - Aadhaar number
 * @param {string} productCode - Product code
 * @param {string} leadId - Lead ID from CRM
 * @param {string} token - Authentication token (optional)
 * @returns {Object} - Response containing:
 *   @returns {string} status - Status of the request ("SUCCESS" or "FAILURE")
 *   @returns {string} customerId - Customer ID
 *   @returns {string} accountNumber - Created account number
 *   @returns {string} ifscCode - IFSC code for the account
 *   @returns {string} branchCode - Branch code
 *   @returns {string} message - Response message
 */
function accountOpening(customerName, mobileNumber, pan, aadhaar, productCode, leadId, token) {
  return fetchAPI('/account-opening', 'POST', { customerName, mobileNumber, pan, aadhaar, productCode, leadId, token });
}

/**
 * Open new account for existing to bank customers
 * @param {string} customerId - Customer ID
 * @param {string} productCode - Product code
 * @param {string} token - Authentication token
 * @param {string} branchCode - Branch code
 * @returns {Object} - Response containing:
 *   @returns {string} status - Status of the request ("SUCCESS" or "FAILURE")
 *   @returns {string} customerId - Customer ID
 *   @returns {string} accountNumber - Created account number
 *   @returns {string} ifscCode - IFSC code for the account
 *   @returns {string} message - Response message
 */
function etbAccountOpening(customerId, productCode, token, branchCode) {
  return fetchAPI('/etb-account-opening', 'POST', { customerId, productCode, token, branchCode });
}

/**
 * Fetch customer demographic details
 * @param {string} customerId - Customer ID (optional)
 * @param {string} mobileNumber - Mobile number (optional)
 * @param {string} dob - Date of birth (optional)
 * @param {string} pan - PAN number (optional)
 * @returns {Object} - Response containing:
 *   @returns {string} status - Status of the request ("SUCCESS" or "FAILURE")
 *   @returns {string} customerId - Customer ID
 *   @returns {string} name - Customer name
 *   @returns {string} mobileNumber - Mobile number
 *   @returns {string} dob - Date of birth
 *   @returns {string} pan - PAN number
 *   @returns {string} email - Email address
 *   @returns {Object} address - Customer address:
 *     @returns {string} line1 - Address line 1
 *     @returns {string} line2 - Address line 2
 *     @returns {string} city - City
 *     @returns {string} state - State
 *     @returns {string} pincode - PIN code
 *   @returns {string} token - Authentication token
 */
function fcFetchCustDemog(customerId, mobileNumber, dob, pan) {
  return fetchAPI('/fc-fetch-cust-demog', 'POST', { customerId, mobileNumber, dob, pan });
}

/**
 * Identify if customer is ETB or NTB
 * @param {string} mobileNumber - Mobile number
 * @param {string} pan - PAN number (optional)
 * @param {string} dob - Date of birth (optional)
 * @returns {Object} - Response containing:
 *   @returns {string} status - Status of the request ("SUCCESS" or "FAILURE")
 *   @returns {string} customerType - Customer type ("ETB" or "NTB")
 *   @returns {string} customerId - Customer ID (for ETB customers)
 *   @returns {string} message - Response message
 */
function genericCustomerIdentification(mobileNumber, pan, dob) {
  return fetchAPI('/generic-customer-identification', 'POST', { mobileNumber, pan, dob });
}

/**
 * Generates OTP for mobile verification (alternative service)
 * @param {string} mobileNumber - Mobile number to send OTP
 * @returns {Object} - Response containing:
 *   @returns {string} status - Status of the request ("SUCCESS" or "FAILURE")
 *   @returns {string} message - Response message
 *   @returns {string} referenceId - Reference ID for OTP validation
 *   @returns {number} otpExpiry - OTP expiry time in seconds
 */
function otpGenerationService(mobileNumber) {
  return fetchAPI('/otp-generation-service', 'POST', { mobileNumber });
}

/**
 * Validates OTP sent to mobile (alternative service)
 * @param {string} referenceId - Reference ID from OTP generation
 * @param {string} otp - OTP entered by user
 * @returns {Object} - Response containing:
 *   @returns {string} status - Status of the request ("SUCCESS" or "FAILURE")
 *   @returns {string} message - Response message
 *   @returns {string} token - Authentication token on successful validation
 */
function otpValidationService(referenceId, otp) {
  return fetchAPI('/otp-validation-service', 'POST', { referenceId, otp });
}

/**
 * Update customer AML details
 * @param {string} customerId - Customer ID
 * @param {string} token - Authentication token
 * @param {string} occupation - Customer occupation
 * @param {string} incomeRange - Income range
 * @param {string} companyType - Company type (optional)
 * @returns {Object} - Response containing:
 *   @returns {string} status - Status of the request ("SUCCESS" or "FAILURE")
 *   @returns {string} customerId - Customer ID
 *   @returns {string} message - Response message
 */
function fcAmlUpdation(customerId, token, occupation, incomeRange, companyType) {
  return fetchAPI('/fc-aml-updation', 'POST', { customerId, token, occupation, incomeRange, companyType });
}

/**
 * Create lead for account opening
 * @param {string} customerId - Customer ID
 * @param {string} productCode - Product code
 * @param {string} branchCode - Branch code
 * @returns {Object} - Response containing:
 *   @returns {string} status - Status of the request ("SUCCESS" or "FAILURE")
 *   @returns {string} leadId - Generated lead ID
 *   @returns {string} customerId - Customer ID
 *   @returns {string} message - Response message
 */
function accOpeningLeadCreate(customerId, productCode, branchCode) {
  return fetchAPI('/accopening-leadcreate', 'POST', { customerId, productCode, branchCode });
}

/**
 * Fetch customer account, AML and FATCA details
 * @param {string} token - Authentication token
 * @param {string} mobileNumber - Mobile number
 * @returns {Object} - Response containing:
 *   @returns {string} status - Status of the request ("SUCCESS" or "FAILURE")
 *   @returns {string} customerId - Customer ID
 *   @returns {string} name - Customer name
 *   @returns {string} mobileNumber - Mobile number
 *   @returns {Array<Object>} accounts - List of accounts:
 *     @returns {string} accountNumber - Account number
 *     @returns {string} accountType - Type of account
 *     @returns {string} status - Account status
 *   @returns {string} token - Authentication token
 */
function fetchCustAcctAmlFatca(token, mobileNumber) {
  return fetchAPI('/fetch-custacct-amlfatca', 'POST', { token, mobileNumber });
}

// Export all functions
export {
  getFullName,
  days,
  oauthProxy,
  otpGeneration,
  otpValidation,
  factivaInput,
  factivaOutput,
  panVerification,
  fetchCasaDetails,
  posidexNameMatch,
  multibureauService,
  crmSave,
  accountOpening,
  etbAccountOpening,
  fcFetchCustDemog,
  genericCustomerIdentification,
  otpGenerationService,
  otpValidationService,
  fcAmlUpdation,
  accOpeningLeadCreate,
  fetchCustAcctAmlFatca
};
