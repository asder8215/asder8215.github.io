$('.terminalSection').terminal({
    cat: function(width = 200, height = 300) {
        return $(`<img src="https://placekitten.com/${width}/${height}">`);
    },
    title: function(...args) {
        const options = $.terminal.parse_options(args);
        return fetch(options.url || 'https://terminal.jcubic.pl')
            .then(r => r.text())
            .then(html => html.match(/<title>([^>]+)<\/title>/)[1]);
    }
}, {
    checkArity: false,
    greetings: 'My Terminal\n'
});