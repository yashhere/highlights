# Highlights

![Screenshot of the website](assets/images/screenshot.png?raw=true)

Nothin’ fancy, just a little Eleventy/Netlify minisite for book and article highlights: [highlights.yashagarwal.in](https://highlights.yashagarwal.in) Highlights and covers are copyright to their respective authors. [Let’s be book friends](https://www.goodreads.com/yashhere)

## Data syntax

### Book front-page matter

```
---
layout: post
title: ""
book: dash-separated
author:
  -
kindle: true
date: YYYY-MM-DD
tags:
  -
rating: number
review: true
---
```

Where "dash-separated" is also the file name for the *JPG* book covers.

### Each Book

Map's key is book' name (as it appears in `My Clippings.txt`) and the value is array in which the highlights are stored according to the following structure.
```
"book_name": [
  {
    "loc": "",
    "page": "",
    "authors": [],
    "date": "",
    "content": ""
  }
]
```