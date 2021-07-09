import React, { useState, useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const lightMapStyle = 'mapbox://styles/albertnis/ckqu3o4rn6np917qz18x1whbz'
const darkMapStyle = 'mapbox://styles/albertnis/ckqu1h7gs6e7x17q093ii0ltr'

const styles = {
  width: '100vw',
  height: '100vh',
  margin: 0,
}

const Map = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    setIsDarkMode(
      window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    )
  }, [])

  const map = useRef(null)
  const mapContainer = useRef(null)
  const mapStyle = isDarkMode ? darkMapStyle : lightMapStyle

  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle)
    }
    mapboxgl.accessToken =
      'pk.eyJ1IjoiYWxiZXJ0bmlzIiwiYSI6ImNrcXUwNHlhcTJnODAydm84anEzanIwZHQifQ.B9-IeJHvH9nnfQT9QT4ouw'
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [172.82, -40.74],
      zoom: 5,
    })
  }, [map, mapStyle])

  return <div ref={mapContainer} className="map-container" style={styles}></div>
}

export default Map
