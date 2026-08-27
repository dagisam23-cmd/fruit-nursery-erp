import * as Location from 'expo-location';
import { Accuracy } from 'expo-location';

export interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

class GPSTrackerService {
  private locationSubscription: any = null;
  private isTracking = false;

  async startTracking(onLocationChange: (location: GPSLocation) => void) {
    try {
      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      this.isTracking = true;

      // Watch position with high accuracy
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Accuracy.High,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 50, // Or when moved 50 meters
        },
        (location) => {
          onLocationChange({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy || 0,
            altitude: location.coords.altitude,
            heading: location.coords.heading,
            speed: location.coords.speed,
          });
        }
      );
    } catch (error) {
      console.error('Error starting GPS tracking:', error);
    }
  }

  stopTracking() {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
      this.isTracking = false;
    }
  }

  async getCurrentLocation(): Promise<GPSLocation | null> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 0,
        altitude: location.coords.altitude,
        heading: location.coords.heading,
        speed: location.coords.speed,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  isActive(): boolean {
    return this.isTracking;
  }
}

export const GPSTracker = new GPSTrackerService();
