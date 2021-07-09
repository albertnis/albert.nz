import React, { useState, useRef, useEffect } from 'react'
import mapboxgl from '!mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const lightMapStyle = 'mapbox://styles/albertnis/ckqu3o4rn6np917qz18x1whbz'
const darkMapStyle = 'mapbox://styles/albertnis/ckqu1h7gs6e7x17q093ii0ltr'

const styles = {
  width: '100vw',
  height: '100vh',
  margin: 0,
}

const loadPostsToGeoJson = mapRef => nodes => {
  nodes.forEach(({ node }) => {
    if (node.frontmatter.routes !== null) {
      node.frontmatter.routes.forEach(route => {
        const sourceName = `${node.fields.slug}-${route.name}`
        console.log('adding source', sourceName)
        mapRef.current.addSource(sourceName, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: route.childGeoLineString.geometry,
          },
        })
        mapRef.current.addLayer({
          id: sourceName,
          type: 'line',
          source: sourceName,
          layout: {
            'line-join': 'round',

            'line-cap': 'round',
          },
          paint: {
            'line-color': '#F00',
            'line-width': 5,
          },
        })
      })
    }
  })
}

const Map = ({ data }) => {
  console.log('data is ', data)
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
      return
    }
    mapboxgl.accessToken =
      'pk.eyJ1IjoiYWxiZXJ0bmlzIiwiYSI6ImNrcXUwNHlhcTJnODAydm84anEzanIwZHQifQ.B9-IeJHvH9nnfQT9QT4ouw'
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [172.82, -40.74],
      zoom: 5,
    })
    map.current.on('load', () =>
      loadPostsToGeoJson(map)(data.allMarkdownRemark.edges)
    )
  }, [map, mapStyle, data.allMarkdownRemark.edges])

  return <div ref={mapContainer} className="map-container" style={styles}></div>
}

export default Map
