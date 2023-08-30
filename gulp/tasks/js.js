import webpack from "webpack-stream";
import notify from 'gulp-notify';
import rename from 'gulp-rename';
import path from 'path'; // Імпортуємо модуль path
import { sync as glob } from 'glob';

export const js = () => {
   const entryFiles = glob(app.path.src.js);
   const entry = {};
   for (const file of entryFiles) {
      const entryName = path.basename(file, path.extname(file)); // Отримуємо лише ім'я файла без розширення
      entry[entryName] = './' + file;
   }
   return app.gulp.src(app.path.src.js, { sourcemaps: app.isDev })
      .pipe(app.plugins.plumber(
         app.plugins.notify.onError({
            title: "JS",
            message: "Error: <%= error.message %>"
         }))
      )
      //.pipe(notify(file => `Оброблено файл: ${file.relative}`)) //вивести повідомлення
      .pipe(webpack({
         mode: app.isBuild ? 'production' : 'development',
         entry,
         output: {
            filename: '[name].min.js',
         }
      }))
      .pipe(app.gulp.dest(app.path.build.js))
      .pipe(app.plugins.browsersync.stream());
}