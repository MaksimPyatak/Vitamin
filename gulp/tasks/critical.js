import gulp from "gulp";
import { stream as critical } from 'critical';

export const criticalCss = () => {
   return gulp.src(app.path.build.html + "*.html")
      .pipe(app.plugins.plumber(
         app.plugins.notify.onError({
            title: "HTML",
            message: "Error: <%= error.message %>"
         }))
      )
      .pipe(critical({
         base: './docs',
         inline: true,
         css: app.path.build.css + 'style.min.css',
         dimensions: [{
            width: 320,
            height: 480
         }, {
            width: 768,
            height: 1024
         }, {
            width: 1920,
            height: 960
         }],
         penthouse: {
            timeout: 180000
         },
         //ignore: ['font-face']
      }))
      .pipe(app.gulp.dest(app.path.build.html));
}

//z
//   return gulp.src(config.dest.root + '**/*.html')
//   .pipe(critical({
//       base: config.dest.root, // "app/" which is the root of my build folder
//       inline: true,
//       css: config.dest.css + styleBundleFilename, // "app/css/mainCssFilename"
//       dimensions: [{
//           width: 320,
//           height: 480
//           },{
//           width: 768,
//           height: 1024
//           },{
//           width: 1280,
//           height: 960
//           }],
//       ignore: ['font-face']
//   }))
//   .on('error', function(err) { log(err.message); })
//   .pipe(gulp.dest(config.dest.root));
//});