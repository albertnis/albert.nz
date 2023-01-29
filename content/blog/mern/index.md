---
layout: post
title: Adventures with the MERN Stack
description: Teaching myself full-stack JavaScript with a WYSIWYG CMS of sorts
date: 2017-07-04T23:23:25+1300
thumb: /resources/2017-07-04-mern/mern-1.png
categories: posts
accent: rgb(70, 140, 152)
links:
  - <a href="https://github.com/albertnis/level">Github</a>
---

![][one]

_Beautifully generic._

Never fear: Hex Solutions isn't an actual company. Rather, I imagined the overly vague company in a recent project which I used to teach myself all about full stack JavaScript web development. While the project was more or less completely contrived, it does address a problem summarised below:

_What if an individual or small company wants a basic, maintainable, and elegant landing page without the fuss of an entire platform such as Wordpress?_

From this precept, Level was born. The idea of Level is to make content editing by the user trivially simple even for those with little technological prowess. The user can login securely without any page reloads or navigation and start editing the page straight away.

## The User Workflow

First of all, the user scrolls to the bottom of the page to find the login link:

![][two]

Clicking this link shows the login form, where credentials can be entered:

![][three]

If the credentials are correct, the page enters editing mode. This is all done with no page reloads or redirects.

![][four]

Dynamic fields are now editable throughout the page. As the user edits a field, the save status is shown in the toolbar. Changes are sent to the server, debounced by several seconds from user input to prevent request spamming.

![][five]

The user is notified when the server has received and stored changes:

![][six]

The process allows for simple editing. The user can see what field they are editing, can toggle spellcheck, and can logout at any time.

![][seven]

## The Technical Details

The app is full-stack and entirely written in JavaScript using the MERN stack. Here's a quick summary of how the stack works in Level:

- **MongoDB:** Uses two collections: one for users and one for fields.
- **Express:** Handles the app routing. Level is more or less single-page, so there's nothing too fancy here, but there are routes set up for actions such as logins, logouts and field edits.
- **React:** The app is built on React.js. Interface files are used for both client-side and server-side rendering.
- **Node.js:** The runtime used for Level.

There are other key libraries which I used:

- **Redux:** Used for state management and action dispatching. In other words, a lot of heavy lifting!
- **redux-observable:** Brings RxJS to redux. In Level it takes care of the AJAX workload; namely, sending login attempts and edits. It also has neat functionality for debouncing those edits before sending.
- **Passport:** Server-side authentication management. Used with a few session libraries, makes user management quite convenient. Obviously, changes will only be pushed to the database if an authenticated session is detected.

## Reflections

What an adventure! Five years ago, I avoided JavaScript where possible. So much of what I saw JavaScript used for could be easily accomplished by other means (often CSS animations). Diving into this project opened my eyes to some interesting things.

- **ES2016 makes JavaScript simpler.** Level was developed using babel through Webpack to compile JavaScript files. While this can seem like an unnecessary evil, it means ES2016 can be used. This flavour of JavaScript has some neat features, one of which is no semicolons. A friend commented that the ES2016 code looked more 'Pythonic' due to the lack of semicolons and presence of import/export statements.
- **Server side rendering is awesome.** I mean, it's nothing new, really. PHP, Python, and just about any backend language do the exact same thing when used to generate websites. What's cool about the full-stack JavaScript approach is that the server code can be pointed at the _exact same code_ used for frontend rendering. Obviously, Webpack bundling means that server and client are using different JavaScript files, but server-side rendering enables React to pick up directly where the server left off and start handling the page right after initial load. This was a huge discovery for me: in the past JavaScript seemed to me like something which had to painstakingly hook into various pre-rendered components to attach listeners and the like. This way, your app is 'delivered' to the client in a ready-to-go form.
- **MongoDB is surprisingly simple.** It's just saving JSON files. And because the whole app is in JavaScript, JSON is ridiculously convenient. Mongoose makes interactions with the database in code straightforward. At least for smaller projects, it seems more convenient than SQL.
- **Redux took a while to learn**. There are reducers, actions, and connections to manage, not to mention the state itself. I found Redux to be one of those 'practice makes perfect' things. I'm nowhere near perfect but I can get actions whipping through the app pretty quickly now, and linking them to components seems like less of a chore than it did initially.
- **I recommend source maps**. I'll admit it: I barely realised what a source map was, let alone how it could help me. That was, until halfway through the project. Webpack can easily generate source maps and it makes debugging many times easier than probing code with 'console.log'.

While Level is most certainly a solution looking for a problem, the app has taught me a great deal about full-stack development. Relatively simple projects like this are great for getting to grips with new ways of doing things, especially in a world with so many JavaScript frameworks floating around. I don't have access to a Node.js host for Level, but if I ever needed a simple single page for something, I might just dust off Level someday.

[one]: ./mern-1.png
[two]: ./mern-2.png
[three]: ./mern-3.png
[four]: ./mern-4.png
[five]: ./mern-5.png
[six]: ./mern-6.png
[seven]: ./mern-7.png
