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

### Interactive Mode

```bash
blogmark interactive
```

In interactive mode, you can:
- Type `#fetch <url>` to convert a blog post
- Type `quit` or `exit` to exit

Example session:
```
blogmark> #fetch https://example.com/article
✅ Saved to: ./output/example-article.md

blogmark> #fetch https://dev.to/author/post
✅ Saved to: ./output/author-post.md

blogmark> quit
👋 Goodbye!
```

## Features

- **Smart Content Extraction**: Automatically detects main article content from various blog platforms (WordPress, Medium, dev.to, etc.)
- **Clean Markdown Output**: Converts HTML to well-formatted markdown
- **YAML Frontmatter**: Includes metadata like title, date, author, and URL
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