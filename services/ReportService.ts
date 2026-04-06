import apiClient from './apiClient';
import { Config } from '../constants/Config';

export const ReportService = {
  /**
   * Fetch active crews lists and details.
   */
  async getCrewReports() {
    try {
      const response = await apiClient.get(Config.REPORT_CREW);
      console.log('Crew API Response:', JSON.stringify(response.data).substring(0, 500));
      return response.data;
    } catch (error) {
      console.error('Error fetching Crew Reports:', error);
      throw error;
    }
  },

  /**
   * Fetch ceremony-wise booking summary.
   */
  async getCrewCeremonyReports() {
    try {
      const response = await apiClient.get(Config.REPORT_CREW_CEREMONY);
      return response.data;
    } catch (error) {
      console.error('Error fetching Crew Ceremony Reports:', error);
      throw error;
    }
  },

  /**
   * Fetch details of ceremonies assigned to a specific crew.
   * @param id Crew ID
   */
  async getCrewEventDetails(id: string | number) {
    try {
      const response = await apiClient.get(Config.REPORT_CREW_EVENT(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching Crew Event Details:', error);
      throw error;
    }
  },

  /**
   * Fetch active customers detailed list.
   */
  async getCustomerReports() {
    try {
      const response = await apiClient.get(Config.REPORT_CUSTOMERS);
      return response.data;
    } catch (error) {
      console.error('Error fetching Customer Reports:', error);
      throw error;
    }
  },

  /**
   * Fetch inquiries list, types, and sources.
   */
  async getEnquiryReports() {
    try {
      const response = await apiClient.get(Config.REPORT_ENQUIRIES);
      return response.data;
    } catch (error) {
      console.error('Error fetching Enquiry Reports:', error);
      throw error;
    }
  },

  /**
   * Fetch event booking and ceremony details (Receipt summary).
   */
  async getEventReports() {
    try {
      const response = await apiClient.get(Config.REPORT_EVENT_BOOKING);
      return response.data;
    } catch (error) {
      console.error('Error fetching Event Reports:', error);
      throw error;
    }
  },

  /**
   * Fetch complete list of income and expenses.
   */
  async getProfitLossReports() {
    try {
      const response = await apiClient.get(Config.REPORT_PROFIT_LOSS);
      return response.data;
    } catch (error) {
      console.error('Error fetching Profit/Loss Reports:', error);
      throw error;
    }
  },

  /**
   * Fetch all quotations details and status.
   */
  async getQuotationReports() {
    try {
      const response = await apiClient.get(Config.REPORT_QUOTATIONS);
      return response.data;
    } catch (error) {
      console.error('Error fetching Quotation Reports:', error);
      throw error;
    }
  },
};
