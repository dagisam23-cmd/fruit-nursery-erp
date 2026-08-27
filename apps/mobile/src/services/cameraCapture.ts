import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CapturedPhoto {
  uri: string;
  fileName: string;
  timestamp: number;
  location?: { latitude: number; longitude: number };
}

class CameraService {
  private readonly PHOTO_DIR = `${FileSystem.documentDirectory}photos/`;

  async initialize() {
    // Create photos directory if it doesn't exist
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.PHOTO_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.PHOTO_DIR, { intermediates: true });
      }
    } catch (error) {
      console.error('Error creating photo directory:', error);
    }
  }

  async takePhoto(): Promise<string> {
    try {
      // Request camera permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Camera permission denied');
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.8,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled && result.assets[0]) {
        const photoUri = result.assets[0].uri;
        const fileName = `photo_${Date.now()}.jpg`;
        const newPath = this.PHOTO_DIR + fileName;

        // Copy photo to app directory
        await FileSystem.copyAsync({
          from: photoUri,
          to: newPath,
        });

        // Store metadata
        const photoData: CapturedPhoto = {
          uri: newPath,
          fileName,
          timestamp: Date.now(),
        };

        // Save to local storage for syncing
        const allPhotos = await this.getPhotoMetadata();
        allPhotos.push(photoData);
        await AsyncStorage.setItem('photo_metadata', JSON.stringify(allPhotos));

        return newPath;
      }

      throw new Error('No photo captured');
    } catch (error) {
      console.error('Error taking photo:', error);
      throw error;
    }
  }

  async pickPhoto(): Promise<string> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Media library permission denied');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 0.8,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled && result.assets[0]) {
        const photoUri = result.assets[0].uri;
        const fileName = `photo_${Date.now()}.jpg`;
        const newPath = this.PHOTO_DIR + fileName;

        await FileSystem.copyAsync({
          from: photoUri,
          to: newPath,
        });

        return newPath;
      }

      throw new Error('No photo selected');
    } catch (error) {
      console.error('Error picking photo:', error);
      throw error;
    }
  }

  private async getPhotoMetadata(): Promise<CapturedPhoto[]> {
    try {
      const data = await AsyncStorage.getItem('photo_metadata');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  async deletePhoto(filePath: string): Promise<void> {
    try {
      await FileSystem.deleteAsync(filePath);
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  }
}

export const CameraCapture = new CameraService();
