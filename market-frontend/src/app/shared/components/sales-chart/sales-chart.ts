import { Component, effect, ElementRef, inject, Input, signal } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-sales-chart',
  imports: [],
  templateUrl: './sales-chart.html',
  styleUrl: './sales-chart.css',
})
export class SalesChart {
  private el = inject(ElementRef);

  @Input({ required: true }) data!: { date: string; total: number }[];

  private chart = signal<echarts.ECharts | null>(null);

  ngAfterViewInit() {
    const instance = echarts.init(this.el.nativeElement.firstChild);
    this.chart.set(instance);

    effect(() => {
      if (!this.chart() || !this.data) return;

      this.chart()!.setOption({
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: this.data.map(d => d.date),
        },
        yAxis: { type: 'value' },
        series: [
          {
            data: this.data.map(d => d.total),
            type: 'line',
            smooth: true,
            areaStyle: {},
          },
        ],
      });
    });
  }
}
