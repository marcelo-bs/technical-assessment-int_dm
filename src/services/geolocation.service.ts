import axios, { AxiosResponse } from 'axios';

interface IGeolocationResponse {
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    formatted_address: string;
  }[];
}

class GeolocationService {
  async getCoordinates(address: string): Promise<number[]> {
    const response: AxiosResponse<IGeolocationResponse> = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBGpN2vzVSYntzTSpOZd21qgLnK-2qO_e4`);
    
    const { lat, lng } = response.data.results[0].geometry.location;
    return [lng, lat];
  }

  async getAddress(coordinates: number[]): Promise<string> {
    const [lng, lat] = coordinates;
    const response: AxiosResponse<IGeolocationResponse> = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBGpN2vzVSYntzTSpOZd21qgLnK-2qO_e4`);
    return response.data.results[0].formatted_address;
  }
}

export default new GeolocationService();