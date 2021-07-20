import React from 'react'
import { graphql } from 'gatsby'

import SEO from '../components/seo'
import Header from '../components/header'
import Row from '../components/row'
import Map from '../components/map'

const BlogIndex = ({ data }) => {
  return (
    <div>
      <SEO />
      <Row styles={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }}>
        <Header />
      </Row>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <Map data={data} />
      </div>
    </div>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          frontmatter {
            title
            accent
            description
            routes {
              name
              childGeoLineString {
                geometry {
                  coordinates
                  type
                }
              }
            }
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
