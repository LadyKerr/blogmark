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
  .command('interactive')
  .description('Interactive mode - type #fetch <url> repeatedly')
  .action(async () => {
    console.log('🔄 Entering interactive mode...');
    console.log('Type "#fetch <url>" to convert a blog post');
    console.log('Type "quit" or "exit" to exit\n');

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
      } else if (input) {
        console.log('❌ Invalid command. Use "#fetch <url>" to convert a blog post.');
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