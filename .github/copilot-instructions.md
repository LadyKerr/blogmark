# Copilot Instructions for blogmark

## Architecture Overview

blogmark is a Node.js CLI tool with a simple architecture:
- **`cli.js`**: Commander.js-based CLI with two modes: `fetch <url>` and `interactive`
- **`src/blogConverter.js`**: Core `BlogConverter` class handling the entire blog→markdown pipeline
- **`output/`**: Default directory for generated markdown files (gitignored)

## Core Content Extraction Strategy

The heart of blogmark is the **hierarchical selector strategy** in `extractMainContent()`:

```javascript
// Platform-specific selectors tried in order
const selectors = [
  'main .post-content',           // GitHub Blog
  '.entry-content',               // WordPress  
  '.wp-block-post-content',       // Modern WordPress
  '.post-article-content',        // Medium/dev.to
  'main',                         // Generic fallback
  'article',                      // Last resort
];
```

**Key patterns:**
- Always **clone elements** before manipulation to avoid DOM mutation
- **Two-phase cleaning**: Remove unwanted elements both globally and per-selector
- **Content length validation**: 100+ chars for specific selectors, 500+ for fallbacks
- **Aggressive GitHub blog filtering**: Removes newsletter signups, related posts via text matching

## Development Workflows

### Testing Content Extraction
```bash
# Debug with real URLs - shows selector matching and content preview
node cli.js fetch "https://github.blog/some-post" -o debug.md

# Run built-in validation tests
npm test

# Generate example with mock HTML structure  
npm run example
```

### Adding New Blog Platform Support
1. Add platform-specific selectors to the `selectors` array in `extractMainContent()`
2. Update the cleaning logic in the `if (selector === 'main')` branch if needed
3. Test with real URLs from that platform

## Project-Specific Conventions  

### Error Handling Pattern
All user-facing errors use emoji prefixes:
- `🔄` for operations in progress  
- `✅` for success
- `❌` for failures
- `🔍` for debugging info

### Filename Sanitization
Follows strict pattern: `replace(/[^a-z0-9]/gi, '-').toLowerCase()` with deduplication and 100-char limit.

### YAML Frontmatter Structure
Always includes these exact fields in this order:
```yaml
title: "Extracted Title"
date: "YYYY-MM-DD" 
author: "Author Name"
blurb: ""           # Always empty placeholder
tags: []            # Always empty array
url: "original-url"
```

## Integration Points

### External Dependencies
- **axios**: 10-second timeout, browser-like User-Agent to avoid bot detection
- **cheerio**: Server-side jQuery for HTML parsing and manipulation  
- **turndown**: HTML→markdown with `atx` headings and `fenced` code blocks
- **js-yaml**: Frontmatter generation with `forceQuotes: true`

### CLI Integration  
Interactive mode uses readline with `blogmark>` prompt and `#fetch <url>` commands. Exit with `quit`/`exit`.

## Critical Implementation Details

### Content Length Strategy
- Platform selectors: minimum 100 characters
- Fallback selectors: minimum 500 characters  
- Throws descriptive error if insufficient content found

### GitHub Blog Specific Handling
GitHub blog requires special text-based filtering to remove promotional content:
```javascript
if (text.includes('more on') || text.includes('newsletter')) {
  $(this).remove();
}
```

### Date Parsing Hierarchy
Tries multiple meta tags and element selectors for publish dates, with graceful fallback to current date.
