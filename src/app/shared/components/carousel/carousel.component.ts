import { Component, ChangeDetectionStrategy, input, signal, computed, OnInit, OnDestroy } from '@angular/core';

export interface CarouselImage { src: string; alt: string; }

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselComponent implements OnInit, OnDestroy {
  images = input<CarouselImage[]>([]);
  autoPlay = input(false);
  interval = input(4000);
  currentIndex = signal(0);
  private intervalId: ReturnType<typeof setInterval> | null = null;
  totalSlides = computed(() => this.images().length);
  translateX = computed(() => `translateX(-${this.currentIndex() * 100}%)`);

  ngOnInit(): void { if (this.autoPlay()) this.startAutoPlay(); }
  ngOnDestroy(): void { this.stopAutoPlay(); }
  next(): void { const t = this.totalSlides(); if (t) this.currentIndex.update(i => (i + 1) % t); }
  prev(): void { const t = this.totalSlides(); if (t) this.currentIndex.update(i => (i - 1 + t) % t); }
  goTo(index: number): void { this.currentIndex.set(index); }
  onMouseEnter(): void { this.stopAutoPlay(); }
  onMouseLeave(): void { if (this.autoPlay()) this.startAutoPlay(); }
  private startAutoPlay(): void { this.stopAutoPlay(); this.intervalId = setInterval(() => this.next(), this.interval()); }
  private stopAutoPlay(): void { if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; } }
}