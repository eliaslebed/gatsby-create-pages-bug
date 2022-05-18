const path = require("path")
const { createFilePath } = require("gatsby-source-filesystem")
const { fmImagesToRelative } = require("gatsby-remark-relative-images")
require("dotenv").config()

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  fmImagesToRelative(node)

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.onCreateWebpackConfig = ({ getConfig, actions }) => {
  if (getConfig().mode === "production") {
    actions.setWebpackConfig({
      devtool: false,
    })
  }
}

exports.createPages = async ({
  actions: { createPage },
  graphql,
  reporter,
}) => {
  const allMarkdownRemark = await graphql(
    `
      {
        allMarkdownRemark(limit: 1000) {
          edges {
            node {
              id
              fields {
                slug
              }
              frontmatter {
                templateKey
                coverSource {
                  coverImage
                  coverVideo {
                    src
                    videoPadding
                  }
                }
                featuredProject
                title
                publishYear(formatString: "YYYY")
                category
                description
              }
            }
          }
        }
      }
    `
  )

  const markdownRemark = await graphql(
    `
      {
        markdownRemark {
          frontmatter {
            isInDevelopment
            siteTitle
            siteDescription
            showreelConfig {
              source
              padding
            }
            colors
          }
        }
      }
    `
  )

  return new Promise(resolve => {
    const data = Promise.allSettled([allMarkdownRemark, markdownRemark]).then(
      ([allMarkdownRemarkData, markdownRemarkData]) => {
        const markdownRemarkResult = markdownRemarkData.value
        const allMarkdownRemarkResult = allMarkdownRemarkData.value
        const errors =
          allMarkdownRemarkResult.errors || markdownRemarkResult.errors

        const { frontmatter } = markdownRemarkResult.data.markdownRemark
        const isMarkdownEmpty = Object.values(frontmatter).every(
          value => value === null
        )

        if (errors || isMarkdownEmpty) {
          reporter.panicOnBuild(
            `Error while running GraphQL query.`,
            new Error(`Build has failed with: ${markdownRemarkResult.errors}`)
          )

          return
        }

        const posts = allMarkdownRemarkResult.data.allMarkdownRemark.edges
        const {
          colors,
          showreelConfig,
          isInDevelopment,
          siteTitle,
          siteDescription,
        } = markdownRemarkResult.data.markdownRemark.frontmatter

        const featuredWorks = posts.filter(
          post => post.node.frontmatter.featuredProject
        )

        posts.forEach(edge => {
          const { id } = edge.node
          createPage({
            path: edge.node.fields.slug,
            component: path.resolve(
              `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
            ),
            context: {
              id,
              featuredWorks,
              colors,
              showreelConfig,
              adminUsername: process.env.ADMIN_USER,
              isInDevelopment,
              siteTitle,
              siteDescription,
            },
          })
        })
      }
    )

    resolve(data)
  })
}
