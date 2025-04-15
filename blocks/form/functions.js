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
const API_BASE_URL = 'https://forms-api.azure-api.net/api';

/**
 * Generic fetch function to handle API calls
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {Object|null} body - Request body for POST requests
 * @param {Object} headers - Additional request headers
 * @returns {Object} API response data or error object
 */
function fetchAPI(endpoint, method = 'GET', body = null, headers = {}) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    return fetch(`${API_BASE_URL}${endpoint}`, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }
        return response.json();
      })
      .catch(error => {
        console.error(`Error in API call to ${endpoint}:`, error);
        return { 
          code: 'API_ERROR',
          value: 500,
          message: error.message
        };
      });
  } catch (error) {
    console.error(`Error in API call to ${endpoint}:`, error);
    return Promise.resolve({ 
      code: 'API_ERROR',
      value: 500,
      message: error.message
    });
  }
}

/**
 * Submit Adaptive Form request
 * @param {string} payload - The form data payload to submit
 * @returns {string} Submission response string
 */
function submitAdaptiveForm(payload) {
  return fetchAPI('/af', 'POST', payload);
}

/**
 * Get all Adaptive Form submit requests
 * @returns {string[]} Array of form submission strings
 */
function getAllAdaptiveFormRequests() {
  return fetchAPI('/af');
}

/**
 * Delete all Adaptive Form submit requests
 * @returns {boolean} Success or failure status
 */
function deleteAllAdaptiveFormRequests() {
  return fetchAPI('/af', 'DELETE');
}

/**
 * Get Adaptive Form request by ID
 * @param {string} id - Request ID to retrieve
 * @returns {string} Form request data
 */
function getAdaptiveFormRequestById(id) {
  return fetchAPI(`/af/${id}`);
}

/**
 * Generate OTP for mobile number
 * @param {number} mobileNo - Mobile number (10 digits)
 * @returns {Object} Validation details object with status and reference ID
 */
function generateOTP(mobileNo) {
  return fetchAPI('/otp/generation', 'POST', { mobileNo });
}

/**
 * Validate OTP
 * @param {number} mobileNo - Mobile number
 * @param {number} otp - OTP received by user
 * @returns {Object} Validation result object with status and token
 */
function validateOTP(mobileNo, otp) {
  return fetchAPI('/otp/validation', 'POST', { mobileNo, otp });
}

/**
 * Get offers available to customer
 * @param {number} mobileNo - Mobile number (10 digits)
 * @returns {Object} Offer details object with type, amount, and other offer properties
 */
function getOffers(mobileNo) {
  return fetchAPI(`/offer?mobileNo=${mobileNo}`);
}

/**
 * Get customer information
 * @param {number} mobileNo - Mobile number (10 digits)
 * @returns {Object} Customer information object with personal and demographic details
 */
function getCustomerInfo(mobileNo) {
  return fetchAPI(`/cif?mobileNo=${mobileNo}`);
}

/**
 * Evaluate business rules
 * @param {Object} employmentDetails - Employment details object with company name, type, and salary information
 * @returns {Object} Offer object based on employment evaluation
 */
function evaluateBusinessRules(employmentDetails) {
  return fetchAPI('/bre', 'POST', employmentDetails);
}

/**
 * Upload multiple documents
 * @param {FormData} formData - Form data containing multiple files to upload
 * @returns {Object[]} Array of uploaded document objects with IDs and metadata
 */
function uploadMultipleDocuments(formData) {
  return fetch(`${API_BASE_URL}/docs`, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .catch(error => {
    console.error('Error uploading documents:', error);
    return { 
      code: 'UPLOAD_ERROR',
      value: 500,
      message: error.message
    };
  });
}

/**
 * Upload a single document
 * @param {FormData} formData - Form data containing file, filename and type
 * @returns {Object} Uploaded document object with ID and metadata
 */
function uploadDocument(formData) {
  return fetch(`${API_BASE_URL}/doc`, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .catch(error => {
    console.error('Error uploading document:', error);
    return { 
      code: 'UPLOAD_ERROR',
      value: 500,
      message: error.message
    };
  });
}

/**
 * Get all documents
 * @returns {string[]} Array of document strings
 */
function getAllDocuments() {
  return fetchAPI('/doc');
}

/**
 * Get document by ID
 * @param {string} id - Document ID to retrieve
 * @returns {Object} Document object with name, size and other metadata
 */
function getDocumentById(id) {
  return fetchAPI(`/doc/${id}`);
}

/**
 * Submit personal loan request
 * @param {Object} loanRequest - Loan request object with customer, employment, and offer details
 * @returns {string} Response string, typically containing a request ID
 */
function submitPersonalLoan(loanRequest) {
  return fetchAPI('/pl', 'POST', loanRequest);
}

/**
 * Get all personal loan requests
 * @returns {string[]} Array of loan request strings
 */
function getAllPersonalLoanRequests() {
  return fetchAPI('/pl');
}

/**
 * Delete all personal loan requests
 * @returns {boolean} Success or failure status
 */
function deleteAllPersonalLoanRequests() {
  return fetchAPI('/pl', 'DELETE');
}

/**
 * Get personal loan request by ID
 * @param {string} id - Loan request ID to retrieve
 * @returns {Object} Loan request object with customer, employment and offer details
 */
function getPersonalLoanRequestById(id) {
  return fetchAPI(`/pl/${id}`);
}

/**
 * Get next week trip schedule
 * @returns {Object} Availability object with start date, end date, and available dates
 */
function getNextWeekSchedule() {
  return fetchAPI('/nextWeekSchedule');
}

/**
 * Check availability for a specific date
 * @param {string} date - Date to check availability for
 * @returns {Object} Availability object with available status and dates
 */
function checkAvailability(date) {
  return fetchAPI(`/checkAvailability?date=${date}`);
}

// Export all functions
export {
  getFullName,
  days,
  submitAdaptiveForm,
  getAllAdaptiveFormRequests,
  deleteAllAdaptiveFormRequests,
  getAdaptiveFormRequestById,
  generateOTP,
  validateOTP,
  getOffers,
  getCustomerInfo,
  evaluateBusinessRules,
  uploadMultipleDocuments,
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  submitPersonalLoan,
  getAllPersonalLoanRequests,
  deleteAllPersonalLoanRequests,
  getPersonalLoanRequestById,
  getNextWeekSchedule,
  checkAvailability
};
