import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationService } from '../../core/services/animation-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  imports: [CommonModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage implements OnInit, OnDestroy {
  constructor(private router: Router, private animationService: AnimationService) {}

  ngOnInit(): void {
    const shouldAnimate = this.animationService.shouldPlayIntro();

    if (shouldAnimate) {
      setTimeout(() => {
        this.animationService.markIntroAsPlayed();
        this.router.navigate(['/login']);
      }, 2000);
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {}
}
