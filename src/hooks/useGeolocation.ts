import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
}

/** Default center: Chennai, India */
const DEFAULT_LAT = 13.0827;
const DEFAULT_LNG = 80.2707;

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        latitude: DEFAULT_LAT,
        longitude: DEFAULT_LNG,
        error: "Geolocation not supported",
        isLoading: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          isLoading: false,
        });
      },
      (err) => {
        setState({
          latitude: DEFAULT_LAT,
          longitude: DEFAULT_LNG,
          error: err.message,
          isLoading: false,
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return state;
}
