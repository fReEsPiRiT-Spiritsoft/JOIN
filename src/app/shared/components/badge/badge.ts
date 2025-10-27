import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Badge Component - Zeigt farbige Labels/Tags an
 * Verwendet für Task Categories (User Story, Technical Task)
 */
@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {
  /** Text der im Badge angezeigt wird */
  @Input() text: string = '';

  /** Variante des Badges (bestimmt die Farbe) */
  @Input() variant: 'user-story' | 'technical-task' | 'default' = 'default';
}
