/**
 * This file contains the API configuration for the PhotoCorp app.
 * Using the PhotoCorpAPIEXPO project path.
 */

export const API_BASE_URL = 'http://192.168.1.11/PhotoCorpAPIEXPO/public/api';

export const Config = {
    API_URL: API_BASE_URL,
    LOGIN_URL: `${API_BASE_URL}/user/login`,
    TIMEOUT: 10000,
    HEADERS: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
};
