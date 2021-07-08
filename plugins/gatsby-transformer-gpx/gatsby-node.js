// const { gpx, kml } = require(`@mapbox/togeojson`)
// const DOMParser = require('xmldom').DOMParser

// const gpxType = 'application/gpx+xml'
// const kmlType = 'application/vnd.google-earth.kml+xml'

// const onCreateNode = async ({
//   node,
//   actions,
//   loadNodeContent,
//   createNodeId,
//   createContentDigest
// }) => {
//   const { createNode, createParentChildLink } = actions

//   const { mediaType } = node.internal

//   if (![gpxType, kmlType].includes(node.internal.mediaType)) return
//   const content = await loadNodeContent(node)
//   const dom = new DOMParser().parseFromString(content)
//   const data = mediaType === kmlType ? kml(dom) : gpx(dom)

//   if (data.type && data.type === "FeatureCollection") {
//     if (data.features) {
//       data.features.forEach(feature => {
//         if (feature.type && feature.type === 'Feature' && feature.properties && feature.properties.name) {
//           const nodeId = createNodeId(`feature-${feature.properties.name}`)
//           const nodeContent = JSON.stringify(feature)

//           const nodeData = Object.assign({}, feature, {
//             id: nodeId,
//             parent: null,
//             children: [],
//             internal: {
//               type: `GEOJSON${feature.geometry.type}`,
//               content: nodeContent,
//               contentDigest: createContentDigest(nodeContent),
//             },
//           })

//           createNode(nodeData, createNodeId)
//         }
//       })
//     }
//   }
// }

// exports.onCreateNode = onCreateNode
const geojson = require('@mapbox/togeojson')
const DOMParser = require('xmldom').DOMParser;

const parseDocument = content => new DOMParser().parseFromString(content);

const parseKML = markup => geojson.kml(parseDocument(markup))

const unstable_shouldOnCreateNode = ({ node }) => node.internal.mediaType === "application/vnd.google-earth.kml+xml"

exports.onCreateNode = async ({ node, actions, loadNodeContent, createNodeId, createContentDigest }) => {

  // we only care about KML content
  if (unstable_shouldOnCreateNode({ node })) {

    const content = await loadNodeContent(node)

    //parse KML data
    const data = parseKML(content)

    if (data.type && data.type === "FeatureCollection") {
      if (data.features) {
        const { createNode } = actions
        data.features.forEach(feature => {
          if (feature.type && feature.type === 'Feature' && feature.properties && feature.properties.name) {
            const nodeId = createNodeId(`feature-${feature.properties.name}`)
            const nodeContent = JSON.stringify(feature)
            const nodeContentDigest = createContentDigest(nodeContent)

            const nodeData = Object.assign({}, feature, {
              id: nodeId,
              parent: null,
              children: [],
              internal: {
                type: `KML${feature.geometry.type}`,
                content: nodeContent,
                contentDigest: nodeContentDigest,
              },
            })

            createNode(nodeData, createNodeId)
          }
        })
      }
    }
  }

}

exports.unstable_shouldOnCreateNode = unstable_shouldOnCreateNode