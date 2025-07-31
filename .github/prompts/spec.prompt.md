---
mode: 'agent'
description: build the mvp
---

Build a Node.js CLI tool called "blogmark" that converts web blog posts to markdown files with frontmatter. 

Requirements:

Core Functionality:

Fetch HTML content from any blog URL
Extract main article content (ignore nav, ads, sidebars)
Convert HTML to clean markdown
Generate files with YAML frontmatter (title, date, author, tags, url)
Save to output directory with sanitized filenames

CLI Interface (use Commander.js):

`blogmark fetch <url>` - Convert single URL
`-o, --output <file>` - Custom output path
`-s, --save-dir <dir>` - Custom output directory (default: ./output)
`blogmark interactive` - Interactive mode where users type #fetch <url> repeatedly

Technical Specifications:

Use axios for HTTP requests with browser-like User-Agent
Use cheerio for HTML parsing with fallback selector strategy:
Try blog-specific selectors first: .wp-block-post-content, .entry-content, .post-content, main, article
Fallback to body if no main content found
Require minimum 200 chars for specific selectors, 500 for fallback
Use turndown for HTML→markdown conversion
Remove unwanted elements: scripts, styles, nav, headers, footers, ads
Auto-create output directories
Handle errors gracefully with emoji-enhanced console messages (✅❌🔄)


File Output Format:
````markdown
---
title: "Blog Post"
date: 2025-07-30
author: ""
blurb: ""
tags: []
url: https://original-url.com
---

[converted markdown content]
```

Package Configuration:

Make it installable globally via npm as blogmark command
Require Node.js >=14.0.0
Include proper shebang for CLI execution
Exclude output directory from git/npm

Key Implementation Details:

Sanitize filenames: replace(/[^a-z0-9]/gi, '-').toLowerCase()
Use 10-second HTTP timeout
Interactive mode: exit with "quit"/"exit", validate URLs
Single class BlogConverter with methods: fetchBlogPost(), extractMainContent(), convertToMarkdown()

Focus on robust content extraction since different websites use different HTML structures. The tool should work reliably across WordPress, Medium, dev.to, and custom blog platforms.
