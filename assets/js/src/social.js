; (function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'socialLinks',

    defaults = {
      counter: true,

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
        url: 'https://www.facebook.com/sharer/sharer.php?u={url}',
        count: {
          url: 'https://graph.facebook.com/?id={url}',
          countGetter: function (data) { return data.share.share_count; }
        }
      },
      'google-plus': {
        url: 'https://plus.google.com/share?url={url}',
        count: {
          url: 'https://clients6.google.com/rpc?key=AIzaSyCKSbrvQasunBoV16zDH9R33D88CeLr9gQ',
          config: {
            method: 'POST',
            body: [{
              method: 'pos.plusones.get',
              id: 'p',
              params: { id: '{url}', userId: '@viewer', groupId: '@self', nolog: true },
              jsonrpc: '2.0',
              key: 'p',
              apiVersion: 'v1'
            }],
            headers: {
              'Content-Type': 'application/json'
            }
          },

          countGetter: function (data) { return data.count; }
        }
      },
      'linkedin': {
        url: 'https://www.linkedin.com/shareArticle?mini=true&url={url}',
        count: {
          url: 'https://www.linkedin.com/countserv/count/share?url={url}&format=json',
          countGetter: function (data) { return data.count; }
        }
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

        var href = Object
          .keys(base.settings.share_data)
          .reduce(function (accu, value) {
            return accu.replace('{' + value + '}', encodeURIComponent(base.settings.share_data[value]))
          },
            networkConf.url
          );
        $component.attr('href', href)

        if (base.settings.counter === true) {
          setShareCount(network, encodeURIComponent(base.settings.share_data.url), $component);
        }
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

  function shorten(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
      return num;
    }
  }

  function setShareCount(network, url, $component) {
    var networkConf = networks[network];
    var countConf = networkConf && networkConf.count;
    if (!countConf) { return; }

    var countUrl = countConf.url.replace('{url}', url);
    var promise = countConf.jsonp === true ? fetchJSONP(countUrl) : fetch(countUrl, countConf.config);
    promise
      .then(function (data) {
        appendCountDiv(safeguard(function () { return countConf.countGetter(data); }), $component);
      });
  }

  function safeguard(fn) {
    var value;
    try {
      value = fn();
    } catch (e) {
      value = 0;
    }
    return value;
  }

  function appendCountDiv(count, $component) {
    $component.append($('<div>', { class: 'ssk-num' }).html(shorten(count)));
  }

  var fetchJSONP = (function (unique) {
    var defaults = {
      parameter: 'callback'
    };
    return function (url, options) {
      var config = $.extend({}, defaults, options);
      return new Promise(function (resolve) {
        var script = document.createElement('script');
        var name = '_jsonp_' + unique++;

        url += url.match(/\?/) ? '&' : '?';
        url += config.parameter + '=' + name

        script.src = url;
        window[name] = function (json) {
          resolve(json);
          script.remove();
          delete window[name];
        };

        document.body.appendChild(script);
      });
    };
  })(0);

  var fetch = (function () {
    var defaults = {
      method: 'GET',
      responseType: 'json'
    };
    return function (url, options) {
      var config = $.extend({}, defaults, options);
      return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open(config.method, url, true)
        request.responseType = config.responseType;
        // set headers
        config.headers && Object
          .keys(config.headers)
          .forEach(function (header) {
            request.setRequestHeader(header, config.headers[header]);
          });

        request.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            resolve(request.response);
          } else {
            reject({
              status: this.status,
              statusText: request.statusText
            });
          }
        };

        request.onerror = function () {
          reject({
            status: this.status,
            statusText: request.statusText
          });
        };
        request.send(JSON.stringify(config.body));
      });
    };
  })();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin($(this), options));
      }
    });
  };

})(jQuery, window, document);
