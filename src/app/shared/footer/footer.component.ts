import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  newsletterEmail: string = '';
  subscribed: boolean = false;

  subscribeNewsletter(): void {
    if (this.newsletterEmail && this.newsletterEmail.includes('@')) {
      this.subscribed = true;
      setTimeout(() => {
        this.subscribed = false;
        this.newsletterEmail = '';
      }, 5000);
    }
  }
}
