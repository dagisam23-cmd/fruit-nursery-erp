import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OfflineSyncManager } from '../services/offlineSync';
import { GPSTracker } from '../services/gpsTracker';
import { CameraCapture } from '../services/cameraCapture';

const DashboardScreen: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState('synced');
  const [pendingChanges, setPendingChanges] = useState(0);
  const [gpsLocation, setGpsLocation] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Initialize offline sync manager
    await OfflineSyncManager.initialize();
    
    // Start GPS tracking
    GPSTracker.startTracking((location) => {
      setGpsLocation(location);
    });

    // Check pending changes
    const pending = await OfflineSyncManager.getPendingChanges();
    setPendingChanges(pending.length);
  };

  const handleSync = async () => {
    try {
      setSyncStatus('syncing');
      const result = await OfflineSyncManager.syncAll();
      setSyncStatus('synced');
      setPendingChanges(0);
      Alert.alert('Success', `Synced ${result.synced} records`);
    } catch (error) {
      setSyncStatus('conflict');
      Alert.alert('Sync Error', 'There were conflicts during sync. Please review and resolve.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌿 Fruit Nursery Mobile</Text>
      </View>

      {/* Connection Status */}
      <View style={styles.statusCard}>
        <Text style={styles.cardTitle}>Connection Status</Text>
        <View style={styles.statusRow}>
          <Text>Status:</Text>
          <Text style={[styles.badge, isOnline ? styles.online : styles.offline]}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text>Sync Status:</Text>
          <Text style={[styles.badge, syncStatus === 'synced' ? styles.success : styles.pending]}>
            {syncStatus.toUpperCase()}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text>Pending Changes:</Text>
          <Text style={styles.badgeValue}>{pendingChanges}</Text>
        </View>
      </View>

      {/* Sync Controls */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Synchronization</Text>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleSync}
          disabled={syncStatus === 'syncing'}
        >
          <Text style={styles.buttonText}>
            {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.helpText}>
          Automatic sync every 5 minutes when online
        </Text>
      </View>

      {/* GPS Location */}
      {gpsLocation && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Location</Text>
          <View style={styles.statusRow}>
            <Text>Latitude:</Text>
            <Text style={styles.value}>{gpsLocation.latitude.toFixed(6)}</Text>
          </View>
          <View style={styles.statusRow}>
            <Text>Longitude:</Text>
            <Text style={styles.value}>{gpsLocation.longitude.toFixed(6)}</Text>
          </View>
          <View style={styles.statusRow}>
            <Text>Accuracy:</Text>
            <Text style={styles.value}>{gpsLocation.accuracy.toFixed(2)}m</Text>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
          <Text style={styles.buttonText}>📷 Capture Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
          <Text style={styles.buttonText}>📊 Record Inspection</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
          <Text style={styles.buttonText}>✓ Mark Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
          <Text style={styles.buttonText}>📦 Scan Barcode</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 16,
  },
  header: {
    marginBottom: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  badgeValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2ecc71',
  },
  online: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  offline: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  pending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  value: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginVertical: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2ecc71',
  },
  secondaryButton: {
    backgroundColor: '#3498db',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default DashboardScreen;
