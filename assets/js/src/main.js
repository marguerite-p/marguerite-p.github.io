; (function ($) {
  'use strict';

  $(function () {
    // Get all "navbar-burger" elements
    var $navbarBurgers = $('.navbar-burger');

    $navbarBurgers.on('click', function (event) {
      var $el = $(event.delegateTarget);
      var $target = $('#' + $el.data('target'));

      // Toggle the class on both the "navbar-burger" and the "navbar-menu"
      $el.toggleClass('is-active');
      $target.toggleClass('is-active');
    });
  });
}(jQuery));
