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
 * @returns {Promise<Object>} - API response
 */
async function fetchAPI(endpoint, method = 'GET', body = null) {
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

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return await response.json();
  } catch (error) {
    console.error(`Error in API call to ${endpoint}:`, error);
    return { status: 'FAILURE', message: 'Network error', errorCode: 'NETWORK_ERROR' };
  }
}

/**
 * Generates access token for API authentication
 * @returns {Promise<Object>} - Authentication response with access token
 */
async function oauthProxy() {
  return fetchAPI('/oauth-proxy', 'POST');
}

/**
 * Generates OTP for mobile verification
 * @param {string} mobileNumber - Mobile number to send OTP
 * @returns {Promise<Object>} - OTP generation response
 */
async function otpGeneration(mobileNumber) {
  return fetchAPI('/otp-generation', 'POST', { mobileNumber });
}

/**
 * Validates OTP sent to mobile
 * @param {string} referenceId - Reference ID from OTP generation
 * @param {string} otp - OTP entered by user
 * @returns {Promise<Object>} - OTP validation response
 */
async function otpValidation(referenceId, otp) {
  return fetchAPI('/otp-validation', 'POST', { referenceId, otp });
}

/**
 * Submit details for Factiva check
 * @param {string} name - Customer name
 * @param {string} dob - Date of birth
 * @param {string} pan - PAN number
 * @param {string} entityType - Type of entity
 * @returns {Promise<Object>} - Factiva input response
 */
async function factivaInput(name, dob, pan, entityType) {
  return fetchAPI('/factiva-input', 'POST', { name, dob, pan, entityType });
}

/**
 * Get results of Factiva check
 * @param {string} requestId - Request ID from Factiva input
 * @returns {Promise<Object>} - Factiva output response
 */
async function factivaOutput(requestId) {
  return fetchAPI(`/factiva-output?requestId=${requestId}`);
}

/**
 * Verify PAN details
 * @param {string} pan - PAN number to verify
 * @returns {Promise<Object>} - PAN verification response
 */
async function panVerification(pan) {
  return fetchAPI('/pan-verification', 'POST', { pan });
}

/**
 * Fetch existing account details
 * @param {string} mobileNumber - Customer mobile number
 * @param {string} pan - PAN number (optional)
 * @param {string} dob - Date of birth (optional)
 * @returns {Promise<Object>} - Account details response
 */
async function fetchCasaDetails(mobileNumber, pan, dob) {
  return fetchAPI('/fetch-casa-details', 'POST', { mobileNumber, pan, dob });
}

/**
 * Match names from different ID proofs
 * @param {string} panName - Name from PAN
 * @param {string} aadhaarName - Name from Aadhaar
 * @returns {Promise<Object>} - Name match results
 */
async function posidexNameMatch(panName, aadhaarName) {
  return fetchAPI('/posidex-name-match', 'POST', { panName, aadhaarName });
}

/**
 * Get credit bureau check results
 * @param {string} pan - PAN number
 * @param {string} name - Customer name
 * @param {string} dob - Date of birth
 * @returns {Promise<Object>} - Credit bureau results
 */
async function multibureauService(pan, name, dob) {
  return fetchAPI('/multibureau-service', 'POST', { pan, name, dob });
}

/**
 * Create lead in CRM
 * @param {string} customerName - Customer name
 * @param {string} mobileNumber - Mobile number
 * @param {string} pan - PAN number (optional)
 * @param {string} productCode - Product code
 * @returns {Promise<Object>} - Lead creation response
 */
async function crmSave(customerName, mobileNumber, productCode, pan) {
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
 * @returns {Promise<Object>} - Account opening response
 */
async function accountOpening(customerName, mobileNumber, pan, aadhaar, productCode, leadId, token) {
  return fetchAPI('/account-opening', 'POST', { customerName, mobileNumber, pan, aadhaar, productCode, leadId, token });
}

/**
 * Open new account for existing to bank customers
 * @param {string} customerId - Customer ID
 * @param {string} productCode - Product code
 * @param {string} token - Authentication token
 * @param {string} branchCode - Branch code
 * @returns {Promise<Object>} - ETB account opening response
 */
async function etbAccountOpening(customerId, productCode, token, branchCode) {
  return fetchAPI('/etb-account-opening', 'POST', { customerId, productCode, token, branchCode });
}

/**
 * Fetch customer demographic details
 * @param {string} customerId - Customer ID (optional)
 * @param {string} mobileNumber - Mobile number (optional)
 * @param {string} dob - Date of birth (optional)
 * @param {string} pan - PAN number (optional)
 * @returns {Promise<Object>} - Customer details response
 */
async function fcFetchCustDemog(customerId, mobileNumber, dob, pan) {
  return fetchAPI('/fc-fetch-cust-demog', 'POST', { customerId, mobileNumber, dob, pan });
}

/**
 * Identify if customer is ETB or NTB
 * @param {string} mobileNumber - Mobile number
 * @param {string} pan - PAN number (optional)
 * @param {string} dob - Date of birth (optional)
 * @returns {Promise<Object>} - Customer identification response
 */
async function genericCustomerIdentification(mobileNumber, pan, dob) {
  return fetchAPI('/generic-customer-identification', 'POST', { mobileNumber, pan, dob });
}

/**
 * Generates OTP for mobile verification (alternative service)
 * @param {string} mobileNumber - Mobile number to send OTP
 * @returns {Promise<Object>} - OTP generation response
 */
async function otpGenerationService(mobileNumber) {
  return fetchAPI('/otp-generation-service', 'POST', { mobileNumber });
}

/**
 * Validates OTP sent to mobile (alternative service)
 * @param {string} referenceId - Reference ID from OTP generation
 * @param {string} otp - OTP entered by user
 * @returns {Promise<Object>} - OTP validation response
 */
async function otpValidationService(referenceId, otp) {
  return fetchAPI('/otp-validation-service', 'POST', { referenceId, otp });
}

/**
 * Update customer AML details
 * @param {string} customerId - Customer ID
 * @param {string} token - Authentication token
 * @param {string} occupation - Customer occupation
 * @param {string} incomeRange - Income range
 * @param {string} companyType - Company type (optional)
 * @returns {Promise<Object>} - AML update response
 */
async function fcAmlUpdation(customerId, token, occupation, incomeRange, companyType) {
  return fetchAPI('/fc-aml-updation', 'POST', { customerId, token, occupation, incomeRange, companyType });
}

/**
 * Create lead for account opening
 * @param {string} customerId - Customer ID
 * @param {string} productCode - Product code
 * @param {string} branchCode - Branch code
 * @returns {Promise<Object>} - Lead creation response
 */
async function accOpeningLeadCreate(customerId, productCode, branchCode) {
  return fetchAPI('/accopening-leadcreate', 'POST', { customerId, productCode, branchCode });
}

/**
 * Fetch customer account, AML and FATCA details
 * @param {string} token - Authentication token
 * @param {string} mobileNumber - Mobile number
 * @returns {Promise<Object>} - Customer details response
 */
async function fetchCustAcctAmlFatca(token, mobileNumber) {
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
