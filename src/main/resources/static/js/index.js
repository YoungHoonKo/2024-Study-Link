document.addEventListener('DOMContentLoaded', function () {
    const galleryData = [
        {
            title: 'Abstract Art',
            description: 'Abstract art uses visual language of shape, form, color, and line to create a composition.',
            imageUrl: 'your-image-url1.jpg'
        },
        {
            title: 'Contemporary Pieces',
            description: 'Contemporary art is the art of today, produced in the late 20th century or in the 21st century.',
            imageUrl: 'your-image-url2.jpg'
        },
        {
            title: 'Modern Sculptures',
            description: 'Modern sculpture is sculpture made during the period extending roughly from the 1890s to the 1970s.',
            imageUrl: 'your-image-url3.jpg'
        }
    ];

    const galleryPreview = document.getElementById('galleryPreview');
    let currentIndex = 0;

    function displayGalleryItem(index) {
        galleryPreview.innerHTML = '';
        const item = galleryData[index];
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item active';
        galleryItem.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}">
            <h2>${item.title}</h2>
        `;
        galleryItem.addEventListener('click', () => {
            showModal(item.title, item.description);
        });
        galleryPreview.appendChild(galleryItem);
    }
    

    function startSlideshow() {
        displayGalleryItem(currentIndex);
        setInterval(() => {
            currentIndex = (currentIndex + 1) % galleryData.length;
            displayGalleryItem(currentIndex);
        }, 3000); // Change image every 3 seconds
    }

    galleryData.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}">
            <h2>${item.title}</h2>
        `;
        galleryItem.addEventListener('click', () => {
            showModal(item.title, item.description);
        });
        galleryPreview.appendChild(galleryItem);
    });

    const modal = document.getElementById('modal');
    const closeButton = document.getElementById('closeButton');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    function showModal(title, description) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalDescription').textContent = description;
        modal.style.display = 'flex';
    }
    // Start the slideshow after loading the gallery items
    startSlideshow();
});