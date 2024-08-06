import { argv } from 'node:process';
import { crawlPage } from './crawl.js';
import { printReport } from './report.js';

async function main() {
    if (argv.length !== 3) {
	throw new Error("Incorrect Argument Count should only pass one argument")
    }
    console.log(`Crawler starting at: ${argv[2]}`)
    const pages = await crawlPage(argv[2], argv[2])
    printReport(pages)
}

await main()
