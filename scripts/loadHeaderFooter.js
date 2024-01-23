$(document).ready(function() {
    $.get('../components/header.html', (data) => {
        $('header').replaceWith(data);
    });
    $.get('../components/footer.html', (data) => {
       $('footer').replaceWith(data);
    });
});