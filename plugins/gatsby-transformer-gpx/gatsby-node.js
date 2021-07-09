const geojson = require('@mapbox/togeojson')
const DOMParser = require('xmldom').DOMParser

const parseDocument = content => new DOMParser().parseFromString(content)

const parseKML = markup => geojson.kml(parseDocument(markup))
const parseGPX = markup => geojson.gpx(parseDocument(markup))

const unstable_shouldOnCreateNode = ({ node }) =>
  node.internal.mediaType === 'application/gpx+xml' ||
  node.internal.mediaType === 'application/vnd.google-earth.kml+xml'

exports.onCreateNode = async ({
  node,
  actions,
  loadNodeContent,
  createNodeId,
  createContentDigest,
}) => {
  if (unstable_shouldOnCreateNode({ node })) {
    const content = await loadNodeContent(node)

    //parse KML data
    const data =
      node.internal.mediaType === 'application/gpx+xml'
        ? parseGPX(content)
        : parseKML(content)

    if (data.type && data.type === 'FeatureCollection') {
      if (data.features) {
        const { createNode, createParentChildLink } = actions
        data.features.forEach(feature => {
          if (
            feature.type &&
            feature.type === 'Feature' &&
            feature.properties &&
            feature.properties.name
          ) {
            const nodeId = createNodeId(`feature-${feature.properties.name}`)
            const nodeContent = JSON.stringify(feature)
            const nodeContentDigest = createContentDigest(nodeContent)

            const nodeData = Object.assign({}, feature, {
              id: nodeId,
              parent: null,
              children: [],
              internal: {
                type: `Geo${feature.geometry.type}`,
                content: nodeContent,
                contentDigest: nodeContentDigest,
              },
              parent: node.id,
            })

            createNode(nodeData, createNodeId)
            createParentChildLink({ parent: node, child: nodeData })
          }
        })
      }
    }
  }
}

exports.unstable_shouldOnCreateNode = unstable_shouldOnCreateNode
