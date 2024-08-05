import { JSDOM } from 'jsdom';

function normalizeURL(url) {
    const splitOnDoubleSlash = url.split('//')
    const modifiedPath = splitOnDoubleSlash.length > 1 ? splitOnDoubleSlash[1] : splitOnDoubleSlash[0]
    const trailingSlashRemoved = modifiedPath[modifiedPath.length - 1] === '/' ? modifiedPath.slice(0, modifiedPath.length - 1) : modifiedPath
    return trailingSlashRemoved
}

function getUrlsFromHtml(htmlBody, baseUrl) {
    const dom = new JSDOM(htmlBody)
    const links = dom.window.document.querySelectorAll('a')
    const formatted = []
    for (let i = 0; i < links.length; i++) {
	const link = links[i].href
	const absoluteLink = link[0] === '/' ? baseUrl + link : link
	formatted.push(normalizeURL(absoluteLink))
    }
    return formatted
}


export { normalizeURL, getUrlsFromHtml };

