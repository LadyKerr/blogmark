#!/usr/bin/env node

// Simple test script to validate the BlogConverter functionality
const BlogConverter = require('./src/blogConverter');

async function runTests() {
  const converter = new BlogConverter();
  
  console.log('🧪 Running basic functionality tests...\n');
  
  // Test 1: URL validation
  console.log('Test 1: URL validation');
  try {
    await converter.convertUrl('invalid-url');
  } catch (error) {
    console.log('✅ URL validation working - rejected invalid URL');
  }
  
  // Test 2: Filename sanitization
  console.log('\nTest 2: Filename sanitization');
  const testTitle = 'This is a Test! Title with @#$% Special Characters';
  const sanitized = converter.sanitizeFilename(testTitle);
  console.log(`Original: "${testTitle}"`);
  console.log(`Sanitized: "${sanitized}"`);
  console.log(sanitized === 'this-is-a-test-title-with-special-characters' ? '✅ Sanitization working' : '❌ Sanitization failed');
  
  // Test 3: Date parsing
  console.log('\nTest 3: Date parsing');
  const testDate = converter.parseDate('2025-07-31T10:30:00Z');
  console.log(`Parsed date: ${testDate}`);
  console.log(testDate === '2025-07-31' ? '✅ Date parsing working' : '❌ Date parsing failed');
  
  // Test 4: Markdown conversion
  console.log('\nTest 4: HTML to Markdown conversion');
  const mockData = {
    title: 'Test Article',
    content: '<h1>Test</h1><p>This is a <strong>test</strong> article.</p>',
    author: 'Test Author',
    publishDate: '2025-07-31',
    url: 'https://example.com/test'
  };
  
  const markdown = converter.convertToMarkdown(mockData);
  console.log('Generated markdown preview:');
  console.log(markdown.substring(0, 200) + '...');
  console.log(markdown.includes('---') && markdown.includes('title:') ? '✅ Markdown conversion working' : '❌ Markdown conversion failed');
  
  console.log('\n🎉 Basic tests completed!');
  console.log('\nTo test with real URLs, try:');
  console.log('node cli.js fetch <actual-blog-url>');
}

runTests().catch(console.error);
