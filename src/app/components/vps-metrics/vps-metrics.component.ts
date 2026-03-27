import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { VpsMetrics, VpsMetricPoint } from '../../models';

@Component({
  selector: 'app-vps-metrics',
  standalone: true,
  templateUrl: './vps-metrics.component.html',
  styleUrl: './vps-metrics.component.css',
  imports: [BaseChartDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VpsMetricsComponent {
  metrics = input.required<VpsMetrics>();

  cpuChart = computed(() => this.buildChart('CPU (%)', this.metrics().cpu, '#6366f1'));
  memoryChart = computed(() => this.buildChart('Memoria (MB)', this.metrics().memory, '#10b981'));
  diskChart = computed(() => this.buildDualChart('Lectura', this.metrics().diskRead, '#f59e0b', 'Escritura', this.metrics().diskWrite, '#ef4444'));
  networkChart = computed(() => this.buildDualChart('Entrada', this.metrics().networkIn, '#6366f1', 'Salida', this.metrics().networkOut, '#ef4444'));

  private buildChart(label: string, points: VpsMetricPoint[], color: string): ChartConfiguration<'line'> {
    return {
      type: 'line',
      data: {
        labels: points.map((p) => this.formatTime(p.timestamp)),
        datasets: [
          {
            label,
            data: points.map((p) => p.value),
            borderColor: color,
            backgroundColor: color + '1a',
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: this.chartOptions(),
    };
  }

  private buildDualChart(
    label1: string, points1: VpsMetricPoint[], color1: string,
    label2: string, points2: VpsMetricPoint[], color2: string,
  ): ChartConfiguration<'line'> {
    const labels = (points1.length ? points1 : points2).map((p) => this.formatTime(p.timestamp));
    return {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: label1,
            data: points1.map((p) => p.value),
            borderColor: color1,
            backgroundColor: color1 + '1a',
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            borderWidth: 2,
          },
          {
            label: label2,
            data: points2.map((p) => p.value),
            borderColor: color2,
            backgroundColor: color2 + '1a',
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      },
      options: this.chartOptions(),
    };
  }

  private chartOptions(): ChartConfiguration<'line'>['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: { color: '#94a3b8', font: { size: 11 } },
        },
      },
      scales: {
        x: {
          ticks: { color: '#64748b', font: { size: 10 }, maxTicksLimit: 8 },
          grid: { color: 'rgba(255,255,255,0.04)' },
        },
        y: {
          ticks: { color: '#64748b', font: { size: 10 } },
          grid: { color: 'rgba(255,255,255,0.04)' },
        },
      },
    };
  }

  private formatTime(ts: string): string {
    const d = new Date(ts);
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
}
