const w = document.getElementById('desktop-screen');
const aboutMe = w.querySelector('.about-me-container')
const scrollAppearList = w.querySelectorAll('.scroll-appear');
const parallaxList = w.querySelectorAll('.doodle.up');
const rocket = w.querySelector('#rocket');
w.addEventListener('scroll', function() {
    scrollAppearList.forEach(element => {
        var position = element.getBoundingClientRect().top;
        var windowHeight = window.innerHeight;
        if (position < windowHeight / 2) { /* Adjust the scroll position at which the element appears */
            element.classList.add('appear');
        }
    })
    const scrollTop = w.scrollTop;
    parallaxList.forEach(parallax => {parallax.style.transform = 'translateY(' + -(scrollTop * 0.3) + 'px)';})
    rocket.style.transform = 'translate(' + (scrollTop * 1) + 'px, ' + -(scrollTop * 1) + 'px)';
    
    const containerPosition = aboutMe.offsetTop;
    const parentScrollPosition = w.scrollTop;
    if (parentScrollPosition >= containerPosition) {
        w.style.backgroundColor = 'rgb(254, 219, 134)'; // Change the background color when the container hits the top of the parent div
    } else {
        w.style.backgroundColor = ''; // Reset the background color if the container is not at the top of the parent div
    }
    
});

