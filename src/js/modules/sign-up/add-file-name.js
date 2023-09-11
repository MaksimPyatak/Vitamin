let inputFile = document.querySelector('#file');
inputFile.addEventListener('change', addFileName)
function addFileName(e) {
   console.log(e.target.files[0])
   let fileInfo = document.querySelector('.add-file__info');
   fileInfo.innerHTML = e.target.files[0].name;
}