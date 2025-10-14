import React, { useEffect, useState } from "react"
import { Wrapper, Status } from "@googlemaps/react-wrapper"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

const GoogleMapView = ({ locations = [], height = "400px" }) => {
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    if (map && locations.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      locations.forEach(location => {
        bounds.extend(new google.maps.LatLng(location.lat, location.lng))
      })
      map.fitBounds(bounds)
    }
  }, [map, locations])

  const onLoad = (map) => {
    setMap(map)
  }

  const onUnmount = () => {
    setMap(null)
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-300">
      <Wrapper apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} render={render}>
        <Map
          center={{ lat: 20, lng: 0 }}
          zoom={2}
          onLoad={onLoad}
          onUnmount={onUnmount}
          style={{ height, width: "100%" }}
        >
          {locations.map((location, index) => (
            <GoogleMarker
              key={index}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => {
                // Handle marker click
              }}
            />
          ))}
        </Map>
      </Wrapper>
    </div>
  )
}

const render = (status) => {
  switch (status) {
    case Status.LOADING:
      return <div>Loading...</div>
    case Status.FAILURE:
      return <div>Error loading map</div>
    case Status.SUCCESS:
      return <div>Map loaded successfully</div>
  }
}

const Map = ({ onLoad, onUnmount, children, style, ...options }) => {
  const ref = React.useRef()

  useEffect(() => {
    if (ref.current && !window.google) {
      console.error("Google Maps JavaScript API library must be loaded.")
      return
    }

    const map = new window.google.maps.Map(ref.current, options)
    if (onLoad) onLoad(map)

    return () => {
      if (onUnmount) onUnmount()
    }
  }, [onLoad, onUnmount, options])

  return <div ref={ref} style={style} />
}

const GoogleMarker = ({ position, onClick }) => {
  const [marker, setMarker] = useState(null)

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker())
    }

    return () => {
      if (marker) {
        marker.setMap(null)
      }
    }
  }, [marker])

  useEffect(() => {
    if (marker) {
      marker.setOptions({ position, map: marker.get('map') })
      if (onClick) {
        marker.addListener('click', onClick)
      }
    }
  }, [marker, position, onClick])

  return null
}

const MapView = ({ locations = [], height = "400px", useGoogleMaps = false }) => {
  const [mapCenter, setMapCenter] = useState([20, 0]) // Default center

  useEffect(() => {
    if (locations.length > 0) {
      // Calculate center based on locations
      const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length
      const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length
      setMapCenter([avgLat, avgLng])
    }
  }, [locations])

  if (useGoogleMaps) {
    return <GoogleMapView locations={locations} height={height} />
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={mapCenter}
        zoom={locations.length > 0 ? 4 : 2}
        style={{ height, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location, index) => (
          <Marker key={index} position={[location.lat, location.lng]}>
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold">{location.name}</h3>
                {location.description && (
                  <p className="text-sm text-gray-600 mt-1">{location.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default MapView
