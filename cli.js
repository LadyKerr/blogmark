#!/usr/bin/env node

const { Command } = require('commander');
const readline = require('readline');
const BlogConverter = require('./src/blogConverter');

const program = new Command();
const converter = new BlogConverter();

program
  .name('blogmark')
  .description('Convert web blog posts to markdown files with frontmatter')
  .version('1.0.0');

program
  .command('fetch')
  .description('Convert a single blog URL to markdown')
  .argument('<url>', 'Blog URL to convert')
  .option('-o, --output <file>', 'Custom output file path')
  .option('-s, --save-dir <dir>', 'Custom output directory', './output')
  .action(async (url, options) => {
    try {
      await converter.convertUrl(url, options.output, options.saveDir);
    } catch (error) {
      console.error(`❌ Conversion failed: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('bulk')
  .description('Convert multiple URLs to markdown from a file or stdin')
  .argument('[file]', 'File containing URLs (one per line) - if not provided, reads from stdin')
  .option('-s, --save-dir <dir>', 'Custom output directory', './output')
  .option('-c, --concurrency <number>', 'Number of concurrent requests', '3')
  .option('-d, --delay <number>', 'Delay between requests in milliseconds', '1000')
  .option('--no-continue', 'Stop on first error instead of continuing')
  .action(async (file, options) => {
    try {
      let urls;
      
      if (file) {
        // Read URLs from file
        urls = await converter.parseUrlsFromFile(file);
      } else {
        // Read URLs from stdin
        console.log('📝 Enter URLs (one per line). Press Ctrl+D (Unix) or Ctrl+Z (Windows) when done:\n');
        
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        const inputUrls = [];
        
        for await (const line of rl) {
          const url = line.trim();
          if (url && !url.startsWith('#')) {
            try {
              new URL(url);
              inputUrls.push(url);
            } catch {
              console.log(`⚠️  Skipping invalid URL: ${url}`);
            }
          }
        }
        
        urls = inputUrls;
      }

      if (urls.length === 0) {
        console.log('❌ No valid URLs found to process.');
        process.exit(1);
      }

      const bulkOptions = {
        outputDir: options.saveDir,
        concurrency: parseInt(options.concurrency),
        delay: parseInt(options.delay),
        continueOnError: options.continue !== false
      };

      const results = await converter.convertUrlBulk(urls, bulkOptions);
      
      // Exit with appropriate code
      process.exit(results.failed.length > 0 ? 1 : 0);
      
    } catch (error) {
      console.error(`❌ Bulk conversion failed: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('interactive')
  .description('Interactive mode - type #fetch <url> or #bulk <file> repeatedly')
  .action(async () => {
    console.log('🔄 Entering interactive mode...');
    console.log('Commands:');
    console.log('  #fetch <url>   - Convert a single blog post');
    console.log('  #bulk <file>   - Convert URLs from a file');
    console.log('  quit/exit      - Exit interactive mode\n');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'blogmark> '
    });

    rl.prompt();

    rl.on('line', async (line) => {
      const input = line.trim();
      
      if (input === 'quit' || input === 'exit') {
        console.log('👋 Goodbye!');
        rl.close();
        return;
      }

      if (input.startsWith('#fetch ')) {
        const url = input.substring(7).trim();
        
        if (!url) {
          console.log('❌ Please provide a URL: #fetch <url>');
          rl.prompt();
          return;
        }

        // Validate URL format
        try {
          new URL(url);
        } catch (error) {
          console.log('❌ Invalid URL format. Please provide a valid URL.');
          rl.prompt();
          return;
        }

        try {
          await converter.convertUrl(url);
          console.log('');
        } catch (error) {
          console.error(`❌ Conversion failed: ${error.message}\n`);
        }
      } else if (input.startsWith('#bulk ')) {
        const filepath = input.substring(6).trim();
        
        if (!filepath) {
          console.log('❌ Please provide a file path: #bulk <file>');
          rl.prompt();
          return;
        }

        try {
          const urls = await converter.parseUrlsFromFile(filepath);
          
          if (urls.length === 0) {
            console.log('❌ No valid URLs found in file.');
            rl.prompt();
            return;
          }

          const bulkOptions = {
            outputDir: './output',
            concurrency: 3,
            delay: 1000,
            continueOnError: true
          };

          await converter.convertUrlBulk(urls, bulkOptions);
          console.log('');
        } catch (error) {
          console.error(`❌ Bulk conversion failed: ${error.message}\n`);
        }
      } else if (input) {
        console.log('❌ Invalid command. Use "#fetch <url>" or "#bulk <file>".');
      }
      
      rl.prompt();
    });

    rl.on('close', () => {
      console.log('👋 Goodbye!');
      process.exit(0);
    });
  });

// Handle case where no command is provided
program.parse();

if (!process.argv.slice(2).length) {
  program.outputHelp();
}