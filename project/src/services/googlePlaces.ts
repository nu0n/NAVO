const GOOGLE_PLACES_API_KEY = 'AIzaSyBHa6CZQl2e8C9ytRJfql-fPCI3ZlnoKuA';

export async function searchNearbyGooglePlaces(lat: number, lng: number, type: string = 'park', limit: number = 5): Promise<Array<{ name: string; address: string; coordinates: [number, number]; type: string }>> {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return (data.results || []).slice(0, limit).map((place: any) => ({
    name: place.name,
    address: place.vicinity,
    coordinates: [place.geometry.location.lng, place.geometry.location.lat],
    type
  }));
}

export function searchNearbyGooglePlacesWithSDK(lat: number, lng: number, type: string = 'park', limit: number = 5): Promise<Array<{ name: string; address: string; coordinates: [number, number]; type: string }>> {
  return new Promise((resolve, reject) => {
    const gmaps = (window as any).google;
    if (!gmaps || !gmaps.maps) {
      reject('Google Maps JS SDK not loaded');
      return;
    }
    const map = new gmaps.maps.Map(document.createElement('div'));
    const service = new gmaps.maps.places.PlacesService(map);
    const request = {
      location: new gmaps.maps.LatLng(lat, lng),
      radius: 5000,
      type,
    };
    service.nearbySearch(request, (results: any[], status: string) => {
      if (status === gmaps.maps.places.PlacesServiceStatus.OK) {
        resolve(
          results.slice(0, limit).map((place: any) => ({
            name: place.name,
            address: place.vicinity,
            coordinates: [place.geometry.location.lng(), place.geometry.location.lat()],
            type,
          }))
        );
      } else {
        resolve([]);
      }
    });
  });
} 