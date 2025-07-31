const axios = require('axios');
const cheerio = require('cheerio');
const TurndownService = require('turndown');
const yaml = require('js-yaml');
const fs = require('fs').promises;
const path = require('path');
const { URL } = require('url');

class BlogConverter {
  constructor() {
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    });
    
    // Remove unwanted elements
    this.turndownService.remove(['script', 'style', 'nav', 'header', 'footer', 'aside', '.ad', '.advertisement']);
  }

  async fetchBlogPost(url) {
    try {
      console.log(`🔄 Fetching content from ${url}...`);
      
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`❌ Failed to fetch URL: ${error.message}`);
    }
  }

  extractMainContent(html, url) {
    const $ = cheerio.load(html);
    
    // Remove unwanted elements first
    const removeSelectors = [
      'script',
      'style',
      'nav',
      'header',
      'footer',
    const selectors = [
      // === GitHub Blog Specific Selectors ===
      'main .post-content',
      'main article .post-content', 
      '.post-content',

      // === WordPress and Common Blog Selectors ===
      '.entry-content', 
      '.wp-block-post-content',
      '.post-body',
      '.article-content',
      '.blog-post-content',

      // === Medium, dev.to, and Similar Platforms ===
      '.post-article-content',
      '.article-body',

      // === Main Content Containers (try to exclude navigation/sidebar/etc) ===
      'main',

      // === Generic Fallbacks ===
      'main article',
      '[role="main"] article',
      'main .content',
      'article',
      '.content'
    ];
      '.wp-block-post-content',
      '.post-body',
      '.article-content',
      '.blog-post-content',
      // Medium and dev.to
      '.post-article-content',
      '.article-body',
      // Try getting everything in main but exclude certain elements
      'main',
      // Generic fallbacks
      'main article',
      '[role="main"] article',
      'main .content',
      'article',
      '.content'
    ];

    let content = '';
    // Extract title
    const h1Title = $('h1').first().text().trim();
    const pageTitle = $('title').text().trim();
    const ogTitle = $('meta[property="og:title"]').attr('content');
    title = h1Title || pageTitle || ogTitle || 'Untitled';
    title = $('h1').first().text().trim() || 
            $('title').text().trim() || 
            $('meta[property="og:title"]').attr('content') || 
            'Untitled';

    // Extract author
    const metaAuthor = $('meta[name="author"]').attr('content');
    const metaArticleAuthor = $('meta[property="article:author"]').attr('content');
    const authorClass = $('.author').first().text().trim();
    const bylineClass = $('.byline').first().text().trim();
    author = metaAuthor || metaArticleAuthor || authorClass || bylineClass || '';

    // Extract publish date
    const dateSelectors = [
      'meta[property="article:published_time"]',
      'meta[name="publish-date"]',
      'time[datetime]',
      '.published',
      '.date'
    ];
    for (const selector of dateSelectors) {
      const dateEl = $(selector);
      if (dateEl.length) {
        // For <time> elements, prioritize 'datetime' attribute
        if (selector === 'time[datetime]') {
          publishDate = dateEl.attr('datetime') || dateEl.attr('content') || dateEl.text().trim();
        } else {
          publishDate = dateEl.attr('content') || dateEl.attr('datetime') || dateEl.text().trim();
        }
        if (publishDate) break;
      }
    }
    }

    // Try to extract main content using specific selectors
    for (const selector of selectors) {
      const element = $(selector);
      if (element.length) {
        console.log(`🔍 Trying selector: ${selector}, found ${element.length} elements`);
        
        // Clone the element to avoid modifying the original
        const $clonedElement = element.clone();
        
        // For 'main' selector, be more aggressive about removing non-content
        if (selector === 'main') {
          // Remove specific non-content sections within main
          $clonedElement.find('.author-bio, .post-meta, .share-buttons, .tags, .related-posts, .newsletter-signup, .explore-more, .site-footer, .breadcrumb, .pagination, .sidebar, .widget, nav, header, footer, aside').remove();
          
          // For GitHub blog, also remove the bottom sections
          $clonedElement.find('.more-on, .related-posts, .explore-more, .site-wide-links, .additional-links, .newsletter, .subscription-form, [class*="newsletter"], [class*="related"], [class*="explore"]').remove();
          
          // Remove elements with specific text patterns that indicate non-content
          $clonedElement.find('*').each(function() {
            const text = $(this).text().trim().toLowerCase();
            if (text.includes('more on') || 
                text.includes('related posts') || 
                text.includes('explore more') || 
                text.includes('newsletter') ||
                text.includes('subscribe') ||
                text.includes('we do newsletters')) {
              $(this).remove();
            }
          });
        const htmlContent = $clonedElement.html();
        if (htmlContent !== null) {
          content = htmlContent;
        }
        
        if (content && content.trim().length >= 100) {
          console.log(`🎯 Found content using selector: ${selector} (${content.trim().length} chars)`);
          
          // For debugging, let's see what we got
          const preview = content.replace(/<[^>]*>/g, '').substring(0, 200);
          console.log(`📄 Content preview: ${preview}...`);
          break;
        }
          // For debugging, let's see what we got
          const preview = content.replace(/<[^>]*>/g, '').substring(0, 200);
          console.log(`📄 Content preview: ${preview}...`);
          break;
        }
      }
    }

    // Enhanced fallback strategy
    if (!content || content.trim().length < 100) {
      console.log('🔍 Trying enhanced fallback strategy...');
      
      // Try to find content by looking for common patterns
      const fallbackSelectors = [
        'main',
        '[role="main"]',
        '.main-content',
        '#main-content',
        '.page-content',
        'body .content',
        'body'
      ];
      
      for (const selector of fallbackSelectors) {
        const element = $(selector);
        if (element.length) {
          const $cloned = element.clone();
          
          // Remove navigation, sidebars, and other non-content elements
          $cloned.find('nav, header, footer, aside, .navigation, .sidebar, .ad, .advertisement, .widget, .related-posts, .newsletter-signup, .explore-more, .site-footer, .breadcrumb, .pagination').remove();
          
          content = $cloned.html();
          
          if (content && content.trim().length >= 500) {
            console.log(`🎯 Found content using fallback selector: ${selector} (${content.length} chars)`);
            break;
          }
        }
      }
    }

    if (!content || content.trim().length < 100) {
      throw new Error('❌ Could not extract sufficient content from the page');
    }

    // Final cleanup of the extracted content
    const $finalContent = cheerio.load(content);
    $finalContent('script, style, nav, header, footer, aside, .ad, .advertisement, .sidebar, .widget, .related-posts, .newsletter-signup, .explore-more, .site-footer, .breadcrumb, .pagination, .author-bio, .tags, .share-buttons').remove();
    
    return {
      title: this.sanitizeTitle(title),
      content: $finalContent.html(),
      author: author.replace(/^by\s+/i, '').trim(),
      publishDate: this.parseDate(publishDate),
      url
    };
  }

  convertToMarkdown(extractedData) {
    const { title, content, author, publishDate, url } = extractedData;
    
    // Convert HTML to markdown
    const markdown = this.turndownService.turndown(content);
    
    // Create frontmatter
    const frontmatter = {
      title: title,
      date: publishDate || new Date().toISOString().split('T')[0],
      author: author,
      blurb: '',
      tags: [],
      url: url
    };

    const yamlFrontmatter = yaml.dump(frontmatter, { 
      quotingType: '"',
      forceQuotes: true 
    });

    return `---\n${yamlFrontmatter}---\n\n${markdown}`;
  }

  sanitizeTitle(title) {
    return title.replace(/[^\w\s-]/g, '').trim();
  }

  sanitizeFilename(title) {
    return title
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100) || 'untitled';
  }

  parseDate(dateString) {
    if (!dateString) return new Date().toISOString().split('T')[0];
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    
    return date.toISOString().split('T')[0];
  }

  async saveMarkdown(markdownContent, title, outputDir = './output') {
    try {
      // Ensure output directory exists
      await fs.mkdir(outputDir, { recursive: true });
      
      const filename = `${this.sanitizeFilename(title)}.md`;
      const filepath = path.join(outputDir, filename);
      
      await fs.writeFile(filepath, markdownContent, 'utf8');
      
      console.log(`✅ Saved to: ${filepath}`);
      return filepath;
    } catch (error) {
      throw new Error(`❌ Failed to save file: ${error.message}`);
    }
  }

  async convertUrl(url, outputPath = null, outputDir = './output') {
    try {
      // Validate URL
      new URL(url);
      
      const html = await this.fetchBlogPost(url);
      const extractedData = this.extractMainContent(html, url);
      const markdown = this.convertToMarkdown(extractedData);
      
      if (outputPath) {
        await fs.writeFile(outputPath, markdown, 'utf8');
        console.log(`✅ Saved to: ${outputPath}`);
        return outputPath;
      } else {
        return await this.saveMarkdown(markdown, extractedData.title, outputDir);
      }
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
}

module.exports = BlogConverter;