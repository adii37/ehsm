import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

// Base URL for the OData service as defined in the user request (proxy or direct)
// In a real BTP scenario, this would be a relative path mapped in xs-app.json.
// For local development, we might need a proxy or mock. 
// Assuming the user has a proxy set up or we use the full URL if CORS allows.
// Given the context: "I have connected my backend sap data using cloud connector" implies BTP destination usage.
// So usually /odata/ZEHSMPORTAL_AJ_SRV/ or similar. 
// But the user provided full URLs like: http://AZKTLDS5CP.kcloud.com:8000/sap/opu/odata/SAP/ZEHSMPORTAL_AJ_SRV/

// We'll use a configurable base URL.
const API_BASE_URL = "/sap/opu/odata/SAP/ZEHSMPORTAL_AJ_SRV";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json', // Default to JSON, but some endpoints return XML strictly?
  },
});

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_"
});

export const authService = {
  login: async (empId, password) => {
    // URL: /LoginSet(EmpId='...',EmpPassword='...')
    // Returns XML
    const url = `/LoginSet(EmpId='${empId}',EmpPassword='${encodeURIComponent(password)}')`;
    try {
      // Explicitly request XML or accept whatever comes since the server seems to return XML for this.
      const response = await api.get(url, { headers: { 'Accept': 'application/xml, text/xml' } });

      // Parse XML response
      // Structure: <entry> ... <m:properties> <d:Status>SUCCESS</d:Status> ...
      const jsonObj = xmlParser.parse(response.data);

      // Navigate the parsed object structure to find properties.
      // Depending on fast-xml-parser configuration and the exact XML structure:
      // entry -> content -> m:properties -> d:Status
      const entry = jsonObj.entry || jsonObj['atom:entry'];
      const content = entry?.content || entry?.['atom:content'];
      const properties = content?.['m:properties'];
      const status = properties?.['d:Status'];

      return {
        success: status === 'SUCCESS',
        data: properties
      };
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  }
};

export const dataService = {
  getIncidents: async (plant) => {
    // URL: /IncidentsSet?$filter=Plant eq 'AT01'&$format=json
    try {
      const response = await api.get(`/IncidentsSet`, {
        params: {
          '$filter': `Plant eq '${plant}'`,
          '$format': 'json'
        }
      });
      return response.data.d.results;
    } catch (error) {
      console.error("Get Incidents Error:", error);
      throw error;
    }
  },

  getRisks: async () => {
    // URL: /RiskSet
    // Returns XML (Atom Feed)
    try {
      const response = await api.get('/RiskSet', { headers: { 'Accept': 'application/xml, text/xml' } });
      const jsonObj = xmlParser.parse(response.data);

      // Parse Feed
      // feed -> entry[]
      const feed = jsonObj.feed || jsonObj['atom:feed'];
      let entries = feed?.entry || feed?.['atom:entry'];

      if (!entries) return [];
      if (!Array.isArray(entries)) entries = [entries];

      return entries.map(entry => {
        const props = entry.content['m:properties'];
        return {
          RiskId: props['d:RiskId'],
          RiskDescription: props['d:RiskDescription'],
          RiskCategory: props['d:RiskCategory'],
          RiskSeverity: props['d:RiskSeverity'],
          Plant: props['d:Plant'],
          MitigationMeasures: props['d:MitigationMeasures'],
          Likelihood: props['d:Likelihood'],
          CreatedAt: props['d:RiskIdentificationDate']
        };
      });
    } catch (error) {
      console.error("Get Risks Error:", error);
      throw error;
    }
  }
};
