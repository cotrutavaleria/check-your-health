import { ApplicationConfig, Component, importProvidersFrom } from '@angular/core';
import { DatePipe, NgStyle, NgFor, NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [DatePipe, RouterLink, NgIf, NgFor, NgStyle, TranslateModule],
  standalone: true
})
export class FooterComponent {
  today: number = Date.now();
  hide!: boolean;
  constructor(private screenSize: BreakpointObserver, private translate: TranslateService) {
    this.resize();

    var language = localStorage.getItem('language');
    if (language) {
      this.translate.use(language);
    } else {
      this.translate.use('en');
    }

  }

  resize() {
    this.screenSize.observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.Small]).subscribe(result => {
      this.hide = false;
      if (result.matches) {
        this.hide = true;
      }
    })
  }
}

