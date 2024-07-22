import { ChangeDetectorRef, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'licenta-proiect';
  constructor(private translate: TranslateService, private cd: ChangeDetectorRef){
    var language = localStorage.getItem('language');
    if (language){
      this.translate.use(language);
    }else{
      this.translate.use('en');
    }
  }
}
