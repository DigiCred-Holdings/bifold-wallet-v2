// Type declarations for react-native-maps
declare module 'react-native-maps' {
  import { Component } from 'react'
  import { ViewProps } from 'react-native'

  export interface Region {
    latitude: number
    longitude: number
    latitudeDelta: number
    longitudeDelta: number
  }

  export interface LatLng {
    latitude: number
    longitude: number
  }

  export interface MapViewProps extends ViewProps {
    region?: Region
    initialRegion?: Region
    onPress?: (event: { nativeEvent: { coordinate: LatLng } }) => void
    onRegionChange?: (region: Region) => void
    onRegionChangeComplete?: (region: Region) => void
    showsUserLocation?: boolean
    followsUserLocation?: boolean
    showsMyLocationButton?: boolean
    showsPointsOfInterest?: boolean
    showsCompass?: boolean
    showsScale?: boolean
    showsTraffic?: boolean
    showsIndoors?: boolean
    showsBuildings?: boolean
    zoomEnabled?: boolean
    rotateEnabled?: boolean
    scrollEnabled?: boolean
    pitchEnabled?: boolean
    mapType?: 'standard' | 'satellite' | 'hybrid' | 'terrain' | 'none'
    minZoomLevel?: number
    maxZoomLevel?: number
    provider?: 'google' | null
  }

  export interface MarkerProps extends ViewProps {
    coordinate: LatLng
    title?: string
    description?: string
    identifier?: string
    onPress?: () => void
    onSelect?: () => void
    onDeselect?: () => void
    onCalloutPress?: () => void
    draggable?: boolean
    onDragStart?: (event: { nativeEvent: { coordinate: LatLng } }) => void
    onDrag?: (event: { nativeEvent: { coordinate: LatLng } }) => void
    onDragEnd?: (event: { nativeEvent: { coordinate: LatLng } }) => void
  }

  export default class MapView extends Component<MapViewProps> {}
  export class Marker extends Component<MarkerProps> {}

  export const PROVIDER_GOOGLE: 'google'
  export const PROVIDER_DEFAULT: null
}
