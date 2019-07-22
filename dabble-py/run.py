#!/usr/bin/env pypy3

import string, collections, sys

def get_remaining_letters_or_False(available_letters, word):
    assert isinstance(available_letters, str)
    assert isinstance(word, str)
    available_count = collections.Counter(available_letters)
    for letter, count in collections.Counter(word).items():
        if count < available_count[letter]:
            available_count[letter] -= count
        else:
            blanks_needed = count - available_count[letter]
            if blanks_needed > available_count['.']:
                return False
            else:
                available_count[letter] = 0
                available_count['.'] -= blanks_needed
    ret = ''
    for letter, count in available_count.items():
        ret = ret + letter*count
    return ret
assert get_remaining_letters_or_False('asdfa', 'aaa') == False
assert sorted(get_remaining_letters_or_False('asdfa', 'aa')) == sorted('sdf'), get_remaining_letters_or_False('asdfa', 'aa')
assert sorted(get_remaining_letters_or_False('asdfa', 'a')) == sorted('sdfa')
assert sorted(get_remaining_letters_or_False('asdf', 'a')) == sorted('sdf')
assert get_remaining_letters_or_False('sdf', 'a') == False
assert sorted(get_remaining_letters_or_False('asdf', 'as')) == sorted('df')
assert sorted(get_remaining_letters_or_False('asdfasdf', 'as')) == sorted('dfasdf')

bad_words = 'zs ln ds ls rs lx xu xs ns de redd rudd dkl cudden durns nertz surd trez ks cs'.split()
allowable_letters = string.ascii_lowercase+"'"
words = [w for w in (w.strip() for w in open('../american-english-huge')) if w not in bad_words and all(l in allowable_letters for l in w)]
words_of_len = {length: [w for w in words if len(w)==length] for length in [2,3,4,5,6]}

if sys.argv[1:]:
    letters = sys.argv[1].strip().replace(' ','')
else:
    letters = """
    .d
    cat
    jamb
    plops
    dish's
    """
    letters = ''.join(sorted(letters.replace(" ", "").replace("\n",'')))
assert len(letters) == 20

for word6 in words_of_len[6]:
    letters5 = get_remaining_letters_or_False(letters, word6)
    if letters5:
        for word5 in words_of_len[5]:
            letters4 = get_remaining_letters_or_False(letters5, word5)
            if letters4:
                for word4 in words_of_len[4]:
                    letters3 = get_remaining_letters_or_False(letters4, word4)
                    if letters3:
                        for word3 in words_of_len[3]:
                            letters2 = get_remaining_letters_or_False(letters3, word3)
                            if letters2:
                                for word2 in words_of_len[2]:
                                    letters0 = get_remaining_letters_or_False(letters2, word2)
                                    if letters0 == '':
                                        print(word6, word5, word4, word3, word2)
                                        #sys.exit(0)
