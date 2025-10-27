import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ProgressBar Component - Zeigt einen Fortschrittsbalken an
 * Wiederverwendbar für Subtasks und andere Progress-Anzeigen
 */
@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss',
})
export class ProgressBar {
  /** Fortschritt in Prozent (0-100) */
  @Input() progress: number = 0;

  /** Farbe der Fortschrittsanzeige */
  @Input() color: string = '#4589ff';

  /** Höhe des Progress Bars */
  @Input() height: 'small' | 'medium' = 'small';

  /** Optionaler Text der angezeigt wird */
  @Input() label?: string;

  get progressPercentage(): number {
    return Math.min(Math.max(this.progress, 0), 100);
  }
}
