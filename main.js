'use strict';
window._d = window._d || {};
const dqs = document.querySelector.bind(document)
const document_ready = () => (new Promise((resolve,reject) => {
    if (document.readyState === 'complete') { resolve(); }
    else { document.addEventListener('readystatechange', ()=>{document_ready().then(resolve)}, {once:true}) }
}));

function append_text(text){dqs('#output').value += text+'\n'}
function clear_output(){dqs('#output').value=''}
function set_output_height(){dqs('#output').style.height=(window.innerHeight-dqs('#twentychar').parentNode.clientHeight-2)+'px'}
document_ready().then(set_output_height);
window.addEventListener('resize', set_output_height);

document_ready().then(function() {
    let worker;

    function handle_change() {
        var allowable_chars = "abcdefghijklmnopqrstuvwxyz'.";
        var input = dqs('#twentychar').value.toLowerCase().replace(/ /g, '');
        var invalid_chars = input.split('').filter(c => !allowable_chars.includes(c));
        if (invalid_chars.length) {
            if (worker) worker.terminate();
            clear_output();
            append_text(`These characters are invalid: ${invalid_chars.toString()}`);
        } else if (input.length !== 20) {
            if (worker) worker.terminate();
            clear_output();
            append_text(`${input.length} letters`);
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
            clear_output();
            append_text(`Searching with chars ${input.split('').sort().join('')} (limiting to first ${num_results} results)`);
            worker.postMessage({words_of_len:words_of_len, input:input, num_results:num_results});
        }
    }
    dqs('#twentychar').addEventListener('input', handle_change);
    dqs('#num_results').addEventListener('input', handle_change);
});
