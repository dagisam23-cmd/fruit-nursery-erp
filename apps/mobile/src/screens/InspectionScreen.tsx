import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { CameraCapture } from '../services/cameraCapture';
import { OfflineSyncManager } from '../services/offlineSync';

const InspectionScreen: React.FC = () => {
  const [batchId, setBatchId] = useState('');
  const [plantHeight, setPlantHeight] = useState('');
  const [stemDiameter, setStemDiameter] = useState('');
  const [leafCount, setLeafCount] = useState('');
  const [healthStatus, setHealthStatus] = useState('healthy');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [inspections, setInspections] = useState<any[]>([]);

  const healthStatusOptions = ['healthy', 'good', 'fair', 'poor', 'diseased'];

  const handleCapturePhoto = async () => {
    try {
      const photo = await CameraCapture.takePhoto();
      setPhotos([...photos, photo]);
      Alert.alert('Success', 'Photo captured and saved locally');
    } catch (error) {
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  const handleSaveInspection = async () => {
    if (!batchId || !plantHeight || !stemDiameter || !leafCount) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    const inspection = {
      id: Date.now().toString(),
      batchId,
      plantHeight: parseFloat(plantHeight),
      stemDiameter: parseFloat(stemDiameter),
      leafCount: parseInt(leafCount),
      healthStatus,
      notes,
      photos,
      inspectionDate: new Date().toISOString(),
      syncStatus: 'pending',
    };

    try {
      // Save to local storage
      await OfflineSyncManager.saveRecord('inspections', inspection);
      
      setInspections([inspection, ...inspections]);
      
      // Reset form
      setBatchId('');
      setPlantHeight('');
      setStemDiameter('');
      setLeafCount('');
      setHealthStatus('healthy');
      setNotes('');
      setPhotos([]);

      Alert.alert('Success', 'Inspection saved locally. Will sync when online.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save inspection');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔍 Record Inspection</Text>
      </View>

      {/* Inspection Form */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Inspection Details</Text>
        
        <Text style={styles.label}>Batch ID *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter batch ID"
          value={batchId}
          onChangeText={setBatchId}
          editable={true}
        />

        <Text style={styles.label}>Plant Height (cm) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Height in centimeters"
          value={plantHeight}
          onChangeText={setPlantHeight}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Stem Diameter (mm) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Diameter in millimeters"
          value={stemDiameter}
          onChangeText={setStemDiameter}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Leaf Count *</Text>
        <TextInput
          style={styles.input}
          placeholder="Number of leaves"
          value={leafCount}
          onChangeText={setLeafCount}
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Health Status</Text>
        <View style={styles.statusContainer}>
          {healthStatusOptions.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                healthStatus === status && styles.statusButtonActive,
              ]}
              onPress={() => setHealthStatus(status)}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  healthStatus === status && styles.statusButtonTextActive,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Additional observations..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Photo Capture */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📷 Photographic Evidence</Text>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleCapturePhoto}
        >
          <Text style={styles.buttonText}>Capture Photo</Text>
        </TouchableOpacity>
        
        {photos.length > 0 && (
          <View style={styles.photoList}>
            <Text style={styles.photoCount}>{photos.length} photos captured</Text>
          </View>
        )}
      </View>

      {/* Save Button */}
      <View style={styles.card}>
        <TouchableOpacity
          style={[styles.button, styles.successButton]}
          onPress={handleSaveInspection}
        >
          <Text style={styles.buttonText}>💾 Save Inspection</Text>
        </TouchableOpacity>
      </View>

      {/* Previous Inspections */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recent Inspections</Text>
        {inspections.length > 0 ? (
          <FlatList
            scrollEnabled={false}
            data={inspections.slice(0, 5)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.inspectionItem}>
                <Text style={styles.inspectionBatch}>Batch: {item.batchId}</Text>
                <Text style={styles.inspectionDate}>
                  {new Date(item.inspectionDate).toLocaleString()}
                </Text>
                <Text style={styles.inspectionStatus}>
                  Status: <Text style={[styles.badge, item.syncStatus === 'pending' ? styles.pending : styles.synced]}>
                    {item.syncStatus}
                  </Text>
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.emptyText}>No inspections recorded yet</Text>
        )}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  statusButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  statusButtonText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  statusButtonTextActive: {
    color: 'white',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginVertical: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  successButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  photoList: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  photoCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  inspectionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inspectionBatch: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  inspectionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  inspectionStatus: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 11,
    fontWeight: '600',
  },
  pending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  synced: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 16,
  },
});

export default InspectionScreen;
