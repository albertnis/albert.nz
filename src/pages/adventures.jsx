import React from 'react'
import { graphql } from 'gatsby'

import SEO from '../components/seo'
import Header from '../components/header'
import Row from '../components/row'
import Map from '../components/map'

const BlogIndex = ({ data }) => {
  const posts = data.allMarkdownRemark.edges

  return (
    <div>
      <SEO />
        <Row styles={{position: 'relative', zIndex: 2}}> 
            <Header />
        </Row>
      <div style={{position: 'absolute', top: 0, left: 0}}>
      <Map />
      </div>
    </div>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            accent
          }
        }
      }
    }
  }
`
