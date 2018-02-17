; (function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'socialLinks',

    defaults = {
      share_data: {
        title: document.title,
        url: window.location.href,
        twitter_via: getMetaContent('name', 'twitter:site').replace('@', '')
      },

      popup: true,
      popup_width: 400,
      popup_height: 300
    },

    networks = {
      'mail': {
        url: 'mailto:?subject={title}&body={url}'
      },
      'facebook': {
        url: 'https://www.facebook.com/sharer/sharer.php?u={url}'
      },
      'google-plus': {
        url: 'https://plus.google.com/share?url={url}'
      },
      'linkedin': {
        url: 'https://www.linkedin.com/shareArticle?mini=true&url={url}'
      },
      'twitter': {
        url: 'https://twitter.com/intent/tweet?url={url}&via={twitter_via}'
      }
    };

  function getMetaContent(attr, value) {
    return $('meta[' + attr + '="' + value + '"]').attr('content') || '';
  }

  function Plugin(element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    this.init();
  }

  $.extend(Plugin.prototype, {
    init: function () {
      var base = this,
        links = base.element.find('a[data-network]');

      links.each(function () {
        var $component = $(this);
        var network = $component.attr('data-network');
        var networkConf = networks[network];
        if (!networkConf) { return; }

        var href = Object.keys(base.settings.share_data)
          .reduce(
            function (accu, value) {
              return accu.replace('{' + value + '}', encodeURIComponent(base.settings.share_data[value]))
            },
            networkConf.url
          );
        $component.attr('href', href)
      });

      if (this.settings.popup === true) {
        links.on('click', function (event) {
          event.preventDefault();
          openPopUp($(this).attr('href'), $(this).attr('title'), base.settings.popup_width, base.settings.popup_height);
        });
      }
    }

  });

  function openPopUp(url, title, width, height) {
    var w = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width,
      h = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height,
      left = (w / 2) - (width / 2) + 10,
      top = (h / 2) - (height / 2) + 50;
    window.open(url, title, 'scrollbars=yes, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left).focus();
  }

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin($(this), options));
      }
    });
  };

})(jQuery, window, document);
