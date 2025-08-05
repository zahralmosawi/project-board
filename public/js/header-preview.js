document.addEventListener('DOMContentLoaded', function() {

    // Handle header image upload and preview
    const headerUpload = document.getElementById('headerUpload')

    if (headerUpload) {
        headerUpload.addEventListener('change', function(e) {
            const preview = document.getElementById('headerPreview')
            if (this.files && this.files[0]) {
                const reader = new FileReader() // reading the file
                reader.onload = function(e) { 
                    // if the preview element does not have an image then create one
                    let img = preview.querySelector('img')
                    if (!img) {
                        img = document.createElement('img')
                        preview.prepend(img)
                    }
                    img.src = e.target.result // set the image source to the file data
                    preview.classList.add('has-image') // add a class for styling
                }
                reader.readAsDataURL(this.files[0]) // read the file as a data URL
            }
        })
    }
})