# Vortek-blog-engine

A static blog engine powered by Nodejs


# How to use

create blog post by create a blog post md file in posts folder.
**posts/new-post.md**

first add some metadata at top of file:
```
title: Test math
date: 2017-01-07 15:43:23
tags: math, research
description: Just a test case....
visible: 1
--metadata--
```
then after add content of your blog post in markdown format.

```sh
$ node generator.js
```
