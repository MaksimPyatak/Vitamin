const inputFile = document.querySelector('#file');
inputFile.addEventListener('change', addFileName)
function addFileName(e) {
   const fileInfo = document.querySelector('.add-file__info');
   fileInfo.innerHTML = e.target.files[0].name;
}