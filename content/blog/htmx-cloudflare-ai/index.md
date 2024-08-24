---
title: Building a translation app using htmx and CloudFlare Workers AI
date: 2024-08-10T23:15:15+1200
description: I rewrote Obfuscator with a focus on simplicity
accent: rgb(15, 136, 126)
tags: [technology]
---

![Screenshot of Obfuscator](./image-1.png)

I've been recently reading about tools like [htmx](https://htmx.org/) and [Hotwire Turbo](https://turbo.hotwired.dev/). These frameworks rely on sending HTML, not JSON, over the wire, with a focus on graceful degradation and reduced custom client-side JavaScript code. The simplicity is tantalising!

To learn more about this tech, I re-wrote my Obfuscator project using htmx. You can find the latest incarnation [here](https://obfuscator.albert.nz), with source code on [GitHub](https://github.com/albertnis/obfuscator-htmx). The functionality of Obfuscator remains the same as ever: it translates some user-entered text through multiple languages in sequence, returning the result in the original language.

## Then and now

The [first version](/obfuscator) of Obfuscator was written in PHP and used the Bing Translate API, but I had no server to host it on an ongoing basis. The [second version](/serverless-side-rendering) was a React/Redux setup which ran on AWS Lambda plus AWS Machine Translation. It had 174 runtime dependencies for what basically amounts to a simple form with five inputs and a button.

The latest verion is hosted on CloudFlare Pages, my preferred static host these days. There's no framework or additional third-party dependencies to be seen here--just htmx at runtime, plus TypeScript and CloudFlare's CLI for development (thankfully, the CLI wraps all the build shenanigans for backend code). I enjoyed writing a fairly stripped-back frontend in vanilla HTML. As for the backend: it's amazing how painless shipping serverless backend code has become with the likes of Netlify and CloudFlare Pages Functions, compared to when I first wrote Obfuscator in 2016. I was even able use CloudFlare for translation using the [m2m100](https://developers.cloudflare.com/workers-ai/models/m2m100-1.2b/) model which is surfaced as part of CloudFlare Workers AI. It's certainly slower and less accurate than Amazon's offering, but is much cheaper with a perpetual free tier. Besides, accurate translation was never really the point!

## Diving into htmx

One of the cool things about the new Obfuscator is that there is no custom frontend JavaScript. The page is basically just a form with some `data-hx-` attributes added to indicate desired form submission behaviour to htmx. Here's a compacted version of the page:

```html
<!doctype html>
<html lang="en">
	<head>
		<title>Obfuscator</title>
		<!-- Other head fields (omitted) -->
		<meta name="htmx-config" content='{"responseHandling": [{"code":".*", "swap": true}]}' />
	</head>
	<body>
		<form
			action="/obfuscation"
			method="get"
			data-hx-get="/obfuscation"
			data-hx-indicator="#indicator"
			data-hx-disabled-elt="#form-fields"
			data-hx-select="#result"
			data-hx-target="#result"
			data-hx-swap="outerHTML"
			class="form"
		>
			<fieldset id="form-fields">
				<!-- Fields in here (omitted) -->
				<div class="block-submit">
					<button type="submit" class="button">
						<div id="indicator" aria-hidden="true">
							<svg viewBox="-10 -10 20 20" class="loading-spinner"></svg>
						</div>
						<span class="button-content">Obfuscate</span>
					</button>
				</div>
			</fieldset>
		</form>

		<div id="result"></div>
	</body>
</html>
```

The non-htmx form attributes are correct here: the form submits to the `/obfuscation` endpoint using GET, which will return a full HTML page which looks a bit like:

```html
<!doctype html>
<html lang="en">
	<head>
		<title>Obfuscator</title>
		<!-- Other head fields (omitted) -->
	</head>
	<body>
		<div id="result">
			<div class="result-content">
				<span class="result-label">The result:</span>
				<details>
					<summary>The entrance</summary>
					<ol>
						<li><span class="result-lang">English</span> input</li>
						<li><span class="result-lang">Chinese</span> 入口</li>
						<li><span class="result-lang">Russian</span> Вход</li>
						<li><span class="result-lang">Hebrew</span> הכניסה</li>
						<li>
							<b><span class="result-lang">English</span> The entrance</b>
						</li>
					</ol>
				</details>
			</div>
		</div>
		<a href="/">Do another Obfuscation</a>
	</body>
</html>
```

That's a good baseline, and means that the page gracefully degrades in the absence of JavaScript. When htmx is available, however, it does its magic of replacing a full browser form submission with an HTTP call which happens in the background, making the page feel smoother. Once the call is completed, it "swaps" the source page with the response.

This "swapping" can occur in many ways. It can replace the source page entirely, just a part of it, or even disparate elements across it! The behaviour is configured by the various attributes on the submitting element, in this case the form:

```html
<form
	action="/obfuscation"
	method="get"
	data-hx-get="/obfuscation"
	data-hx-indicator="#indicator"
	data-hx-disabled-elt="#form-fields"
	data-hx-select="#result"
	data-hx-target="#result"
	data-hx-swap="outerHTML"
	class="form"
></form>
```

- `data-hx-get="/obfuscation"` re-iterates the `action` and `method` attributes, as in this case htmx should still GET the `/obfuscation` endpoint. Unlike the browser, htmx will do this request in the background when the form is submitted.
- `data-hx-indicator="#indicator"` tells htmx that the element with ID `indicator` is the loading indicator here; htmx will add the `.htmx-request` class to this element while the request is in flight. Styling possibilities ensue.
- `data-hx-disabled-elt="#form-fields"`: htmx will mark this element as `disabled` while the request is in flight. Putting all the fields in a single `fieldset` is a clean way to disable them all using one parent element.
- `data-hx-select="#result"` means htmx will only look at the `#result` element in the response when swapping out the target.
- `data-hx-target="#result"` tells htmx that the `#result` element on this page should swapped with the selected element in the response.
- `data-hx-swap="outerHTML"` ensures the entire `#result` element is replaced with that in the response.

In all these cases, the `data-` prefix is optional and I could use `hx-` directly, but I prefer `data-` for being able to quickly spot custom attributes in HTML.

I like this approach for its graceful fallback. It reminds me a bit of [Turbo Frames](https://turbo.hotwired.dev/handbook/frames), which encourages sending full pages which are surgically selected and swapped.

The last piece of the puzzle is the meta element at the top:

```html
<meta name="htmx-config" content='{"responseHandling": [{"code":".*", "swap": true}]}' />
```

This configures htmx to perform its swapping even if the response is an error--I want errors to be visible to the user! If the input starts with "!!!error" it will trigger an "artificial" 400 error to demonstrate the behaviour.

## What's next

Obfuscator probably won't need much maintenance for the next few years, especially now that there are so few dependencies to update. I'd love to internationalise it someday, or play around with a template engine that isn't just strings. As for htmx: I'm impressed with its simplicity for basic applications like this and I'm keen to try it for something (a little) more complicated.
