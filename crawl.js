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

async function crawlPage(baseURL, currentURL, pages = []) {
    try {
	
	if (!currentURL.includes(normalizeURL(baseURL))) {
	    console.log(`baseURL: ${baseURL}, currentURL: ${currentURL}`)
	    return pages
	}
	const fixedURL = normalizeURL(currentURL)
	if (fixedURL in pages) {
	    pages[fixedURL]++
	} else {
	    pages[fixedURL] = 1
	}
	const parsedPage = await parsePage(currentURL)
	const foundURLs = getUrlsFromHtml(parsedPage, baseURL)
	for (let i = 0; i < foundURLs.length; i++) {
	    const rec = await crawlPage(baseURL, foundURLs[i], pages)
	    pages.push(...rec)
	}
	return pages

    } catch (err) {
	console.log(err.message)
    }
}

async function parsePage(url) {
    try {
        const resp = await fetch(url)
        if (resp.status >= 400) {
	    throw new Error(`fetch returned error ${resp.status}`)
	}
	const ct = resp.headers.get('content-type')
	if (!ct || !ct.includes('text/html')) {
	    throw new Error(`data returned not not appropriate type, expecting text/html, got ${ct}`)
	}
	return await resp.text()
    } catch (err) {
	console.log(`Error: ${err.message} occurred parsing page at: ${url}. Continuing`)
	return ""
    }
}

export { normalizeURL, getUrlsFromHtml, crawlPage };


