Starkups
========

A lightweight markup language for journals.  
<https://starkups.s.zeid.me/>

Copyright (c) 2015-2023 [S. Zeid](https://s.zeid.me/).  
Released under [the X11 License](https://tldrlegal.com/l/x11).


## What does it look like?

It looks like this:

    Title
    Subtitle
    
    
    Entry 1	(that's a tab stop) Name of entry
    **Lorem ipsum**, dolor *sit* amet....
    
    Yes, Markdown is supported!
    
    
    * Entry 2	This one's important!
    Each entry is separated by *two* blank lines.  There's also two blank lines
    before the first entry.
    
    
    : Entry 3	But what if you don't want Markdown?
    | That's fine too.  If the header starts with a `|` or `:`, then
    | that character will be removed from the beginning of the item's
    | lines, and each line that starts with a `|` will also have Markdown
    : *disabled*.

Cool, huh?


## How do I use it?

Just put your Starkups in a file, and then open it in the viewer.

You can also make a static HTML file by clicking the Save as HTML button once
you've opened a file.  There's also a Python script in the source tree at
`viewer/make-static` that will do it for you.


## Can you see my stuff?

**No.**  Starkups runs entirely on your computer.  Nothing is sent to my server,
and you can make sure of that by looking at the source code.


## Where's the source code?

[Over here.](https://gitlab.com/s-zeid/starkups)  It's written in JavaScript
and released under [the X11 License](https://tldrlegal.com/l/x11).


## Why's it called "Starkups"?

It's a play on "Starbucks" and "markup".


## Why "Starbucks"?  I thought you don't drink coffee?

I don't.  It's a long story.


## Ooh, Material!

Yep :)  [Praise DuARTe!](http://duarte.cf/ "Warning: Auto-playing video")
