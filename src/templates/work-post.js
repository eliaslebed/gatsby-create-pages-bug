/** @jsx jsx */
import React from "react"
import { graphql } from "gatsby"

export const WorkPageTemplate = () => {
  return <></>
}

const WorkPage = () => {
  return <></>
}

export default WorkPage

export const workPageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark: markdownRemark(id: { eq: $id }) {
      id
      fields {
        slug
      }
      frontmatter {
        title
        description
        publishYear(formatString: "YYYY")
        category
        client
        videoPadding
        coverSource {
          coverImage
          coverVideo {
            src
            isMuted
          }
        }
      }
    }
  }
`
