document.getElementById('attachments').addEventListener('change', function(e) {
    const feedbackContainer = document.getElementById('file-selected-feedback')
    feedbackContainer.innerHTML = '' // Clear previous selections
    
    if (this.files.length > 0) {
        const fileList = document.createElement('div')
        fileList.className = 'file-list'
        
        Array.from(this.files).forEach(file => {
            const fileItem = document.createElement('div')
            fileItem.className = 'selected-file'
            
            // Add file icon based on type
            const icon = document.createElement('span')
            icon.className = 'file-icon'
            
            if (file.type.match('image.*')) {
                icon.textContent = '🖼️'
            } else if (file.type === 'application/pdf') {
                icon.textContent = '📄'
            } else if (file.type === 'application/zip') {
                icon.textContent = '🗄️'
            } else {
                icon.textContent = '📎'
            }
            
            const fileName = document.createElement('span')
            fileName.textContent = file.name
            
            fileItem.appendChild(icon)
            fileItem.appendChild(fileName)
            fileList.appendChild(fileItem)
        })
        
        feedbackContainer.appendChild(fileList)
    } else {
        feedbackContainer.textContent = 'No files selected'
    }
})