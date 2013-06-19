(function() {
  $('.img-container').append('<img class="img"/>');
  $('.img-link').on('click', function(e){
    e.preventDefault();
    $('.img').attr('src', e.target.href);
  });
})();
