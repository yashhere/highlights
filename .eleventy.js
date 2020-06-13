const fs = require('fs-extra');

const sass = require('./config/sass-process');
const clippings = require('./config/clippings-parsing');

module.exports = function (eleventyConfig) {
    // a debug utility
    eleventyConfig.addFilter("dump", obj => {
        return util.inspect(obj);
    });

    // compress and combine js files
    // eleventyConfig.addFilter("jsmin", require("./assets/js/minify-js.js"));

    // minify the html output when running in prod
    // if (process.env.NODE_ENV == "production") {
    //     eleventyConfig.addTransform(
    //         "htmlmin",
    //         require("./assets/js/minify-html.js")
    //     );
    // }

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

    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
            ready: function (err, bs) {
                const content_404 = fs.readFileSync('_site/404.html');

                bs.addMiddleware("*", (req, res) => {
                    // Provides the 404 content without redirect.
                    res.write(content_404);
                    res.end();
                });
            }
        }
    });

    eleventyConfig.addPassthroughCopy('./assets/css');
    eleventyConfig.addPassthroughCopy('./assets/images');
    eleventyConfig.addPassthroughCopy('./assets/js');

    return {
        dir: {
            input: "./",
            output: "./_site",
            inludes: "_includes"
        },
        passthroughFileCopy: true,
        markdownTemplateEngine: "md"
    };
};