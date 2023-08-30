import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import cleanCss from 'gulp-clean-css'; // Зтиснення CSS файла
import webpcss from 'gulp-webpcss'; // Вивід WEBP зображення
import autoprefixer from 'gulp-autoprefixer'; // Додавання вендорних префіксів
import groupCssMediaQueries from 'gulp-group-css-media-queries'; // Групування медіазапитів

import extractCriticalCss from 'gulp-extract-critical-css';

//import webpackStream from 'webpack-stream';
//import webpack from 'webpack';
//import CrittersWebpackPlugin from 'critters-webpack-plugin'; // Плагін для створення критичного CSS

//const babel = require('gulp-babel'); // Додайте цей рядок

const sass = gulpSass(dartSass);

export const scss = () => {
   return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
      .pipe(app.plugins.plumber(
         app.plugins.notify.onError({
            title: "SCSS",
            message: "Error: <%= error.message %>"
         })))
      .pipe(sass({
         outputStyle: 'expanded'
      }))
      .pipe(app.plugins.replace(/@img\//g, '../img/'))
      .pipe(
         app.plugins.if(
            app.isBuild,
            groupCssMediaQueries()
         )
      )
      .pipe(
         app.plugins.if(
            app.isBuild,
            autoprefixer({
               grid: true,
               overrideBrowserslist: ["last 3 versions"],
               cascade: true
            })
         )
      )
      .pipe(
         app.plugins.if(
            app.isBuild,
            webpcss(
               {
                  webpClass: ".webp",
                  noWebpClass: ".no-webp"
               }
            )
         )
      )
      // Не зтиснений дубль файла стилів
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(
         app.plugins.if(
            app.isBuild,
            cleanCss()
         )
      )
      .pipe(rename({
         extname: ".min.css"
      }))
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.browsersync.stream())
      //.pipe(
      //   app.plugins.if(
      //      app.isBuild,
      //      webpackStream({
      //         mode: app.isBuild ? 'production' : 'development',
      //         output: {
      //            filename: function (file) {
      //               const originalFileName = file.basename;
      //               return originalFileName.replace('.css', '-critical.css');
      //            }
      //         },
      //         module: {
      //            rules: [
      //               // додайте необхідні правила для трансформації вашого JavaScript
      //            ]
      //         },
      //         plugins: [
      //            new CrittersWebpackPlugin()
      //            // додайте інші необхідні плагіни Webpack
      //         ]
      //      }, webpack)
      //   )
      //)
      //.pipe(babel()) // Додайте цей рядок
      //.pipe(
      //   app.plugins.if(
      //      app.isBuild,
      //      extractCriticalCss({
      //         inlineCritical: true,
      //         inlinePath: function (file) {
      //            const originalFileName = file.basename;
      //            return './docs/' + originalFileName.replace('css', 'html'); ''
      //         }
      //      })
      //   )
      //)
      //.pipe(app.gulp.dest(app.path.build.css))
      ;
}
