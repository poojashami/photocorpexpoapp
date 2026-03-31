/**
 * This file contains the API configuration for the PhotoCorp app.
 * Replace the IP address with your computer's local IPv4 address 
 * to connect the mobile app to your local XAMPP server.
 * Run 'ipconfig' in your terminal to find your IPv4 address.
 */

export const API_BASE_URL = 'http://192.168.1.10/LaravelPhotoCorpApiWeb/public/api';

export const Config = {
    API_URL: API_BASE_URL,
    TIMEOUT: 10000,
    HEADERS: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
};
