document.addEventListener('DOMContentLoaded', function () {
    const galleryContainer = document.querySelector('.gallery-container');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let currentIndex = 0;
    const totalItems = galleryItems.length;

    function setSliderPosition() {
        galleryContainer.style.transform = `translateX(${currentTranslate}px)`;
    }

    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function touchStart(index) {
        return function (event) {
            isDragging = true;
            startPos = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
            animationID = requestAnimationFrame(animation);
        };
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
            const moveBy = currentPosition - startPos;
            currentTranslate = prevTranslate + moveBy;
        }
    }

    function touchEnd() {
        cancelAnimationFrame(animationID);
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -100) {
            currentIndex = (currentIndex + 1) % totalItems; // Loop forward
        }

        if (movedBy > 100) {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems; // Loop backward
        }

        currentTranslate = currentIndex * -galleryItems[0].clientWidth;
        prevTranslate = currentTranslate;
        setSliderPosition();
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('touchstart', touchStart(index));
        item.addEventListener('touchmove', touchMove);
        item.addEventListener('touchend', touchEnd);
        item.addEventListener('mousedown', touchStart(index));
        item.addEventListener('mousemove', touchMove);
        item.addEventListener('mouseup', touchEnd);
        item.addEventListener('mouseleave', touchEnd);

        // Modal event for full size
        item.addEventListener('click', () => {
            showModal(item.querySelector('img').src);
        });
    });

    function showModal(src) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `<img src="${src}">`;
        document.body.appendChild(modal);
        modal.classList.add('active');
        modal.addEventListener('click', () => {
            modal.remove();
        });
    }
});
