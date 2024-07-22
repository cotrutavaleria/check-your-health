export class HospitalCoordinatesResponse {
    status: string;
    exception: string;
    results: google.maps.GeocoderResult[];
  
    constructor(status: string, results: google.maps.GeocoderResult[]) {
      this.status = status;
      this.results = results;
    }
  }