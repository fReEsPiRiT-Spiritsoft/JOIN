import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from './shared/components/header/header';
import { Navbar } from './shared/components/navbar/navbar';
import { ContactService } from './core/services/db-contact-service';
import { ContactHelper, Contact } from './core/interfaces/db-contact-interface';
import { AnimationService } from './core/services/animation-service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Navbar, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  contacts: Contact[] = [];
  showNavigation = false;
  showLogo = false;
  logoAnimating = false;

  private contactService = inject(ContactService);
  private router = inject(Router);
  private animationService = inject(AnimationService);

  async ngOnInit() {
    this.checkRoute(this.router.url);

    this.contactService.getAllContacts().then((contacts) => {
      this.contacts = contacts;
    });

    if (this.router.url === '/' && this.animationService.shouldPlayIntro()) {
      this.logoAnimating = true;
      this.showLogo = true;

      setTimeout(() => {
        this.logoAnimating = false;
      }, 2000);
    } else if (this.router.url === '/login' || this.router.url === '/signup') {
      this.showLogo = true;
      this.logoAnimating = false;
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkRoute(event.url);
      });
  }

  private checkRoute(url: string) {
    const authRoutes = ['/', '/login', '/signup'];
    this.showNavigation = !authRoutes.includes(url);

    this.showLogo = authRoutes.includes(url);
  }
}
