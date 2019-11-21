const fs = require('fs'),
    marked = require('./assets/js/marked.js');

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

var headlinesHtml = ''; //template
var indexHtml = '';
var postHtml = '';
var allTagTemplateHtml = '';
var tagTemplateHtml = '';
var tagHeadHtml = '';

//load header and footer into template
indexHtml = fs.readFileSync('template/index-template.html').toString('utf-8')
    .replace('{%header%}', fs.readFileSync('template/header.html').toString('utf-8'))
    .replace('{%footer%}', fs.readFileSync('template/footer.html').toString('utf-8'));

postHtml = fs.readFileSync('template/post-template.html').toString('utf-8')
    .replace('{%header%}', fs.readFileSync('template/header.html').toString('utf-8'))
    .replace('{%footer%}', fs.readFileSync('template/footer.html').toString('utf-8'));

headlinesHtml = fs.readFileSync('template/headlines-template.html').toString('utf-8');

allTagTemplateHtml = fs.readFileSync('template/all-tag-template.html').toString('utf-8')
    .replace('{%header%}', fs.readFileSync('template/header.html').toString('utf-8'))
    .replace('{%footer%}', fs.readFileSync('template/footer.html').toString('utf-8'));

tagHeadHtml = fs.readFileSync('template/tag-head-template.html').toString('utf-8').split('---');

tagTemplateHtml = fs.readFileSync('template/tag-template.html').toString('utf-8')
    .replace('{%header%}', fs.readFileSync('template/header.html').toString('utf-8'))
    .replace('{%footer%}', fs.readFileSync('template/footer.html').toString('utf-8'));



fs.readdir(__dirname + '/posts/', (err, files) => {
    if (err)
        throw err;

    let homePostsHtml = '';
    let tagArr = [];
    let homeTagsHtml = '';

    //loop through all md files
    files.forEach(f => {
        if (f.indexOf('.md') > -1) {
            let htmlOutput = __dirname + '/views/' + f.replace('.md', '-post.html'),
                postContent = '',
                htmlContent = '';

            let data = fs.readFileSync(__dirname + '/posts/' + f);

            let markdownPost = data.toString('utf-8');
            let metaDataArr = markdownPost.split("--metadata--");
            let lineArr = metaDataArr[0].split('\n');
            lineArr = lineArr.filter(value => {
                return value == '\r' || value == '\n' || value == '' ? false : true;
            });
            let title = lineArr[0].replace(/\r/g, '').replace(/\n/g, '').replace('title: ', '');
            let date = lineArr[1].replace(/\r/g, '').replace(/\n/g, '').replace('date: ', '');
            let tags = lineArr[2].replace(/\r/g, '').replace(/\n/g, '').replace('tags: ', '');
            let description = lineArr[3].replace(/\r/g, '').replace(/\n/g, '').replace('description: ', '');
            let isVisible = lineArr[4].replace(/\r/g, '').replace(/\n/g, '').replace('visible: ', '') == '1' ? true : false;
            //check if this md file gonna get added into index.html

            let tempTagArr = tags.split(",");
            tempTagArr.forEach(tempTag => {
                tempTag = tempTag.trim();
                if (!tagArr.includes(tempTag) && !tempTag.trim() == '') { //check if tag is already exists or null
                    tagArr.push(tempTag);
                    tagArr.sort();
                    let tagTemplate = tagTemplateHtml.replace('{%tag%}', tempTag);
                    fs.writeFileSync('views/' + tempTag + '-tag.html', tagTemplate); //create new html tag page 
                }
                if (tempTag.trim() != '') {
                    let tagHeadTemplate = tagHeadHtml[1].replace('{%title%}', title);
                    tagHeadTemplate = tagHeadTemplate.replace('{%link%}', f.replace('.md', '-post.html')) + '\n'
                        + '<!--tag-content-->';
                    tagTemplate = fs.readFileSync('views/' + tempTag + '-tag.html')
                        .toString('utf-8').replace('<!--tag-content-->', tagHeadTemplate); //get html tag page to add link
                    fs.writeFileSync('views/' + tempTag + '-tag.html', tagTemplate); //add link to html tag page
                }
            });

            let headLineTemplate = headlinesHtml.replace('{%date%}', date);
            headLineTemplate = headLineTemplate.replace('{%header%}', title);
            headLineTemplate = headLineTemplate.replace('{%content%}', description);
            headLineTemplate = headLineTemplate.replace('{%tags%}', tags);
            //headLineTemplate = headLineTemplate.replace(/{%link%}/g, ('\"posts/').concat(f.replace('.md', '.html') + '\"'));
            headLineTemplate = headLineTemplate.replace(/{%link%}/g, f.replace('.md', '-post.html'));

            if (isVisible == true) { //if not true then not add into index.html
                homePostsHtml = homePostsHtml + headLineTemplate + '\n';
            }
            postContent = marked(metaDataArr[1]);
            htmlContent = postHtml.replace('{%blog-content%}', postContent);
            fs.writeFile(htmlOutput, htmlContent, err => { //create post html page
                if (err)
                    throw err;
                else
                    console.log('log: ', htmlOutput);
            });
        }
    });

    tagArr.forEach(tag => {
        let tagHeadTemplate = tagHeadHtml[0].replace('{%tag%}', tag);
        tagHeadTemplate = tagHeadTemplate.replace('{%link%}', tag + '-tag.html');
        homeTagsHtml = homeTagsHtml + tagHeadTemplate + '\n';
    });
    fs.writeFile('views/tags.html', allTagTemplateHtml.replace('{%tag-content%}', homeTagsHtml), (err) => {
        //create home of tags html page
        if (err)
            throw err;
        else
            console.log('success');
    });

    fs.writeFile('views/index.html', indexHtml.replace('{%data%}', homePostsHtml), (err) => { //add post to index page
        if (err)
            throw err;
        else
            console.log('success');
    });

});


