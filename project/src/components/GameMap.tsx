import React, { useCallback, useEffect, useRef, useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl';
import { useGameStore } from '../store/gameStore';
import { Sign, MapViewState } from '../types';
import { MapPin, Heart, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchNearbyParks, searchNearbyPOIs } from '../services/geoPlaces';
import { searchNearbyGooglePlacesWithSDK } from '../services/googlePlaces';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibmxvcmU5NyIsImEiOiJjbWEyc3drenkydXk1Mmlwc3doNnBmb2RyIn0.zzqVPC1APmp9RsvWeMAf1g';
const MAPBOX_STYLE = 'mapbox://styles/mapbox/streets-v12';

const getMarkerIcon = (sign: Sign) => {
  const iconMap = {
    poi: '🎯',
    danger: '⚠️',
    group: '👥',
    safe: '🛡️',
    resource: '🏪',
    event: '🎉',
    route: '🛣️',
    warning: '🚨',
    civic: '🏛️',
    environmental: '🌱',
    community: '🤝',
    petition: '📝',
    art: '🖼️',
    movie: '🎬',
    shopping: '🛒',
    coffee: '☕',
    fuel: '⛽',
    health: '💊',
    bank: '🏦',
    nightlife: '🍸',
    study: '📚',
    emergency: '🚑',
    culture: '🎭',
    food: '🍽️',
  };
  return iconMap[sign.category] || '📍';
};

const getMarkerColor = (sign: Sign) => {
  const colorMap = {
    poi: '#3B82F6',
    danger: '#EF4444',
    group: '#10B981',
    safe: '#059669',
    resource: '#8B5CF6',
    event: '#F97316',
    route: '#6366F1',
    warning: '#EAB308',
    civic: '#10B981',
    environmental: '#059669',
    community: '#8B5CF6',
    petition: '#F97316'
  };
  return colorMap[sign.category] || '#6B7280';
};

const getSeverityPulse = (sign: Sign) => 
  (sign.category === 'danger' || sign.category === 'warning') && 
  (sign.severity === 'critical' || sign.severity === 'high') ? 'animate-pulse' : '';

const MemoizedMarker = React.memo(({ sign, onSignClick, getUserAvatarEmoji, onHover }: {
  sign: Sign;
  onSignClick: (sign: Sign) => void;
  getUserAvatarEmoji: () => string;
  onHover?: (sign: Sign | null) => void;
}) => (
  <Marker longitude={sign.longitude} latitude={sign.latitude} anchor="bottom">
    <div
      className="cursor-pointer relative transform hover:scale-110 transition-transform duration-200"
      onClick={() => onSignClick(sign)}
      onMouseEnter={() => onHover && onHover(sign)}
      onMouseLeave={() => onHover && onHover(null)}
    >
      <div className={`relative ${getSeverityPulse(sign)}`}>
        {sign.zoneType === 'area' && (
          <div 
            className="absolute -inset-4 rounded-full border-2 border-dashed opacity-50"
            style={{ borderColor: getMarkerColor(sign) }}
          />
        )}
        
        <div
          className="w-12 h-12 rounded-full shadow-xl border-3 border-white flex items-center justify-center relative"
          style={{ backgroundColor: getMarkerColor(sign) }}
        >
          <span className="text-xl">{getMarkerIcon(sign)}</span>
          
          {(sign.category === 'danger' || sign.category === 'warning') && (
            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
              sign.severity === 'critical' ? 'bg-red-500 animate-pulse' :
              sign.severity === 'high' ? 'bg-orange-500 animate-pulse' :
              'bg-yellow-500'
            }`} />
          )}
        </div>
      </div>
    </div>
  </Marker>
));

const MemoizedUserMarker = React.memo(({ userLocation, getUserAvatarEmoji }: {
  userLocation: [number, number];
  getUserAvatarEmoji: () => string;
}) => (
  <Marker longitude={userLocation[0]} latitude={userLocation[1]} anchor="center">
    <div className="relative z-[9999]">
      <div className="text-4xl drop-shadow-lg filter">
        {getUserAvatarEmoji()}
      </div>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-black/30 rounded-full blur-sm" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-400/30 rounded-full animate-ping" />
    </div>
  </Marker>
));

// Creative sign types and their associated place types
const CREATIVE_SIGN_TYPES = [
  { key: 'daily_challenge', placeType: 'park' },
  { key: 'event', placeType: 'bar' },
  { key: 'safety', placeType: 'hospital' },
  { key: 'social', placeType: 'cafe' },
  { key: 'resource', placeType: 'library' },
  { key: 'hidden_gem', placeType: 'restaurant' },
  { key: 'seasonal', placeType: 'park' },
  { key: 'food', placeType: 'restaurant' },
  { key: 'coffee', placeType: 'cafe' },
  { key: 'fuel', placeType: 'gas_station' },
  { key: 'nature', placeType: 'park' },
  { key: 'culture', placeType: 'museum' },
  { key: 'health', placeType: 'pharmacy' },
  { key: 'shopping', placeType: 'supermarket' },
  { key: 'finance', placeType: 'atm' },
  { key: 'bank', placeType: 'bank' },
  { key: 'nightlife', placeType: 'bar' },
  { key: 'study', placeType: 'library' },
  { key: 'emergency', placeType: 'hospital' },
  { key: 'art', placeType: 'art_gallery' },
  { key: 'movie', placeType: 'movie_theater' },
];

function pickCreativeSignType(mode: 'daily' | 'random' = 'daily') {
  if (mode === 'daily') {
    // Deterministic pick based on date
    const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const hash = day.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return CREATIVE_SIGN_TYPES[hash % CREATIVE_SIGN_TYPES.length];
  } else {
    // Random pick
    return CREATIVE_SIGN_TYPES[Math.floor(Math.random() * CREATIVE_SIGN_TYPES.length)];
  }
}

function createCreativeSign(place: any, signType: { key: string; placeType: string }) {
  switch (signType.key) {
    case 'daily_challenge':
      return {
        title: '🎯 Daily Challenge',
        description: `Take a selfie at the nearest ${place.type}: ${place.name}!`,
        ...place
      };
    case 'event':
      return {
        title: '🎉 Trivia Night!',
        description: `Trivia Night at ${place.name} tonight! Join the fun.`,
        ...place
      };
    case 'safety':
      return {
        title: '🛡️ Safety Nearby',
        description: `Nearest ${place.type} in case of emergency: ${place.name}.`,
        ...place
      };
    case 'social':
      return {
        title: '🤝 Social Spot',
        description: `Meet other players at ${place.name}!`,
        ...place
      };
    case 'resource':
      return {
        title: '📶 Free WiFi',
        description: `Free WiFi available at ${place.name}.`,
        ...place
      };
    case 'hidden_gem':
      return {
        title: '💎 Hidden Gem',
        description: `Discover this local favorite: ${place.name}.`,
        ...place
      };
    case 'seasonal':
      return {
        title: '🎄 Holiday Lights',
        description: `Holiday lights at ${place.name}!`,
        ...place
      };
    default:
      return {
        title: `📍 ${place.name}`,
        description: place.address,
        ...place
      };
  }
}

// Utility to calculate distance in meters between two [lng, lat] points
function getDistanceMeters([lng1, lat1]: [number, number], [lng2, lat2]: [number, number]) {
  const R = 6371000; // meters
  const toRad = (deg: number) => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Add a function to generate a cryptic description
function getCrypticDescription(sign: Sign) {
  if (sign.category === 'civic') return 'A civic mystery awaits here...';
  if (sign.category === 'poi') return 'A point of interest with secrets to uncover.';
  if (sign.category === 'event') return 'Something special is happening soon.';
  if (sign.category === 'safe') return 'A place of safety, but why?';
  if (sign.category === 'resource') return 'Resources may be found here.';
  if (sign.category === 'danger') return 'Caution: something unusual lurks.';
  if (sign.category === 'group') return 'A gathering spot for the curious.';
  if (sign.category === 'hidden_gem') return 'A hidden gem, only for explorers.';
  if (sign.category === 'environmental') return 'Nature has a message for you.';
  if (sign.category === 'community') return 'Community energy is strong here.';
  if (sign.category === 'petition') return 'A cause needs your support.';
  return 'There is more to discover at this location...';
}

export const GameMap = forwardRef((props, ref) => {
  const { 
    signs, 
    userLocation, 
    mapViewState, 
    selectedSign, 
    user,
    setUserLocation, 
    setMapViewState, 
    setSelectedSign,
    likeSign,
    setSigns
  } = useGameStore();
  
  const mapRef = useRef<any>(null);

  const handleMapMove = useCallback((evt: any) => setMapViewState(evt.viewState), [setMapViewState]);
  const handleGeolocate = useCallback((evt: any) => {
    const { longitude, latitude } = evt.coords;
    setUserLocation([longitude, latitude]);
  }, [setUserLocation]);

  const handleSignClick = useCallback((sign: Sign) => {
    setSelectedSign(sign);
  }, [setSelectedSign]);

  const handleLikeSign = useCallback((e: React.MouseEvent, signId: string) => {
    e.stopPropagation();
    likeSign(signId);
  }, [likeSign]);

  const getUserAvatarEmoji = useCallback(() => 
    user?.avatar.customization.emoji || '🚶', [user?.avatar.customization.emoji]);

  const handleMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (map) {
      map.on('idle', () => {
      });
    }
  }, []);

  const getAreaZoneData = useCallback((sign: Sign) => {
    if (sign.zoneType !== 'area' || !sign.radius) return null;
    
    const center = [sign.longitude, sign.latitude];
    const radiusInKm = sign.radius / 1000;
    const points = 32;
    const coordinates = [];
    
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const dx = radiusInKm * Math.cos(angle) / 111.32;
      const dy = radiusInKm * Math.sin(angle) / 110.54;
      coordinates.push([center[0] + dx, center[1] + dy]);
    }
    coordinates.push(coordinates[0]);
    
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates]
      }
    };
  }, []);

  const areaZones = useMemo(() => 
    signs
      .filter(sign => sign.zoneType === 'area' && sign.radius)
      .map(sign => ({ sign, data: getAreaZoneData(sign) }))
  , [signs, getAreaZoneData]);

  const [hoveredSign, setHoveredSign] = useState<Sign | null>(null);

  const signMarkers = useMemo(() => 
    signs.map((sign) => (
      <MemoizedMarker
        key={sign.id}
        sign={sign}
        onSignClick={handleSignClick}
        getUserAvatarEmoji={getUserAvatarEmoji}
        onHover={setHoveredSign}
      />
    ))
  , [signs, handleSignClick, getUserAvatarEmoji]);

  useEffect(() => {
    async function maybeAddFriendlyParkSign() {
      console.log('[DEBUG] maybeAddFriendlyParkSign effect running');
      console.log('[DEBUG] userLocation:', userLocation);
      if (!userLocation) return;
      const nearbySigns = signs.filter(sign => {
        const dx = (sign.longitude - userLocation[0]) * 111320;
        const dy = (sign.latitude - userLocation[1]) * 110540;
        return Math.sqrt(dx*dx + dy*dy) < 500;
      });
      console.log('[DEBUG] Nearby signs within 500m:', nearbySigns.length, nearbySigns);
      if (nearbySigns.length === 0) {
        // NEW: Try to add a variety of creative signs, one per type
        let creativeSigns: any[] = [];
        for (const signType of CREATIVE_SIGN_TYPES) {
          try {
            const places = await searchNearbyGooglePlacesWithSDK(userLocation[1], userLocation[0], signType.placeType, 1);
            console.log(`[DEBUG] Google SDK search for type '${signType.key}' (${signType.placeType}):`, places);
            if (places.length > 0) {
              const place = places[0];
              const sign = createCreativeSign(place, signType);
              // Assign a unique category for each creative sign type
              const signTypeCategoryMap: Record<string, Sign['category']> = {
                daily_challenge: 'event',
                event: 'event',
                safety: 'safe',
                social: 'group',
                resource: 'resource',
                hidden_gem: 'poi',
                seasonal: 'event',
                food: 'poi',
                coffee: 'poi',
                fuel: 'resource',
                nature: 'environmental',
                culture: 'civic',
                health: 'safe',
                shopping: 'resource',
                finance: 'resource',
                bank: 'resource',
                nightlife: 'event',
                study: 'resource',
                emergency: 'safe',
                art: 'civic',
                movie: 'event',
              };
              const category = signTypeCategoryMap[signType.key] || 'poi';
              creativeSigns.push({
                id: `google-sdk-${signType.key}-${place.coordinates.join('-')}`,
                latitude: place.coordinates[1],
                longitude: place.coordinates[0],
                likes: 0,
                isHighlighted: false,
                createdBy: 'System',
                createdAt: new Date(),
                category,
                zoneType: 'point' as const,
                alertDistance: 100,
                severity: 'low' as const,
                isActive: true,
                ...sign
              });
            } else {
              console.log(`[DEBUG] No Google Places found for type '${signType.key}' (${signType.placeType})`);
            }
          } catch (err) {
            console.log(`[DEBUG] Google SDK search error for ${signType.key}:`, err);
          }
        }
        if (creativeSigns.length > 0) {
          setSigns([...signs, ...creativeSigns]);
          console.log('[DEBUG] Creative signs added from Google SDK:', creativeSigns);
          return;
        }
        // 3. Fallback to Mapbox parks
        let parks = await searchNearbyParks(userLocation[1], userLocation[0], 'park', 5);
        console.log('[DEBUG] Parks returned from Mapbox:', parks);
        if (parks.length > 0) {
          const parkSigns = parks.map(park => ({
            id: `friendly-park-${park.coordinates.join('-')}`,
            title: `🌳 Community Activity at ${park.name}`,
            description: `Join a friendly activity at ${park.address}!`,
            latitude: park.coordinates[1],
            longitude: park.coordinates[0],
            likes: 0,
            isHighlighted: false,
            createdBy: 'System',
            createdAt: new Date(),
            category: 'civic' as const,
            zoneType: 'point' as const,
            alertDistance: 100,
            severity: 'low' as const,
            isActive: true
          }));
          setSigns([...signs, ...parkSigns]);
          console.log('[DEBUG] Friendly park signs added from Mapbox:', parkSigns);
          return;
        }
        // 4. Fallback to Mapbox POIs
        const pois = await searchNearbyPOIs(userLocation[1], userLocation[0], 5);
        console.log('[DEBUG] POIs returned from Mapbox:', pois);
        if (pois.length > 0) {
          const poiSigns = pois.map(poi => ({
            id: `friendly-poi-${poi.coordinates.join('-')}`,
            title: `📍 ${poi.name}`,
            description: `Check out this place: ${poi.address} (${poi.category})`,
            latitude: poi.coordinates[1],
            longitude: poi.coordinates[0],
            likes: 0,
            isHighlighted: false,
            createdBy: 'System',
            createdAt: new Date(),
            category: 'poi' as const,
            zoneType: 'point' as const,
            alertDistance: 100,
            severity: 'low' as const,
            isActive: true
          }));
          setSigns([...signs, ...poiSigns]);
          console.log('[DEBUG] Friendly POI signs added from Mapbox:', poiSigns);
          return;
        }
        // 5. Fallback: Place a generic sign at the user's location
        setSigns([
          ...signs,
          {
            id: `friendly-generic-${userLocation.join('-')}`,
            title: `👋 Welcome!`,
            description: `Explore your area and stay safe!`,
            latitude: userLocation[1],
            longitude: userLocation[0],
            likes: 0,
            isHighlighted: false,
            createdBy: 'System',
            createdAt: new Date(),
            category: 'safe' as const,
            zoneType: 'point' as const,
            alertDistance: 100,
            severity: 'low' as const,
            isActive: true
          }
        ]);
        console.log('[DEBUG] No POIs found, added generic friendly sign.');
      } else {
        console.log('[DEBUG] Skipping friendly sign, nearby signs exist.');
      }
    }
    maybeAddFriendlyParkSign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation]);

  // Dice roll handler: clear and repopulate signs
  const diceRollForSigns = useCallback(async () => {
    if (!userLocation) return;
    setSigns([]);
    let creativeSigns: any[] = [];
    let usedTypes: Set<string> = new Set();
    // Get all user-created signs
    const userSigns = signs.filter(s => s.createdBy !== 'System');
    // Shuffle CREATIVE_SIGN_TYPES for variety
    const shuffledTypes = CREATIVE_SIGN_TYPES.sort(() => Math.random() - 0.5);
    for (const signType of shuffledTypes) {
      if (creativeSigns.length >= 10) break;
      try {
        const places = await searchNearbyGooglePlacesWithSDK(userLocation[1], userLocation[0], signType.placeType, 1);
        if (places.length > 0 && !usedTypes.has(signType.key)) {
          let place = places[0];
          // If too close to a user sign, try to move
          let isTooClose = userSigns.some(userSign => getDistanceMeters(place.coordinates, [userSign.longitude, userSign.latitude]) < 200);
          if (isTooClose) {
            // Try to move the system sign in a circle around the original point
            let found = false;
            for (let angle = 0; angle < 360; angle += 30) {
              const rad = angle * Math.PI / 180;
              const dx = 0.002 * Math.cos(rad); // ~200m in lng/lat
              const dy = 0.002 * Math.sin(rad);
              const candidate = [place.coordinates[0] + dx, place.coordinates[1] + dy] as [number, number];
              if (!userSigns.some(userSign => getDistanceMeters(candidate, [userSign.longitude, userSign.latitude]) < 200)) {
                place = { ...place, coordinates: candidate };
                found = true;
                break;
              }
            }
            if (!found) continue; // Skip if no available spot
          }
          const sign = createCreativeSign(place, signType);
          const signTypeCategoryMap: Record<string, Sign['category']> = {
            daily_challenge: 'event',
            event: 'event',
            safety: 'safe',
            social: 'group',
            resource: 'resource',
            hidden_gem: 'poi',
            seasonal: 'event',
            food: 'poi',
            coffee: 'poi',
            fuel: 'resource',
            nature: 'environmental',
            culture: 'civic',
            health: 'safe',
            shopping: 'resource',
            finance: 'resource',
            bank: 'resource',
            nightlife: 'event',
            study: 'resource',
            emergency: 'safe',
            art: 'civic',
            movie: 'event',
          };
          const category = signTypeCategoryMap[signType.key] || 'poi';
          creativeSigns.push({
            id: `google-sdk-${signType.key}-${place.coordinates.join('-')}`,
            latitude: place.coordinates[1],
            longitude: place.coordinates[0],
            likes: 0,
            isHighlighted: false,
            createdBy: 'System',
            createdAt: new Date(),
            category,
            zoneType: 'point' as const,
            alertDistance: 100,
            severity: 'low' as const,
            isActive: true,
            ...sign
          });
          usedTypes.add(signType.key);
        }
      } catch (err) {
        console.log(`[DEBUG] Google SDK search error for ${signType.key}:`, err);
      }
    }
    setSigns([...userSigns, ...creativeSigns]);
  }, [userLocation, setSigns, signs]);

  useImperativeHandle(ref, () => ({ diceRollForSigns }));

  return (
    <div className="relative w-full h-screen">
      <Map
        ref={mapRef}
        {...mapViewState}
        onMove={handleMapMove}
        onLoad={handleMapLoad}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAPBOX_STYLE}
      >
        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxzoom={14}
        />

        {areaZones.filter(zone => zone.data !== null).map(({ sign, data }) => (
          <Source key={`area-${sign.id}`} id={`area-${sign.id}`} type="geojson" data={data as any}>
            <Layer
              id={`area-fill-${sign.id}`}
              type="fill"
              paint={{
                'fill-color': sign.category === 'danger' ? '#EF4444' : '#3B82F6',
                'fill-opacity': sign.category === 'danger' ? 0.3 : 0.1
              }}
            />
            <Layer
              id={`area-border-${sign.id}`}
              type="line"
              paint={{
                'line-color': sign.category === 'danger' ? '#EF4444' : '#3B82F6',
                'line-width': 2,
                'line-opacity': 0.8
              }}
            />
          </Source>
        ))}

        {signMarkers}
        {userLocation && (
          <MemoizedUserMarker
            userLocation={userLocation}
            getUserAvatarEmoji={getUserAvatarEmoji}
          />
        )}
        {hoveredSign && (
            <Popup
            longitude={hoveredSign.longitude}
            latitude={hoveredSign.latitude}
            closeButton={false}
            closeOnClick={false}
              anchor="top"
            offset={[0, -20]}
            className="z-[9999] !bg-transparent !shadow-none !border-none"
          >
            <div className="relative">
              {/* Holographic Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30" />
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 animate-pulse rounded-2xl" />
                  </div>
              {/* Main Popup Container - remove white bg, keep only dark/blurred */}
              <div className="relative backdrop-blur-xl border border-cyan-400/30 rounded-2xl shadow-2xl px-4 py-3 flex flex-col items-center bg-black/60">
                <span className="text-sm font-semibold text-cyan-100 text-center drop-shadow-md">
                  {getCrypticDescription(hoveredSign)}
                      </span>
                <span className="text-xs text-cyan-300 mt-1 text-center">Visit this spot to reveal more!</span>
                    </div>
                  </div>
            </Popup>
          )}
      </Map>
    </div>
  );
});