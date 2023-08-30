import fileInclude from "gulp-file-include";
import webpHtmlNosvg from "gulp-webp-html-nosvg";
import versionNumber from "gulp-version-number";
//import { stream as critical } from 'critical';
//import pug from "gulp-pug";

export const html = () => {
   return app.gulp.src(app.path.src.html)
      .pipe(app.plugins.plumber(
         app.plugins.notify.onError({
            title: "HTML",
            message: "Error: <%= error.message %>"
         }))
      )
      .pipe(fileInclude())
      /*
      .pipe(pug({
         // Cжатие HTML файла
         pretty: true,
         // Показывать в терминале какой файл обработан
         verbose: true
      }))
      */
      .pipe(app.plugins.replace(/@img\//g, 'img/'))
      .pipe(
         app.plugins.if(
            app.isBuild,
            webpHtmlNosvg()
         )
      )
      //.pipe(critical({
      //   base: './docs', // "app/" which is the root of my build folder
      //   inline: true,
      //   css: app.path.build.css + 'style.min.css', // "app/css/mainCssFilename"
      //   dimensions: [{
      //      width: 320,
      //      height: 480
      //   }, {
      //      width: 768,
      //      height: 1024
      //   }, {
      //      width: 1920,
      //      height: 960
      //   }],
      //   penthouse: {
      //      timeout: 180000
      //   },
      //   ignore: ['font-face']
      //}))
      .pipe(
         app.plugins.if(
            app.isBuild,
            versionNumber({
               'value': '%DT%',
               'append': {
                  'key': '_v',
                  'cover': 0,
                  'to': [
                     'css',
                     'js',
                  ]
               },
               'output': {
                  'file': 'gulp/version.json'
               }
            })
         )
      )
      .pipe(app.gulp.dest(app.path.build.html))
      .pipe(app.plugins.browsersync.stream());
}