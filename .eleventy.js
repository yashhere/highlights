const sass = require('./config/sass-process');
const clippings = require('./config/clippings-parsing');
const markdownIt = require('markdown-it')
const markdownItRenderer = new markdownIt();

module.exports = function (eleventyConfig) {
    sass('./assets/_sass/style.scss', './assets/css/style.css');
    clippings.parseClippings('My Clippings.txt', '_data/quotes.json');

    // Aliases are in relation to the _includes folder
    eleventyConfig.addLayoutAlias('error', 'layouts/error.html');
    eleventyConfig.addLayoutAlias('post', 'layouts/post.html');
    eleventyConfig.addLayoutAlias('default', 'layouts/default.html');
    eleventyConfig.addLayoutAlias('all', 'layouts/all.html');
    eleventyConfig.addLayoutAlias('home', 'layouts/home.html');

    eleventyConfig.addCollection('posts', function (collection) {
        return collection.getFilteredByGlob('_posts/*.md').sort(function (a, b) {
            return b.date - a.date;
        });
    });

    eleventyConfig.addFilter("markdownify", (str) => {
        return markdownItRenderer.render(str)
    });


    eleventyConfig.addPassthroughCopy('assets');

    return {
        dir: {
            input: "./",
            output: "./_site"
        },
        passthroughFileCopy: true
    };
};