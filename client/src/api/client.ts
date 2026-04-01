import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Stats {
  totalDocuments: number;
  totalTemplates: number;
  pendingJobs: number;
  processingJobs: number;
  completedJobs: number;
  failedJobs: number;
}

export interface Document {
  id: string;
  title: string;
  type: string;
  status: string;
  pages: number;
  createdAt: string;
  updatedAt: string;
  fileSize: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  paperSize: string;
  orientation: string;
  colorMode: string;
  createdAt: string;
}

export interface PrintJob {
  id: string;
  documentId: string;
  documentTitle: string;
  templateId: string;
  templateName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  copies: number;
  submittedAt: string;
  completedAt: string | null;
  submittedBy: string;
  printer: string;
}

export interface CreatePrintJobData {
  documentId: string;
  templateId: string;
  copies: number;
  submittedBy?: string;
  printer?: string;
}

export const fetchStats = async (): Promise<Stats> => {
  const res = await apiClient.get<Stats>('/stats');
  return res.data;
};

export const fetchDocuments = async (): Promise<Document[]> => {
  const res = await apiClient.get<Document[]>('/documents');
  return res.data;
};

export const fetchTemplates = async (): Promise<Template[]> => {
  const res = await apiClient.get<Template[]>('/templates');
  return res.data;
};

export const fetchPrintJobs = async (status?: string): Promise<PrintJob[]> => {
  const params = status ? { status } : {};
  const res = await apiClient.get<PrintJob[]>('/print-jobs', { params });
  return res.data;
};

export const createPrintJob = async (data: CreatePrintJobData): Promise<PrintJob> => {
  const res = await apiClient.post<PrintJob>('/print-jobs', data);
  return res.data;
};

export const updatePrintJobStatus = async (id: string, status: string): Promise<PrintJob> => {
  const res = await apiClient.put<PrintJob>(`/print-jobs/${id}/status`, { status });
  return res.data;
};

export const deletePrintJob = async (id: string): Promise<void> => {
  await apiClient.delete(`/print-jobs/${id}`);
};

export default apiClient;
