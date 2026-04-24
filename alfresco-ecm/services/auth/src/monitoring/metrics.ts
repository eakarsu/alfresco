import { logger } from '../utils/logger';

export interface MetricsConfig {
  enabled: boolean;
  port: number;
  path: string;
}

function getMetricsConfig(): MetricsConfig {
  return {
    enabled: process.env.METRICS_ENABLED !== 'false',
    port: parseInt(process.env.METRICS_PORT || '9090', 10),
    path: process.env.METRICS_PATH || '/metrics',
  };
}

// Simple in-memory metrics counters
const counters: Record<string, number> = {};
const histograms: Record<string, number[]> = {};

/**
 * Increment a named counter.
 */
export function incrementCounter(name: string, value: number = 1): void {
  counters[name] = (counters[name] || 0) + value;
}

/**
 * Record a value in a named histogram.
 */
export function recordHistogram(name: string, value: number): void {
  if (!histograms[name]) {
    histograms[name] = [];
  }
  histograms[name].push(value);
}

/**
 * Get all current metric values.
 */
export function getMetrics(): Record<string, unknown> {
  return {
    counters: { ...counters },
    histograms: Object.fromEntries(
      Object.entries(histograms).map(([name, values]) => [
        name,
        {
          count: values.length,
          min: values.length > 0 ? Math.min(...values) : 0,
          max: values.length > 0 ? Math.max(...values) : 0,
          avg: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
        },
      ])
    ),
  };
}

/**
 * Start the metrics server.
 * Stub implementation -- in production, integrate with Prometheus client
 * (prom-client) or a similar metrics library.
 */
export function startMetricsServer(): void {
  const config = getMetricsConfig();

  if (!config.enabled) {
    logger.info('Metrics server is disabled');
    return;
  }

  logger.info(`Starting metrics server on port ${config.port}...`);

  // TODO: Replace with actual Prometheus metrics server
  // import express from 'express';
  // import { collectDefaultMetrics, register } from 'prom-client';
  //
  // collectDefaultMetrics();
  // const metricsApp = express();
  // metricsApp.get(config.path, async (req, res) => {
  //   res.set('Content-Type', register.contentType);
  //   res.end(await register.metrics());
  // });
  // metricsApp.listen(config.port);

  logger.info(`[STUB] Metrics server would be running on port ${config.port} at ${config.path}`);
}
