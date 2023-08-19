---
title: Replacing Google Photos with self-hosted NextCloud Memories
date: 2023-07-09T11:02:00+1200
description: A no-nonsense guide to setting up and configuring the powerful open source alternative
accent: rgb(90, 85, 255)
tags: [technology]
---

Of the many self-hosted Google Photos alternatives, NextCloud Memories is the best I have found. It supports publicly-shared albums, an excellent timeline view, "on this day" and sorting by capture date.

A few things caught me out while getting NextCloud Memories set up, and they weren't always well-documented. Here I'll share a few quick tips.

## Install NextCloud

Memories is a NextCloud app, so you'll need to get NextCloud set up before using it. NextCloud is a bit a of a beast and there are many ways to set it up--I recommend doing your own research here. I used [NextCloud All-in-One](https://github.com/nextcloud/all-in-one) (AIO), a Docker image which spins up and manages supporting images with sensible default configuration. I don't love how AIO manages its own containers (preferrably all dependencies would be in my own Docker compose file) but it is fairly well-documented and comprehensive. Notably, AIO includes pre-configured Redis and NextCloud Office, each of which can otherwise be a hassle to set up.

Once NextCloud is set up, installing Memories is simply a matter of loading the Apps screen, finding "Memories" in the Multimedia category, and installing it!

## Tip 1: NextCloud Memories can only see files NextCloud is aware of

## Tip 2: Keep NextCloud Photos

NextCloud is bundled with an app named Photos. On the surface, Photos serves as an alternative to Google Photos. But while it has good album support, the Photos home screen is really disappointing, with photos sorted by file creation date, not capture date. This makes the screen largely useless if you, like me, have recently copied photos over onto the server.

Memories handles this a lot better so my first thought was to remove the Photos app. But do not do that! Memories relies on the Photos app for many features--most importantly, albums. While Memories will function without Photos, key functionality will be missing.

## Tip 3: Generate thumbnails

- Install preview generator
- Use Imaginary
- Optimise sizes
- Run pregeneration

## Tip 4: Exclude directories from Memories with `.nomedia` files

## Tip 5: Install on mobile as a Progressive Web App
