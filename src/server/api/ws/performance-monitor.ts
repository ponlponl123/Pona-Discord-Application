/**
 * WebSocket Performance Monitoring Utility
 * Track and log Socket.IO performance metrics
 */

import { Server } from 'socket.io';

export interface PerformanceMetrics {
  totalConnections: number;
  activeConnections: number;
  messagesSent: number;
  messagesReceived: number;
  averageLatency: number;
  peakConnections: number;
  namespaceCount: number;
  roomCount: number;
}

export class SocketPerformanceMonitor {
  private metrics: PerformanceMetrics;
  private latencies: number[] = [];
  private maxLatencyHistory = 1000;
  private startTime: number;

  constructor(private io: Server) {
    this.metrics = {
      totalConnections: 0,
      activeConnections: 0,
      messagesSent: 0,
      messagesReceived: 0,
      averageLatency: 0,
      peakConnections: 0,
      namespaceCount: 0,
      roomCount: 0,
    };
    this.startTime = Date.now();
    this.setupMonitoring();
  }

  private setupMonitoring() {
    // Monitor all namespaces
    this.io.of(/.*/).on('connection', (socket) => {
      this.metrics.totalConnections++;
      this.metrics.activeConnections++;

      if (this.metrics.activeConnections > this.metrics.peakConnections) {
        this.metrics.peakConnections = this.metrics.activeConnections;
      }

      // Track message metrics
      socket.onAny(() => {
        this.metrics.messagesReceived++;
      });

      socket.on('disconnect', () => {
        this.metrics.activeConnections--;
      });

      // Monitor latency with ping-pong
      const startPing = Date.now();
      socket.on('pong', () => {
        const latency = Date.now() - startPing;
        this.recordLatency(latency);
      });
    });

    // Track outgoing messages
    const originalEmit = this.io.emit.bind(this.io);
    this.io.emit = ((...args: Parameters<typeof originalEmit>) => {
      this.metrics.messagesSent++;
      return originalEmit(...args);
    }) as any;
  }

  private recordLatency(latency: number) {
    this.latencies.push(latency);
    if (this.latencies.length > this.maxLatencyHistory) {
      this.latencies.shift();
    }
    this.metrics.averageLatency =
      this.latencies.reduce((a, b) => a + b, 0) / this.latencies.length;
  }

  public getMetrics(): PerformanceMetrics {
    // Update namespace and room counts
    this.metrics.namespaceCount = this.io._nsps.size;
    let totalRooms = 0;
    this.io._nsps.forEach((namespace) => {
      totalRooms += namespace.adapter.rooms.size;
    });
    this.metrics.roomCount = totalRooms;

    return { ...this.metrics };
  }

  public logMetrics() {
    const metrics = this.getMetrics();
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);

    console.log('\n📊 Socket.IO Performance Metrics:');
    console.log(`   Uptime: ${uptime}s`);
    console.log(
      `   Active Connections: ${metrics.activeConnections} (Peak: ${metrics.peakConnections})`,
    );
    console.log(`   Total Connections: ${metrics.totalConnections}`);
    console.log(`   Messages Sent: ${metrics.messagesSent}`);
    console.log(`   Messages Received: ${metrics.messagesReceived}`);
    console.log(`   Average Latency: ${metrics.averageLatency.toFixed(2)}ms`);
    console.log(`   Namespaces: ${metrics.namespaceCount}`);
    console.log(`   Active Rooms: ${metrics.roomCount}`);
    console.log('');
  }

  public startPeriodicLogging(intervalMs: number = 60000) {
    setInterval(() => this.logMetrics(), intervalMs);
  }
}

export function enablePerformanceMonitoring(
  io: Server,
  logInterval?: number,
): SocketPerformanceMonitor {
  const monitor = new SocketPerformanceMonitor(io);
  if (logInterval) {
    monitor.startPeriodicLogging(logInterval);
  }
  return monitor;
}
