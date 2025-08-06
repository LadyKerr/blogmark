# blogmark

A Node.js CLI tool that converts web blog posts to markdown files with frontmatter.

## Quick Start

After installation, try the example:

```bash
npm run example  # Creates a demo markdown file
```

Or convert a real blog post:

```bash
blogmark fetch https://your-favorite-blog.com/article
```

## Installation

### Global Installation (Recommended)

```bash
npm install -g blogmark
```

### Local Installation

```bash
git clone <this-repo>
cd blogmark
npm install
chmod +x cli.js

# Run example demonstration
npm run example

# Run basic tests
npm test
```

## Usage

### Convert a Single URL

```bash
blogmark fetch <url>
```

#### Options

- `-o, --output <file>` - Custom output file path
- `-s, --save-dir <dir>` - Custom output directory (default: `./output`)

#### Examples

```bash
# Convert a blog post to markdown
blogmark fetch https://example.com/blog-post

# Save to a specific file
blogmark fetch https://example.com/blog-post -o my-article.md

# Save to a custom directory
blogmark fetch https://example.com/blog-post -s ./my-blogs
```

### Bulk Conversion

Convert multiple URLs from a file or stdin:

```bash
blogmark bulk [file]
```

#### Options

- `-s, --save-dir <dir>` - Custom output directory (default: `./output`)
- `-c, --concurrency <number>` - Number of concurrent requests (default: 3)
- `-d, --delay <number>` - Delay between requests in milliseconds (default: 1000)
- `--no-continue` - Stop on first error instead of continuing

#### Examples

```bash
# Convert URLs from a file
blogmark bulk urls.txt

# Use custom settings
blogmark bulk urls.txt --concurrency 5 --delay 2000 --save-dir ./articles

# Read URLs from stdin
echo "https://example.com/post1" | blogmark bulk

# Using npm script
npm run bulk urls.txt
```

#### URL File Format

Create a text file with one URL per line:

```
# This is a comment (lines starting with # are ignored)
https://example.com/blog-post-1
https://dev.to/author/article-1
https://medium.com/@author/article-2

# Another comment
https://blog.example.com/latest-post
```

### Interactive Mode

```bash
blogmark interactive
```

In interactive mode, you can:
- Type `#fetch <url>` to convert a single blog post
- Type `#bulk <file>` to convert URLs from a file
- Type `quit` or `exit` to exit

Example session:
```
blogmark> #fetch https://example.com/article
✅ Saved to: ./output/example-article.md

blogmark> #bulk urls.txt
🚀 Starting bulk conversion of 5 URLs...
📁 Output directory: ./output
⚡ Concurrency: 3
⏱️  Delay between requests: 1000ms

[1/5] ✅ Success: article-1.md
[2/5] ✅ Success: article-2.md
...
✅ 5 files saved to: ./output

blogmark> quit
👋 Goodbye!
```

## Features

- **Smart Content Extraction**: Automatically detects main article content from various blog platforms (WordPress, Medium, dev.to, etc.)
- **Bulk Conversion**: Convert hundreds of URLs efficiently with concurrent processing
- **Rate Limiting**: Respectful to target servers with configurable delays and concurrency
- **Clean Markdown Output**: Converts HTML to well-formatted markdown
- **YAML Frontmatter**: Includes metadata like title, date, author, and URL
- **Error Resilience**: Continues processing even if individual URLs fail
- **Progress Tracking**: Real-time progress updates and detailed conversion summaries
- **Flexible Input**: Support for files, stdin, and interactive modes
- **Robust Error Handling**: Gracefully handles network errors and parsing issues
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Output Format

Generated markdown files include YAML frontmatter:

```markdown
---
title: "Blog Post Title"
date: "2025-07-31"
author: "Author Name"
blurb: ""
tags: []
url: "https://original-url.com"
---

# Blog Post Title

Your converted markdown content here...
```

## Content Extraction Strategy

The tool uses a fallback strategy to extract content:

1. **Blog-specific selectors**: `.wp-block-post-content`, `.entry-content`, `.post-content`, etc.
2. **Generic selectors**: `main`, `article`, `.content`
3. **Fallback**: `body` content (with minimum length requirements)

## Requirements

- Node.js >= 14.0.0

## Dependencies

- `axios` - HTTP client for fetching web pages
- `cheerio` - Server-side jQuery implementation for HTML parsing
- `commander` - CLI framework
- `turndown` - HTML to Markdown converter
- `js-yaml` - YAML parser for frontmatter generation

## License

MIT