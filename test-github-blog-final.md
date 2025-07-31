---
title: "GitHub for Beginners Test-driven development TDD with GitHub Copilot - The GitHub Blog"
date: "2025-05-26"
author: "Kedasha Kerr"
blurb: ""
tags: []
url: "https://github.blog/ai-and-ml/github-copilot/github-for-beginners-test-driven-development-tdd-with-github-copilot/"
---

[Kedasha Kerr](https://github.blog/author/ladykerr/ "Posts by Kedasha Kerr")·[@ladykerr](https://github.com/ladykerr)

May 26, 2025

| 6 minutes

*   Share:
*   [](https://x.com/share?text=GitHub%20for%20Beginners%3A%20Test-driven%20development%20%28TDD%29%20with%20GitHub%20Copilot&url=https%3A%2F%2Fgithub.blog%2Fai-and-ml%2Fgithub-copilot%2Fgithub-for-beginners-test-driven-development-tdd-with-github-copilot%2F)
*   [](https://www.facebook.com/sharer/sharer.php?t=GitHub%20for%20Beginners%3A%20Test-driven%20development%20%28TDD%29%20with%20GitHub%20Copilot&u=https%3A%2F%2Fgithub.blog%2Fai-and-ml%2Fgithub-copilot%2Fgithub-for-beginners-test-driven-development-tdd-with-github-copilot%2F)
*   [](https://www.linkedin.com/shareArticle?title=GitHub%20for%20Beginners%3A%20Test-driven%20development%20%28TDD%29%20with%20GitHub%20Copilot&url=https%3A%2F%2Fgithub.blog%2Fai-and-ml%2Fgithub-copilot%2Fgithub-for-beginners-test-driven-development-tdd-with-github-copilot%2F)

Welcome to the next episode in our GitHub for Beginners series, where we’re diving into the world of [GitHub Copilot](https://www.youtube.com/watch?v=n0NlxUyA7FI&list=PL0lo9MOBetEFcp4SCWinBdpml9B2U25-f&index=6). We’re now on our seventh episode, and we’ve covered quite a lot of ground. You can check out all our previous episodes on [our blog](https://github.blog/tag/github-for-beginners/) or [as videos](https://www.youtube.com/playlist?list=PL0lo9MOBetEFcp4SCWinBdpml9B2U25-f).

Today we’re going to dive into the world of testing, a much needed but historically tedious part of the development process. This is especially true as our codebase becomes larger and more complex. Fortunately, we can use GitHub Copilot to help automate some of this process.

After all, one of the most basic questions we have when writing code is: “Does it work?”

## Testing 101

Before we jump into how to use GitHub Copilot to write some tests, we should talk about testing, why it’s important, and different ways to test your code. Be aware that test testing is a very deep topic, and we’ll only be touching the surface here. Covering the nuances of testing would be an entire course in and of itself.

So why is testing important? In short, it’s how you make sure that your code does what you expect.

![A slide explaining 'Why are tests important? Ensures code is working as expected.'](https://github.blog/wp-content/uploads/2025/05/01-testing-important.png?resize=1024%2C573)

Testing can take many different forms, such as:

*   **Acceptance tests:** Tests that ensure your app meets a set of defined functionality.
*   **Integration tests:** Tests that verify your app can talk across various systems such as databases and APIs.
*   **Unit tests:** Tests focused on breaking the code into small, isolated pieces called units. These make sure the individual units do exactly what you’d expect them to do.

## Writing unit tests

As we just covered, unit tests work by breaking down your code into smaller chunks that are easier to test. Making sure each individual piece is doing what it’s supposed to do increases confidence that the entire app will work when you put all the pieces together.

One of the great things about unit tests is that you can automate the process. Once you’ve created a large battery of tests, you can literally run thousands of tests with a single command. This gives you a good indicator regarding the health of your application. By regularly running these tests, you’ll also discover if any changes to your code broke something you might not have been expecting.

So how do you use GitHub Copilot to create some unit tests?

1.  Open up your code and highlight a section that you want to test. For example, you might highlight a specific function.
2.  Open up Copilot Chat. You might notice that Copilot suggests using the `/tests` slash command to write tests.
3.  Send Copilot the following prompt:

```
/tests add unit tests for my code
```

4.  If Copilot asks if you want to configure a test framework, select `Dismiss`.

5.  Review the plan and code suggestions to make sure you understand what changes Copilot is going to make.
6.  Click the **Add to new file** button at the top of the code suggestion to create the tests.
7.  Save the new file.
8.  Run the tests by running the following command in your terminal:

```
python -m pytest
```

Congratulations! You just added some unit tests to your code! If you’d like to see a demo of this in action, make sure to watch the video!

## Test-driven development

Now that you’ve seen how to write some unit tests, let’s talk a little bit about test-driven development (TDD). What exactly is TDD? It’s a process where you use the tests to drive how you develop your code. When using TDD, you write your tests first, and then create the implementation afterward.

The process takes a little bit of adjusting how you think about development, but it does come with several advantages. It gives you the opportunity to see how your code will behave and ensure the tests you’re writing are testing what you expect them to test. 

A concept that can be helpful for wrapping your brain around this is called “red, green, refactor.” In this process, you create the tests first, and they fail. They might not even build! This is the red stage.

![A slide explaining Red, Green, Refactor steps:
1. Write tests first
2. Tests fail because there's no code (red!)
3. Write just enough code to allow tests to pass
4. Rerun the test to see it pass (green!)
5. Refactor and clean up code](https://github.blog/wp-content/uploads/2025/05/red_green_refactor.png?resize=1024%2C573)

Then you write just enough code to get your tests to pass. For example, if you’re writing a test that makes sure an error is thrown if a number is less than 0, you write just enough code to throw that error on that condition. When you return to the test, it now passes. You’ve actively made a change to the codebase to implement the desired functionality. This is the green stage. 

Finally, you implement any refactoring to make the code look good. Now that it works, you can focus on making it pretty. The entire time you are working on this, you keep running the unit tests to make sure your changes don’t break anything. As you probably guessed, this is the refactor stage.

GitHub Copilot can help you with TDD. It’s one of the hidden little tricks that Copilot is able to do—you can tell it code will exist and generate tests based on that information. For example, if you were working on an email validation app, you could send the following prompt to Copilot Chat:

```
I'm going to be adding a new validator function for usernames. Usernames must be between 3 and 16 characters, start with a letter or an underscore, not use multiple underscores to start, and after the first character chan have letters, numbers, and underscores. Just create the new test functions.
```

This prompt provides the criteria that you’re expecting and gives it to Copilot. Copilot will then use this prompt to generate unit tests to test that functionality. If you ran these tests, they would fail, because you’ve only created the tests. Red stage.

Now, to move on to the green stage, you could send Copilot the following prompt:

```
Create the implementation
```

Copilot will now generate the code to make sure these tests pass. Now when you add this code to your validators and rerun the tests, they pass. Green stage.

Thanks to Copilot’s help, we’ve gone through some TDD and have code that works.

## Best practices

Remember that unit tests are code. In order to make them more palatable to others, you should follow follow several of the same coding standards you’d use for production code:

*   Add documentation to your tests
*   Keep your tests organized
*   Create utilities to write your tests faster
*   Update your tests as you make changes to your code

We don’t have time to cover every aspect of TDD or unit testing, but there are plenty of resources available. Here are some to get you started:

*   [Accelerate TDD with AI](https://github.com/readme/guides/github-copilot-automattic)
*   [How to generate unit tests with GitHub Copilot](https://github.blog/ai-and-ml/github-copilot/how-to-generate-unit-tests-with-github-copilot-tips-and-examples/)
*   [Generating unit tests with GitHub Copilot](https://docs.github.com/copilot/copilot-chat-cookbook/testing-code/generate-unit-tests)
*   [Writing tests with GitHub Copilot](https://docs.github.com/copilot/using-github-copilot/guides-on-using-github-copilot/writing-tests-with-github-copilot)

## Your next steps

Testing is an essential part of development. Having tools like GitHub Copilot that make tests less tedious to write improves your code and gives you more time to focus on the parts of coding you enjoy.

Don’t forget that you can [use GitHub Copilot for free](https://gh.io/gfb-copilot)! If you have any questions, pop them in the [GitHub Community thread](https://github.com/orgs/community/discussions/152688), and we’ll be sure to respond. Join us for the next part in this series, which will be our final episode of the season. 

Happy coding!

Need some help testing your code and keeping it all running smoothly? Give [GitHub Copilot](https://github.com/features/copilot) a try!

* * *

## Tags:

*   [GitHub Copilot](https://github.blog/tag/github-copilot/)
*   [GitHub for beginners](https://github.blog/tag/github-for-beginners/)
*   [Test-driven development](https://github.blog/tag/test-driven-development-2/)

## Written by