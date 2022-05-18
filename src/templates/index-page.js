/** @jsx jsx */
import React from "react"
import { graphql } from "gatsby"

export const IndexPageTemplate = () => {
  return <></>
}

const IndexPage = () => {
  return <></>
}

export default IndexPage

export const pageQuery = graphql`
  query IndexPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        bodyDescription
        showreelConfig {
          source
          padding
          description
        }
      }
    }
  }
`
