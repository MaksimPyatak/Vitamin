import svgSprite from "gulp-svg-sprite";
export const svgSpriteTask = () => {
   return app.gulp.src(`${app.path.src.svgicons}`, {})
      .pipe(app.plugins.plumber(
         app.plugins.notify.onError({
            title: "SVG",
            message: "Error: <%= error.message %>"
         }))
      )
      .pipe(svgSprite({
         mode: {
            stack: {
               sprite: `../icons/icons.svg`,
               // Створюїє картинку з прикладом іконок
               example: true
            }
         },
      }
      ))
      .pipe(app.gulp.dest(`${app.path.build.images}`));
}