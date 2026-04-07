import apiClient from './apiClient';
import { Config } from '../constants/Config';

export class ReportService {
  /**
   * Fetch active crews lists and details.
   */
  static async getCrewReports() {
    try {
      const response = await apiClient.get(Config.REPORT_CREW);
      return response.data;
    } catch (error) {
      console.error('Error fetching Crew Reports:', error);
      throw error;
    }
  }

  /**
   * Fetch ceremony-wise booking summary.
   */
  static async getCrewCeremonyReports() {
    try {
      const response = await apiClient.get(Config.REPORT_CREW_CEREMONY);
      return response.data;
    } catch (error) {
      console.error('Error fetching Crew Ceremony Reports:', error);
      throw error;
    }
  }

  /**
   * Fetch details of ceremonies assigned to a specific crew.
   */
  static async getCrewEventReports(id: string | number) {
    try {
      const response = await apiClient.get(Config.REPORT_CREW_EVENT(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching Crew Event Details:', error);
      throw error;
    }
  }

  /**
   * Fetch active customers detailed list.
   */
  static async getCustomerReports() {
    try {
      const response = await apiClient.get(Config.REPORT_CUSTOMERS);
      return response.data;
    } catch (error) {
      console.error('Error fetching Customer Reports:', error);
      throw error;
    }
  }

  /**
   * Fetch inquiries list, types, and sources.
   */
  static async getEnquiryReports() {
    try {
      const response = await apiClient.get(Config.REPORT_ENQUIRIES);
      return response.data;
    } catch (error) {
      console.error('Error fetching Enquiry Reports:', error);
      throw error;
    }
  }

  /**
   * Fetch event booking and ceremony details (Receipt summary).
   */
  static async getEventReports() {
    try {
      const response = await apiClient.get(Config.REPORT_EVENT_BOOKING);
      return response.data;
    } catch (error) {
      console.error('Error fetching Event Reports:', error);
      throw error;
    }
  }

  /**
   * Fetch complete list of income and expenses.
   */
  static async getProfitLossReports() {
    try {
      const response = await apiClient.get(Config.REPORT_PROFIT_LOSS);
      return response.data;
    } catch (error) {
      console.error('Error fetching Profit/Loss Reports:', error);
      throw error;
    }
  }

  /**
   * Fetch all quotations details and status.
   */
  static async getQuotationReports() {
    try {
      const response = await apiClient.get(Config.REPORT_QUOTATIONS);
      return response.data;
    } catch (error) {
      console.error('Error fetching Quotation Reports:', error);
      throw error;
    }
  }

  /**
   * Fetch calendar events for ceremonies (FullCalendar compatible data).
   */
  static async getCalendarData(start: string, end: string) {
    try {
      const response = await apiClient.get(`${Config.REPORT_CALENDAR}?start=${start}&end=${end}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Calendar Data:', error);
      throw error;
    }
  }
}
