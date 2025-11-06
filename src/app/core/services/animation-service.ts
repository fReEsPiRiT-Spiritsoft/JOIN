import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AnimationService {
  private hasPlayedIntro = false;

  shouldPlayIntro(): boolean {
    return !this.hasPlayedIntro;
  }

  markIntroAsPlayed(): void {
    this.hasPlayedIntro = true;
  }

  resetIntro(): void {
    this.hasPlayedIntro = false;
  }
}
