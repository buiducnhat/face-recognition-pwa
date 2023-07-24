export type TBenchmarkResult = {
  name: string;
  totalSentBytes: number;
  totalReceivedBytes: number;
  totalResponseTime: number;
  totalRequests: number;
  maxResponseTime: number;
  minResponseTime: number;
  averageResponseTime: number;
  totalSuccessRequests: number;
  totalFailedRequests: number;
};
