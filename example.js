#!/usr/bin/env node

// Example demonstration of blogmark functionality
const BlogConverter = require('./src/blogConverter');
const fs = require('fs').promises;
const path = require('path');

async function createExample() {
  console.log('📖 Creating example markdown file...\n');
  
  const converter = new BlogConverter();
  
  // Mock HTML content (like what would be fetched from a blog)
  const mockHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>10 Tips for Better Code Documentation</title>
      <meta name="author" content="Jane Developer">
      <meta property="article:published_time" content="2025-07-31T10:00:00Z">
    </head>
    <body>
      <nav>Navigation menu (this will be removed)</nav>
      <header>Header content (this will be removed)</header>
      
      <main>
        <article class="post-content">
          <h1>10 Tips for Better Code Documentation</h1>
          
          <p>Good documentation is crucial for maintaining and scaling software projects. Here are some essential tips to improve your documentation practices.</p>
          
          <h2>1. Write for Your Future Self</h2>
          <p>When writing documentation, imagine you're explaining the code to yourself six months from now. What context would you need?</p>
          
          <h2>2. Use Clear Examples</h2>
          <p>Include practical examples that show <strong>how</strong> to use the code, not just <em>what</em> it does.</p>
          
          <pre><code>// Good example
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
          </code></pre>
          
          <h2>3. Keep It Updated</h2>
          <p>Outdated documentation is worse than no documentation. Make updating docs part of your development workflow.</p>
          
          <blockquote>
            <p>"The best documentation is the one that gets updated alongside the code."</p>
          </blockquote>
          
          <h2>Conclusion</h2>
          <p>Good documentation takes time but pays dividends in team productivity and code maintainability.</p>
        </article>
      </main>
      
      <footer>Footer content (this will be removed)</footer>
      <script>console.log('This script will be removed');</script>
    </body>
    </html>
  `;
  
  // Extract content and convert to markdown
  const extractedData = converter.extractMainContent(mockHtml, 'https://example.com/documentation-tips');
  const markdown = converter.convertToMarkdown(extractedData);
  
  // Save the example file
  const examplePath = path.join(__dirname, 'output', 'example-documentation-tips.md');
  await fs.mkdir(path.dirname(examplePath), { recursive: true });
  await fs.writeFile(examplePath, markdown, 'utf8');
  
  console.log(`✅ Example file created: ${examplePath}`);
  console.log('\n📄 Generated content preview:');
  console.log('─'.repeat(50));
  console.log(markdown.substring(0, 500) + '...');
  console.log('─'.repeat(50));
  console.log('\n🎯 This demonstrates how blogmark extracts and converts blog content!');
  console.log('📁 Check the output/ directory to see the complete generated file.');
}

createExample().catch(console.error);
