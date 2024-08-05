import { test, expect } from "@jest/globals";
import { normalizeURL, getUrlsFromHtml } from "./crawl.js";

test('testing secure url', () => {
	expect(normalizeURL('https://www.test.test/')).toBe('www.test.test')
});

test('testing secure url with path', () => {
	expect(normalizeURL('https://www.blog.com/blog/')).toBe('www.blog.com/blog')
});

test('testing insecure url with path', () => {
	expect(normalizeURL('http://www.cnn.com/news')).toBe('www.cnn.com/news')
});

test('link', () => {
	const testStr = `
	<body>
		<h1> Title </h1>
		This is just a lot of text for some reason before a <a href="http://www.blog.com/about">link</a>
		Then the text continues.
	</body>
	`
	expect(getUrlsFromHtml(testStr, "www.blog.com")).toStrictEqual(["www.blog.com/about"])
});

test('multiple links', () => {
	const testStr = `
	<head> test </head>
	<body>
		<p>
		Here's a block of text with a <a href="/dynamic">Dynamic Link</a> and a <a href="https://www.test.com/test/"> normal link</a>.
		</p>
	</body>
	`
	expect(getUrlsFromHtml(testStr, "www.test.com")).toStrictEqual(["www.test.com/dynamic","www.test.com/test"])
});
