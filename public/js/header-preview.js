document.addEventListener('DOMContentLoaded', function() {

    // Handle header image upload and preview
    const headerUpload = document.getElementById('headerUpload')

    if (headerUpload) {
        headerUpload.addEventListener('change', function(e) {
            const preview = document.getElementById('headerPreview')
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    let img = preview.querySelector('img')
                    if (!img) {
                        img = document.createElement('img')
                        preview.prepend(img)
                    }
                    img.src = e.target.result
                    preview.classList.add('has-image')
                }
                reader.readAsDataURL(this.files[0])
            }
        })
    }
})