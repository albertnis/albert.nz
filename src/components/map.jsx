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

const selectedLineColor = '#63F'
const unselectedLineColor = 'rgba(255,40,60,0.5)'

const Map = ({ data }) => {
  const [sourceNames, setSourceNames] = useState([])
  const [selected, setSelected] = useState(null)
  
  const loadPostsToGeoJson = mapRef => nodes => 
    nodes.map(({ node }) => {
      if (node.frontmatter.routes === null) return []
      return node.frontmatter.routes.map(route => {
        const map = mapRef.current
        const sourceName = `${node.fields.slug}-${route.name}`
        const geometry = route.childGeoLineString.geometry
        const bounds = geometry.coordinates.reduce((bounds, coord) => bounds.extend(coord),
          new mapboxgl.LngLatBounds(geometry.coordinates[0], geometry.coordinates[0]))
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
            'line-color': node.fields.slug === selected ? selectedLineColor : unselectedLineColor,
            'line-width': 5,
          },
        })
        map.on('mouseenter', sourceName, () => {
          map.getCanvas().style.cursor = "pointer"
        })
        map.on('mouseleave', sourceName, () => {
          map.getCanvas().style.cursor = ""
        })
        map.on('click', sourceName, () => {
          map.fitBounds(bounds, {padding: 300})
          setSelected(sourceName)
        })
        return sourceName
      })
    }).flat(1)

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
      sourceNames.forEach((source) => {map.current.setPaintProperty(source, 'line-color', source === selected? selectedLineColor: unselectedLineColor)})
    }
  }, [map, selected])

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
    map.current.on('load', () =>{
      const sourceNames = loadPostsToGeoJson(map)(data.allMarkdownRemark.edges)
      setSourceNames(sourceNames)}
    )
  }, [map, mapStyle, data.allMarkdownRemark.edges])

  return <div ref={mapContainer} className="map-container" style={styles}></div>
}

export default Map
