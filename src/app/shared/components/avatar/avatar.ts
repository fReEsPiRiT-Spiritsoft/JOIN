import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Avatar Component - Zeigt Initialen in einem farbigen Kreis
 * Wiederverwendbar für Contacts, Board Tasks, Header
 */
@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
})
export class Avatar {
  /** Initialen die angezeigt werden (z.B. "EM", "BZ") */
  @Input() initials: string = '';

  /** Hintergrundfarbe des Avatars (Hex-Code) */
  @Input() backgroundColor: string = '#2A3647';

  /** Größe des Avatars */
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  /** Optionaler Name für Tooltip */
  @Input() name?: string;
}
