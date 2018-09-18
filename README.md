# fold-whatever package

This package provide the functionality to specify ranges to be folded with the help of regexes. The default values are are the regexes suitable to fold pandoc inlined footnotes and references.

This is my first atom package I am interested in comments and recommendations.

## examples:

Fold everything between the brackets in one line. fold everything away:

/\<.+?\>/g

Keep the brackets visible by using 3 matching groups. The range from the end of the first group, to the beginning of the last group, will be folded:

/(\<)(.+?)(\>)/g

Match over multiple lines. line braking spaces have to be matched:

/(\<)(.|\s)+?(\>)/g



## 0.2.4 -
* add toggle
* fixed curser jump, stays now at its position
* tested if multi-line regexes are possible. which is the case but they are only matched by toggle/[un]fold-all.

## 0.2.2 -
* fixed scope of (un)fold-here to include "bracketing" regex regions

## 0.2.1 - First Release
* [un]fold-here : [un]folds at curser when a regex matches
* [un]fold-line : [un]folds all matches in a line
* [un]fold-all : [un]folds all matches in a file
