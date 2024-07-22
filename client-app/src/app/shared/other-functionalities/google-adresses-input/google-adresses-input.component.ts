import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export interface AddressInputResponse {
  address: string;
  name?: string;
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@Component({
  selector: 'app-google-adresses-input',
  templateUrl: './google-adresses-input.component.html',
  styleUrls: ['./google-adresses-input.component.css'],
})


export class GoogleAdressesInputComponent implements OnInit {
  @ViewChild('field')
  field!: ElementRef;

  @Input() placeholderText: string | null;

  @Input() value: string | null;

  @Input() sourcePage: string;

  @Output() placeTyped = new EventEmitter<AddressInputResponse>();

  addressAutocomplete: google.maps.places.Autocomplete | undefined;

  listener: any;

  constructor(private ngZone: NgZone, private translate: TranslateService) { }

  ngOnInit() { 
  }
  ngAfterViewInit() {
    this.addressAutocomplete = new google.maps.places.Autocomplete(
      this.field.nativeElement
    );
    this.addressAutocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const addressName = this.addressAutocomplete?.getPlace();
        const result: AddressInputResponse = {
          address: this.field.nativeElement.value,
          name: addressName?.name,
        };
        this.placeTyped.emit(result);
      });
    });
  }

  ngOnDestroy() {
    if (this.addressAutocomplete) {
      google.maps.event.clearInstanceListeners(this.addressAutocomplete);
    }
  }
}