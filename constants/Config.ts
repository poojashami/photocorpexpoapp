/**
 * This file contains the API configuration for the PhotoCorp app.
 * Using the PhotoCorpAPIEXPO project path.
 */

export const API_BASE_URL = 'http://192.168.1.15:8000/api';

export const Config = {
    API_URL: API_BASE_URL,
    LOGIN_URL: `${API_BASE_URL}/user/login`,
    TIMEOUT: 10000,
    HEADERS: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    // Report Endpoints
    REPORT_CREW: `${API_BASE_URL}/crews`,
    REPORT_CREW_CEREMONY: `${API_BASE_URL}/getceremonyWiseBookingOfDashboard`,
    REPORT_CREW_EVENT: (id: string | number) => `${API_BASE_URL}/crew-event-ceremony-details/${id}`,
    REPORT_CUSTOMERS: `${API_BASE_URL}/customers-data/getNonDeletedCustomers`,
    REPORT_ENQUIRIES: `${API_BASE_URL}/enquiries`,
    REPORT_EVENT_BOOKING: `${API_BASE_URL}/events`,
    REPORT_PROFIT_LOSS: `${API_BASE_URL}/expenseGetData`,
    REPORT_QUOTATIONS: `${API_BASE_URL}/getQuotationData`,
    REPORT_CALENDAR: `${API_BASE_URL}/getCeremony-CalendarData`,
};
