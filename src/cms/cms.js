import CMS from "netlify-cms-app"
import uploadcare from "netlify-cms-media-library-uploadcare"
import cloudinary from "netlify-cms-media-library-cloudinary"

import IndexPagePreview from "./preview-templates/IndexPagePreview"

CMS.registerPreviewStyle("../gatsby-plugin-theme-ui/styles.css")

CMS.registerMediaLibrary(uploadcare)
CMS.registerMediaLibrary(cloudinary)

CMS.registerPreviewTemplate("index", IndexPagePreview)
