import React from 'react'
import { graphql, Link } from 'gatsby'

import Seo from '../components/seo'
import Header from '../components/header'
import Row from '../components/row'
import PostPreview from '../components/postPreview'
import BioPreview from '../components/bioPreview'
import Footer from '../components/footer'

const BlogIndex = ({ data }) => {
  const posts = data.allMarkdownRemark.edges

  return (
    <div>
      <Seo />
      <Row>
        <Header />
      </Row>
      <Row>
        <BioPreview />
        Go to <Link to="/adventures">adventures</Link>
      </Row>
      <Row title="Blog posts">
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
      <Row
        styles={{
          backgroundColor: 'var(--color-background-popout)',
        }}
      >
        <Footer />
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
