'use strict';
window._d = window._d || {};
const dqs = document.querySelector.bind(document)

function set_text(text){dqs('#output').value=text+'\n'}
function append_text(text){dqs('#output').value+=text+'\n'}
function set_output_height(){dqs('#output').style.height=(window.innerHeight-dqs('#twentychar').parentNode.clientHeight-2)+'px'}
set_output_height();
window.addEventListener('resize', set_output_height);

let worker;
function handle_change() {
    var allowable_chars = "abcdefghijklmnopqrstuvwxyz'.";
    var input = dqs('#twentychar').value.toLowerCase().replace(/ /g, '');
    var invalid_chars = input.split('').filter(c => !allowable_chars.includes(c));
    if (invalid_chars.length) {
        if (worker) worker.terminate();
        set_text(`These characters are invalid: ${invalid_chars.toString()}`);
    } else if (input.length !== 20) {
        if (worker) worker.terminate();
        set_text(`${input.length} letters`);
    } else {
        worker = new Worker('worker.js'); _d.worker = worker;
        worker.onerror = function(e) {
            console.log(['WORKER_ERROR', e]);
        }
        worker.onmessage = function(e) {
            console.log(e);
            append_text(e.data);
        }
        const num_results = parseInt(dqs('#num_results').value) || 10;
        set_text(`Searching with chars ${input.split('').sort().join('')} (limiting to first ${num_results} results)`);
        worker.postMessage({words_of_len:words_of_len, input:input, num_results:num_results});
    }
}
dqs('#twentychar').addEventListener('input', handle_change);
dqs('#num_results').addEventListener('input', handle_change);
