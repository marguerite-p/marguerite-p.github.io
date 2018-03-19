; (function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'cryptoMail',
    defaults = {},
    transformations = {
      rtl: function (el) { el.addClass('crypto-rtl'); },
      hide: function (el) { el.addClass('crypto-hidden'); },
      b64: function (el) { el.text(atob(el.text())); },
    };

  function Plugin(element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    this.init();
  }

  $.extend(Plugin.prototype, {
    init: function () {
      var base = this,
        children = base.element.children();

      // hide the element to prevent flickering
      base.element.addClass('is-invisible');
      children.each(function () { transformations.b64($(this)); });
      base.element.removeClass('is-invisible');
    }

  });

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin($(this), options));
      }
    });
  };

})(jQuery, window, document);
