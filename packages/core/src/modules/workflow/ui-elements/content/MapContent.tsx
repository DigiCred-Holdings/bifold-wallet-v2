/* eslint-disable no-console */
import React from 'react'
import { View, Text, Linking, TouchableOpacity } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { ContentProps, ContentRegistry } from '../ContentRegistry'

const MapContent: React.FC<ContentProps> = ({ item, styles, colors }) => {
  // Parse coordinates as floats (they come as strings from JSON) TODO swap them for prod
  const latitude = parseFloat(item.longitude || '0')
  const longitude = parseFloat(item.latitude || '0')

  console.log('🗺️ Map coordinates:', { latitude, longitude, title: item.title })

  // Validate coordinates (AFTER parsing)
  const isValidLat = !isNaN(latitude) && latitude >= -90 && latitude <= 90
  const isValidLon = !isNaN(longitude) && longitude >= -180 && longitude <= 180

  if (!isValidLat || !isValidLon) {
    console.warn('⚠️ Invalid map coordinates:', { latitude, longitude })
    return (
      <View style={styles.fieldContainer}>
        <Text style={[styles.description, { color: colors.text }]}>
          Invalid map coordinates (lat: {latitude}, lon: {longitude})
        </Text>
      </View>
    )
  }

  const handleOpenMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    Linking.openURL(url)
  }

  return (
    <View style={styles.fieldContainer}>
      {item.text && <Text style={[styles.label, { color: colors.text, marginBottom: 8 }]}>{item.text}</Text>}
      <TouchableOpacity onPress={handleOpenMaps} activeOpacity={0.9}>
        <View style={{ width: '100%', height: 200, borderRadius: 8, overflow: 'hidden' }}>
          <MapView
            style={{ width: '100%', height: '100%' }}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
          >
            <Marker coordinate={{ latitude, longitude }} title={item.title} />
          </MapView>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'transparent',
            }}
          />
        </View>
        <Text style={[styles.description, { color: colors.primary, textAlign: 'center', marginTop: 8 }]}>
          Tap to open in Maps
        </Text>
      </TouchableOpacity>
    </View>
  )
}

ContentRegistry.register('map', MapContent)

export default MapContent
