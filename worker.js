'use strict';

function dabble_letters(words_of_len, letters, callback, num_callbacks) {
    // TODO: always use the same array object for lettercounts5, resetting it after each word6.  Likewise deeper.
    // TODO: reduce indentation
    // TODO: choose the word6 that leaves the best `lettercounts5` (~40% vowels, few 'qzjxkmy)
    if (num_callbacks === undefined) num_callbacks = 30;
    const lettercounts6 = count_letters(letters);
    for (let word6 of words_of_len['6']) {
        const lettercounts5 = get_remaining_letters_or_false(Array.from(lettercounts6), word6);
        if (lettercounts5) {
            for (let word5 of words_of_len['5']) {
                const lettercounts4 = get_remaining_letters_or_false(Array.from(lettercounts5), word5);
                if (lettercounts4) {
                    for (let word4 of words_of_len['4']) {
                        const lettercounts3 = get_remaining_letters_or_false(Array.from(lettercounts4), word4);
                        if (lettercounts3) {
                            for (let word3 of words_of_len['3']) {
                                const lettercounts2 = get_remaining_letters_or_false(Array.from(lettercounts3), word3);
                                if (lettercounts2) {
                                    for (let word2 of words_of_len['2']) {
                                        const lettercounts0 = get_remaining_letters_or_false(Array.from(lettercounts2), word2);
                                        if (lettercounts0) {
                                            callback([word6, word5, word4, word3, word2].join(' '));
                                            if (--num_callbacks <= 0) {
                                                callback('~DONE~');
                                                return;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

let index_by_letter = {"'":0, '.':1}; // like {"'":0, ".":1, a:2, b:3, c:4, ..., y: 26, z:27}
for (let letter='a'; letter<='z'; letter = String.fromCharCode(1+letter.charCodeAt(0))) {
    index_by_letter[letter] = 2 + letter.charCodeAt(0) - 'a'.charCodeAt(0);
}

function count_letters(letters) {
    // `letters`: a string containing only the letters a-z, ".", or "'".
    // returns an array of 28 integers: [number_of_apostrophes, number_of_periods, number_of_a, number_of_b, ... number_of_z]
    const lettercounts_length = 1+Math.max(...Object.values(index_by_letter));
    let lettercounts = new Array(lettercounts_length).fill(0);
    for (let letter of letters) { lettercounts[index_by_letter[letter]]++ }
    return lettercounts;
}

function get_remaining_letters_or_false(lettercounts, word) {
    // `lettercounts`: an arrof of 28 integers from count_letters()
    // `word`: a string (straight the dictionary) containing only the letters a-z, ".", or "'".
    // returns: - `false` if this word cannot be made from the letters in `lettercounts`.
    //          - a modified (in-place) `lettercounts` (with the letters needed for `word` subtracted)
    if (!Array.isArray(lettercounts)) throw `not array: ${lettercounts.toString()}`;
    if (typeof(word) !== "string") throw 'not string';
    for (let letter of word) {
        const index = index_by_letter[letter];
        if (lettercounts[index] > 0) { // use the letter
            lettercounts[index]--;
        } else if (lettercounts[index_by_letter['.']] > 0) { // use a blank
            lettercounts[index_by_letter['.']]--;
        } else { // cannot make this word
            return false;
        }
    }
    return lettercounts;
}

onmessage = function(e) {
    // receive a message from the main thread and get dabbling
    const words_of_len = e.data.words_of_len;
    const input = e.data.input;
    const num_results = e.data.num_results;
    dabble_letters(words_of_len, input, postMessage, num_results);
}
