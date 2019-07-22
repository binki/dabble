#!/usr/bin/env python3

import json, string

bad_words = "zs ln ds ls rs lx xu xs ns de redd rudd dkl cudden durns nertz surd trez ks cs h'm".split()
allowable_letters = string.ascii_lowercase+"'"
words = [w for w in (w.strip() for w in open('american-english')) if w not in bad_words and all(l in allowable_letters for l in w)]
words_of_len = {length: [w for w in words if len(w)==length] for length in [2,3,4,5,6]}

with open('words_of_len.js', 'w') as f:
    f.write('var words_of_len = ')
    json.dump(words_of_len, f)
    f.write(';\n')
