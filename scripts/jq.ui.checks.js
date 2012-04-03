/*!
 * jq.ui.checks
 *
 * @version      0.41
 * @author       nori (norimania@gmail.com)
 * @copyright    5509 (http://5509.me/)
 * @license      The MIT License
 * @link         https://github.com/5509/jq.ui.checks
 *
 * 2012-04-03 23:39
 */
(function($, window, document) {

  var __hasProp, __extends;
  __hasProp = Object.prototype.hasOwnProperty;
  __extends = function(child, parent) {
    function F() {
      this.constructor = child;
    }
    for ( var key in parent ) {
      if ( __hasProp.call(parent, key) ) {
        child[key] = parent[key];
      }
    }
    F.prototype = parent.prototype;
    child.prototype = new F();
    child.__super__ = parent.prototype;
    return child;
  };

  // Based
  function Checks($elems, conf) {
    this.namespace = 'Checks';
    if ( !(this instanceof Checks) ) {
      return new Checks($elems, conf);
    }
    return this.init($elems, conf);
  }
  Checks.prototype = {

    // names and types are based
    baseConf: {
      view          : false,
      uiClass       : 'ui_check',
      labelClass    : 'ui_check_label',
      checkedClass  : 'ui_checked',
      disabledClass : 'ui_check_disabled'
    },

    init: function($elems, conf) {
      var self = this;

      self.$elems = $elems;
      self.conf = $.extend({}, self.baseConf, conf);
      self.elemMaps = {};

      $.each($elems, function(i, elem) {
        var check = self._matching(elem),
          $check = check.$check,
          $label = check.$label,
          $view = check.$view;

        if ( $label ) {
          $label.addClass(self.conf.labelClass);
        }
        if ( self.conf.view ) {
          $check.hide().after($view);
        }
      });

      // manage events
      self._eventify();
    },

    _view: function(check) {
      var self = this,
        $view = $('<span></span>').addClass(this.conf.uiClass);
      if ( check.disabled ) {
        $view.addClass(self.conf.disabledClass);
      }
      if ( check.checked ) {
        $view.addClass(self.conf.checkedClass);
      }
      return $view;
    },

    _matching: function(check) {
      var self = this,
        id = check.id;
      self.elemMaps[id] = {
        id: id,
        $check: $(check),
        $view: self.conf.view ? self._view(check) : undefined,
        $label: $('label[for=' + id + ']'),
        state: check.checked,
        disabled: check.disabled
      };
      return self.elemMaps[id];
    },

    _eventify: function() {
      var self = this;
      // binding events to all checkboxes
      $.each(self.elemMaps, function(key, val) {
        var id = val.id,
          $check = val.$check,
          $label = val.$label,
          $view = val.$view,
          disabled = val.disabled;

        // binding events
        $check.bind({
          'click.check': function(ev) {
            ev.stopPropagation();
            if ( disabled ) {
              return;
            }
            $check.trigger('_check:toggle');
          },
          '_check:toggle': function(ev) {
            if ( !self.elemMaps[id].state ) {
              self._checkOn(id);
            } else {
              self._checkOff(id);
            }
          },
          '_check:on': function() {
            self._checkOn(id);
          },
          '_check:off': function() {
            self._checkOff(id);
          },
          '_check:enable': function() {
            self._enable(id);
          },
          '_check:disable': function() {
            self._disable(id);
          }
        });

        // less than IE8 and $label exists
        if ( !$.support.opacity && $label.length ) {
          $label.click(function(ev) {
            ev.stopPropagation();
            $check.trigger('click');
          });
        }
      });
    },

    _checkOn: function(id) {
      var self = this,
        map = self.elemMaps[id],
        $check = map.$check;

      if ( map.disabled ) return;
      if ( self.conf.view ) map.$view.addClass(self.conf.checkedClass);
      map.state = true;
      $check.prop('checked', 'checked');
      $check.trigger('check:on', map);
    },

    _checkOff: function(id) {
      var self = this,
        map = self.elemMaps[id],
        $check = map.$check;

      if ( map.disabled ) return;
      if ( self.conf.view ) map.$view.removeClass(self.conf.checkedClass);
      map.state = false;
      $check.prop('checked', '');
      $check.trigger('check:off', map);
    },

    _enable: function(id) {
      var self = this,
        map = self.elemMaps[id],
        $view = map.$view,
        $check = map.$check;

      if ( self.conf.view ) $view.removeClass(self.conf.disabledClass);
      map.disabled = false;
      $check.prop('disabled', '');
      $check.trigger('check:enable', map);
    },

    _disable: function(id) {
      var self = this,
        map = self.elemMaps[id],
        $view = map.$view,
        $check = map.$check;

      if ( self.conf.view ) $view.addClass(self.conf.disabledClass);
      map.disabled = true;
      $check.prop('disabled', 'disabled');
      $check.trigger('check:disable', map);
    },

    _callAPI: function(api, args) {
      var self = this;
      if ( typeof self[api] !== 'function' ) {
        throw new Error(api + ' does not exist of ' + self.namespace + ' methods.');
      } else
      if ( /^_/.test(api) && typeof self[api] === 'function' ) {
        throw new Error('Method begins with an underscore are not exposed.');
      }
      return self[api](args);
    },

    checkOn: function(id) {
      var self = this;
      self._checkOn(id);
    },

    checkOff: function(id) {
      var self = this;
      self._checkOff(id);
    },

    enable: function(id) {
      var self = this;
      self._enable(id);
    },
    enableAll: function() {
      var self = this;
      $.each(self.elemMaps, function(key, val) {
        self.enable(val.id);
      });
    },

    disable: function(id) {
      var self = this;
      self._disable(id);
    },
    disableAll: function() {
      var self = this;
      $.each(self.elemMaps, function(key, val) {
        self.disable(val.id);
      });
    },

    destroy: function() {
      var self = this,
        ns = self.namespace.toLowerCase();

      self.$elems.removeData(ns);
      self.$elems.trigger('check:destroy');
      $.each(self.elemMaps, function(key, val) {
        if ( self.conf.view ) val.$view.remove();
        val.$check.show().unbind([
          'click.check',
          '_check:toggle',
          '_check:on', '_check:off',
          '_check:enable', '_check:disable',
          'check:on', 'check:off',
          'check:enable', 'check:disable'
        ].join(' '));
      });
    }
  };

  // Checkbox
  var cp;
  __extends(Checkbox, Checks);
  function Checkbox($elems, conf) {
    this.namespace = 'Checkbox';
    if ( !(this instanceof Checkbox) ) {
      return new Checkbox($elems, conf);
    }
    return this.init($elems, conf);
  };
  cp = Checkbox.prototype;
  cp.toggleCheckAll = function() {
    var self = this;
    self.$elems.trigger('_check:toggle');
  };
  cp.checkOnAll = function() {
    var self = this;
    self.$elems.trigger('_check:on');
  };
  cp.checkOffAll = function() {
    var self = this;
    self.$elems.trigger('_check:off');
  };

  // Radio
  var rp;
  __extends(Radio, Checks);
  function Radio($elems, conf) {
    this.namespace = 'Radio';
    if ( !(this instanceof Radio) ) {
      return new Radio($elems, conf);
    }
    return this.init($elems, conf);
  };
  rp = Radio.prototype;
  rp.baseConf = {
    view: false,
    uiClass: 'ui_radio',
    labelClass: 'ui_radio_label',
    checkedClass: 'ui_checked',
    disabledClass: 'ui_radio_disabled'
  };
  rp._checkOn = function(id) {
    var self = this,
      map = self.elemMaps[id];

    $.each(self.elemMaps, function(key, val) {
      self._checkOff(val.id);
    });
    if ( self.conf.view ) map.$view.addClass(self.conf.checkedClass);
    map.$check.prop('checked', 'checked');
  };

  // extends $.fn
  $.fn.checkbox = function(a, b) {
    var checkbox;
    checkbox = this.data('checkbox');
    if (checkbox) {
      return checkbox._callAPI(a, b);
    } else {
      if ( typeof a === 'string' ) {
        return;
      }
      checkbox = Checkbox(this, a);
      this.data('checkbox', checkbox);
      return this;
    }
  };
  $.fn.radio = function(a, b) {
    var radio;
    radio = this.data('radio');
    if (radio) {
      return radio._callAPI(a, b);
    } else {
      if ( typeof a === 'string' ) {
        return;
      }
      radio = Radio(this, a);
      this.data('radio', radio);
      return this;
    }
  };

}(jQuery, this, this.document));
