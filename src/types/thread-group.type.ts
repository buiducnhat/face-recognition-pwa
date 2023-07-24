export type TNV = {
  name: string;
  value: string;
};

export type TEndPoint = {
  name: string;
  description?: string;
  protocol: 'http' | 'https';
  host: string;
  port: number;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Array<TNV>;
  params: Array<TNV>;
  body: string;
};

export type TConfig = {
  numThreads: number;
  rampTime: number;
  loopCount: number;
};

export type TThreadGroup = {
  id: string;
  name: string;
  config: TConfig;
  envs: Array<TNV>;
  endpoints: TEndPoint[];
};
