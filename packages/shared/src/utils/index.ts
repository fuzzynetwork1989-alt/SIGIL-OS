// NEXORA Omega Shared Utilities

import { v4 as uuidv4 } from 'uuid';

export function generateId(): string {
  return uuidv4();
}

export function generateCorrelationId(): string {
  return `corr_${uuidv4()}`;
}

export function getCurrentTimestamp(): Date {
  return new Date();
}

export function calculateConfidence(sources: any[]): number {
  if (sources.length === 0) return 0;
  const totalConfidence = sources.reduce((sum, source) => sum + (source.confidence || 0), 0);
  return totalConfidence / sources.length;
}

export function isExpired(expiryDate?: Date): boolean {
  if (!expiryDate) return false;
  return new Date() > expiryDate;
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  return fn().catch((error) => {
    if (maxRetries <= 0) throw error;
    return new Promise((resolve) =>
      setTimeout(() => resolve(retry(fn, maxRetries - 1, delay * 2)), delay)
    );
  });
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function mergeDeep<T extends Record<string, any>>(...objects: T[]): T {
  const result = {} as T;
  for (const obj of objects) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          result[key] = mergeDeep(result[key] || {}, obj[key]);
        } else {
          result[key] = obj[key];
        }
      }
    }
  }
  return result;
}

export function maskSensitiveData(data: string, maskChar: string = '*'): string {
  if (data.length <= 4) return maskChar.repeat(data.length);
  return data.substring(0, 2) + maskChar.repeat(data.length - 4) + data.substring(data.length - 2);
}

export function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)(ms|s|m|h)$/);
  if (!match) return 0;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 'ms': return value;
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    default: return 0;
  }
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60 * 1000) return `${Math.floor(ms / 1000)}s`;
  if (ms < 60 * 60 * 1000) return `${Math.floor(ms / (60 * 1000))}m`;
  return `${Math.floor(ms / (60 * 60 * 1000))}h`;
}