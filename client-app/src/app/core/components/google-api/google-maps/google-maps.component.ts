import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { HospitalCoordinatesResponse } from 'src/app/shared/responses/hospital-coordinates-response.model';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})
export class GoogleMapsComponent {
  constructor(private toastr: ToastrService, private httpClient: HttpClient) { }

  @ViewChild(GoogleMap, { static: false }) doctorsLocationMap: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) mapInfoWindow: MapInfoWindow;

  mapLoading = false;

  formattedHospitalAdress?: string | null = null;
  hospitalAdress: string;

  zoomValue = 12;
  mapCenter: google.maps.LatLng;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 18,
    minZoom: 8,
  };
  markerInfoContent = '';
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    animation: google.maps.Animation.DROP,
  };
  ngOnInit() {
    // this.getMyLocation();
  }

  zoomIn() {
    if (this.zoomValue < this.mapOptions.maxZoom) this.zoomValue++;
  }

  zoomOut() {
    if (this.zoomValue > this.mapOptions.minZoom) this.zoomValue--;
  }


  openInfoWindow(marker: MapMarker) {
    this.mapInfoWindow.open(marker);
  }

  getMyLocation() {
    this.mapLoading = true;
    if (!navigator.geolocation) {
      console.log("Location is not supported by your browser.");
    }
    navigator.geolocation.getCurrentPosition(
      (hospitalPosition: GeolocationPosition) => {
        this.mapLoading = false;
        const marker: google.maps.LatLngLiteral = {
          lat: hospitalPosition.coords.latitude,
          lng: hospitalPosition.coords.longitude,
        };
        console.log(marker);
        this.mapCenter = new google.maps.LatLng(marker);
        setTimeout(() => {
          if (this.doctorsLocationMap !== undefined) {
            this.doctorsLocationMap.panTo(marker);
          }
        }, 500);
        this.markerInfoContent = "I'm here!"
        this.markerOptions = {
          draggable: false,
          animation: google.maps.Animation.DROP,
        };
      },
      (error) => {
        this.mapLoading = true;
        if (error.PERMISSION_DENIED) {
          this.toastr.error("Couldn't find your location.", 'DENIED');
        } else if (error.POSITION_UNAVAILABLE) {
          this.toastr.error(
            "Couldn't find your location.",
            'UNAVAILABLE'
          );
        } else if (error.TIMEOUT) {
          this.toastr.error("Couldn't find your location.", 'EXPIRED');
        } else {
          this.toastr.error(error.message, `Error: ${error.code}`);
        }
      },
      { enableHighAccuracy: true }
    );
  }


  getLocation(address: string): Observable<HospitalCoordinatesResponse> {
    const url = `https://maps.google.com/maps/api/geocode/json?address=${address}&region=RO&language=ro&sensor=false&key=AIzaSyC44l94B7j7Q8XtZCBfWyV8mKJnCIoTdgw`;
    return this.httpClient.get<HospitalCoordinatesResponse>(url);
  }

  findAddress(hospitalAdress: string) {
    if (!hospitalAdress || hospitalAdress.length === 0) {
      return;
    }
    this.mapLoading = true;
    this.getLocation(hospitalAdress).subscribe(
      (geocodingResult: HospitalCoordinatesResponse) => {
        if (geocodingResult.status === 'OK' && geocodingResult.results?.length) {
          const locationInfo = geocodingResult.results[0];
          const coordinates: any = locationInfo.geometry.location;
          const marker = new google.maps.LatLng(
            coordinates.lat,
            coordinates.lng
          );
          this.mapCenter = new google.maps.LatLng(marker);
          setTimeout(() => {
            if (this.doctorsLocationMap !== undefined) {
              this.doctorsLocationMap.panTo(locationInfo.geometry.location);
            }
          }, 500);
          this.markerOptions = {
            draggable: false,
            animation: google.maps.Animation.DROP,
          };
          this.mapLoading = false;
          this.hospitalAdress = locationInfo.formatted_address;
          this.formattedHospitalAdress = locationInfo.formatted_address;
          this.markerInfoContent = `<div>
          <p>${locationInfo.formatted_address}</p>
          <a href="https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}" target="_blank">View on Google Maps</a>
        </div>`;
          this.markerOptions = {
            draggable: true,
            animation: google.maps.Animation.DROP,
          };
        } else {
          this.toastr.error(geocodingResult.exception, geocodingResult.status);
        }
      },
      (err: HttpErrorResponse) => {
        console.error('geocoder error', err);
      }
    )
      .add(() => {
        this.mapLoading = false;
      });
  }
}
