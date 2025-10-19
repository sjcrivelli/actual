export interface AppVersion {
  version: string;
  buildDate: string;
  environment: 'development' | 'production';
}

export interface SystemLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: string;
}
