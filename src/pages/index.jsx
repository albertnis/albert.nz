import React from 'react'
import { Link, graphql } from 'gatsby'

import SEO from '../components/seo'
import Header from '../components/header'
import Row from '../components/row'
import PostPreview from '../components/postPreview'

const BlogIndex = ({ data }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges

  return (
    <div>
      <Row>
        <Header />
      </Row>
      <SEO />
      <Row>
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <article key={node.fields.slug}>
              <PostPreview
                to={node.fields.slug}
                title={title}
                date={node.frontmatter.date}
                description={node.frontmatter.description || node.excerpt}
                accent={node.frontmatter.accent}
              />
            </article>
          )
        })}
      </Row>
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
