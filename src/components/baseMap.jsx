import React, { useState, useRef, useEffect } from 'react'
import mapboxgl from '!mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapPrompt from './mapPrompt'
import MapPostPreview from './mapPostPreview'

import * as styles from './map.module.css'

const lightMapStyle = 'mapbox://styles/albertnis/ckqu3o4rn6np917qz18x1whbz'
const darkMapStyle = 'mapbox://styles/albertnis/ckqu1h7gs6e7x17q093ii0ltr'

const unselectedLineColor = 'rgba(255,40,60,0.7)'

const BaseMap = ({ data }) => {
  const [sourceNames, setSourceNames] = useState([])

  const loadPostsToGeoJson = mapRef => node => {
    console.log(node)
    if (node.frontmatter.routes === null) return []
    return node.frontmatter.routes.map(route => {
      const map = mapRef.current
      const sourceName = `${node.fields.slug}-${route.name}`
      const geometry = route.childGeoLineString.geometry
      const bounds = geometry.coordinates.reduce(
        (bounds, coord) => bounds.extend(coord),
        new mapboxgl.LngLatBounds(
          geometry.coordinates[0],
          geometry.coordinates[0]
        )
      )
      console.log({ bounds: bounds.toString() })
      map.addSource(sourceName, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry,
        },
      })
      setSourceNames([...sourceNames, sourceName])
      map.addLayer({
        id: sourceName,
        type: 'line',
        source: sourceName,
        layout: {
          'line-join': 'round',

          'line-cap': 'round',
        },
        paint: {
          'line-color': unselectedLineColor,
          'line-width': 5,
        },
      })
      map.fitBounds(bounds, {
        padding: { top: 20, right: 20, bottom: 20, left: 20 },
      })
      return sourceName
    })
  }

  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (window.matchMedia) {
      const query = window.matchMedia('(prefers-color-scheme: dark)')
      setIsDarkMode(query.matches)
      const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode)
      }
      query.addEventListener('change', toggleDarkMode)
      return () => query.removeEventListener('change', toggleDarkMode)
    }
  }, [isDarkMode])

  const map = useRef(null)
  const mapContainer = useRef(null)
  const mapStyle = isDarkMode ? darkMapStyle : lightMapStyle
  const [isMapLoading, setIsMapLoading] = useState(true)

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
    map.current.on('load', () => {
      const sourceNames = loadPostsToGeoJson(map)(data.markdownRemark)
      setIsMapLoading(false)
      setSourceNames(sourceNames)
    })
  }, [map, mapStyle, data.markdownRemark])

  return (
    <div className={styles.mapWrapper}>
      {isMapLoading && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 8 8"
          version="1.1"
          className={styles.loadingIndicator}
        >
          <circle
            strokeWidth="1"
            fill="none"
            stroke="#000"
            cx="4"
            cy="4"
            r="3"
            className={styles.loadingIndicatorPath}
          />
        </svg>
      )}
      <div ref={mapContainer} className={styles.baseMap}></div>
      <a
        className={styles.gpxLink}
        href={data.markdownRemark.frontmatter.routes[0].publicURL}
      >
        Download GPX file
      </a>
    </div>
  )
}

export default BaseMap
