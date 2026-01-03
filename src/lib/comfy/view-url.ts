export type ViewImageOutput = {
  filename: string
  subfolder?: string | null
  type?: string | null
}

type BuildViewUrlOptions = {
  apiBase: string
  image: ViewImageOutput
  preview?: string
  channel?: "rgb" | "rgba" | "a"
}

export const buildViewUrl = ({
  apiBase,
  image,
  preview,
  channel,
}: BuildViewUrlOptions): string | null => {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const baseUrl = new URL(apiBase, window.location.href)
    const viewUrl = new URL(baseUrl.toString())
    const basePath = baseUrl.pathname.endsWith("/")
      ? baseUrl.pathname.slice(0, -1)
      : baseUrl.pathname
    viewUrl.pathname = `${basePath}/view`
    viewUrl.searchParams.set("filename", image.filename)
    if (typeof image.subfolder === "string" && image.subfolder.length > 0) {
      viewUrl.searchParams.set("subfolder", image.subfolder)
    }
    if (typeof image.type === "string" && image.type.length > 0) {
      viewUrl.searchParams.set("type", image.type)
    }
    if (preview) {
      viewUrl.searchParams.set("preview", preview)
    }
    if (channel) {
      viewUrl.searchParams.set("channel", channel)
    }
    return viewUrl.toString()
  } catch {
    return null
  }
}
