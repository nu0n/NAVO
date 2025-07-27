const MAPBOX_TOKEN = 'pk.eyJ1IjoibmxvcmU5NyIsImEiOiJjbWEyc3drenkydXk1Mmlwc3doNnBmb2RyIn0.zzqVPC1APmp9RsvWeMAf1g';

export async function getAddressFromCoords(lat: number, lng: number): Promise<string | null> {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data.features[0]?.place_name || null;
}

export async function searchNearbyParks(lat: number, lng: number, category: string = 'park', limit: number = 5): Promise<Array<{ name: string; address: string; coordinates: [number, number] }>> {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(category)}.json?proximity=${lng},${lat}&types=poi&limit=${limit}&access_token=${MAPBOX_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.features.map((f: any) => ({
    name: f.text,
    address: f.place_name,
    coordinates: f.geometry.coordinates
  }));
}

export async function searchNearbyPOIs(lat: number, lng: number, limit: number = 5): Promise<Array<{ name: string; address: string; coordinates: [number, number], category: string }>> {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/poi.json?proximity=${lng},${lat}&types=poi&limit=${limit}&access_token=${MAPBOX_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.features.map((f: any) => ({
    name: f.text,
    address: f.place_name,
    coordinates: f.geometry.coordinates,
    category: f.properties?.category || 'poi'
  }));
} 