export default defineEventHandler((event) => {
  const host = getRequestHost(event).toLowerCase().split(':')[0] ?? ''

  if (host === 'passphrase.pages.dev' || host.endsWith('.passphrase.pages.dev')) {
    setResponseHeader(event, 'X-Robots-Tag', 'noindex')
  }

  if (host === 'passphrase.ch') {
    const url = getRequestURL(event)
    return sendRedirect(event, `https://www.passphrase.ch${url.pathname}${url.search}`, 301)
  }
})
