const fs = require('fs-extra');
const moment = require('moment-timezone');
const pluginRss = require("@11ty/eleventy-plugin-rss");

const sass = require('./config/sass-process');
const clippings = require('./config/clippings-parsing');

module.exports = function (eleventyConfig) {
    // a debug utility
    eleventyConfig.addFilter("dump", obj => {
        return util.inspect(obj);
    });

    moment.locale('en');
    eleventyConfig.addFilter("dateformat", function (dateIn) {
        return moment(dateIn).format('DD-MM-YYYY');
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

    sass('./assets/_sass/style.scss', '_site/assets/css/style.css');
    clippings.parseClippings('My Clippings.txt', '_data/kindle_highlights.json');

    // Plugins
    eleventyConfig.addPlugin(pluginRss);

    /* Markdown Plugins */
    let markdownIt = require("markdown-it");
    let markdownItAnchor = require("markdown-it-anchor");
    let options = {
        html: true,
        breaks: true,
        linkify: true
    };
    let opts = {
        permalink: false
    };

    eleventyConfig.setLibrary("md", markdownIt(options)
        .use(markdownItAnchor, opts)
    );

    // Aliases are in relation to the _includes folder
    eleventyConfig.addLayoutAlias('error', 'layouts/error.html');
    eleventyConfig.addLayoutAlias('post', 'layouts/post.html');
    eleventyConfig.addLayoutAlias('default', 'layouts/default.html');
    eleventyConfig.addLayoutAlias('all', 'layouts/all.html');
    eleventyConfig.addLayoutAlias('home', 'layouts/home.html');

    eleventyConfig.addCollection('posts', function (collection) {
        return collection.getFilteredByGlob('posts/*.md').sort(function (a, b) {
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

    // eleventyConfig.addPassthroughCopy('./assets/css');
    eleventyConfig.addPassthroughCopy('./assets/images');
    eleventyConfig.addPassthroughCopy('./assets/js');

    return {
        dir: {
            input: "./",
            output: "./_site",
            inludes: "_includes"
        },
        passthroughFileCopy: true,
        markdownTemplateEngine: "md",
        templateFormats: ["md", "njk", "html", "liquid"],
        markdownTemplateEngine: "liquid",
        // htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk"
    };
};