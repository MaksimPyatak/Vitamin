document.addEventListener('click', function (event) {
   let url = event.target.dataset.link;
   if (!url) {
      console.log(`No URL added to the data-link !!! ${event}`);
      return;
   }
   window.location.assign(url)
})