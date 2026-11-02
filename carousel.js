(function() {
    let currentIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const total = slides.length;

    if (total === 0) return;

    function update() {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentIndex);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    window.go = function(step) {
        currentIndex = (currentIndex + step + total) % total;
        update();
    };

    window.jump = function(index) {
        currentIndex = index;
        update();
    };

    setInterval(() => {
        window.go(1);
    }, 3000);
})();