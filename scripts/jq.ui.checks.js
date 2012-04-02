(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  (function($, window, document) {
    var Checkbox, Checks, Radio;
    Checks = (function() {

      function Checks($elems, conf) {
        this.namespace = 'Checks';
        if (!(this instanceof Checks)) return new Checks($elems, conf);
        return this.init($elems, conf);
      }

      Checks.prototype.conf = {
        type: 'checkbox',
        uiClass: 'ui_check',
        labelClass: 'ui_check_label',
        checkedClass: 'ui_checked',
        disabledClass: 'ui_check_disabled'
      };

      Checks.prototype.elemMaps = {};

      Checks.prototype.init = function($elems, conf) {
        var _this = this;
        this.conf = $.extend(this.conf, conf);
        $.each($elems, function(i, elem) {
          var $check, $label, $view, check;
          check = _this._matching(elem);
          $check = check.$check;
          $label = check.$label;
          $view = check.$view;
          if ($label) $label.addClass(_this.conf.labelClass);
          $check.hide().after($view);
        });
        console.log(this.elemMaps);
        this._eventify();
      };

      Checks.prototype._view = function(check) {
        var $view;
        $view = $('<span></span>').addClass(this.conf.uiClass);
        if (check.disabled) $view.addClass(this.conf.disabledClass);
        if (check.checked) $view.addClass(this.conf.checkedClass);
        return $view;
      };

      Checks.prototype._matching = function(check) {
        var id;
        id = check.id;
        this.elemMaps[id] = {
          id: id,
          $check: $(check),
          $view: this._view(check),
          $label: $('label[for=' + id + ']'),
          state: check.checked,
          disabled: check.disabled
        };
        return this.elemMaps[id];
      };

      Checks.prototype._eventify = function() {
        var _this = this;
        $.each(this.elemMaps, function(key, val) {
          var $check, $label, $view, disabled, id;
          id = val.id;
          $check = val.$check;
          $label = val.$label;
          $view = val.$view;
          disabled = val.disabled;
          $check.bind({
            'click': function(ev) {
              ev.stopPropagation();
              if (disabled) return;
              $check.trigger('check:toggle');
            },
            'check:toggle': function(ev) {
              if (!$view.hasClass(_this.conf.checkedClass)) {
                _this._checkOn(id);
              } else {
                _this._checkOff(id);
              }
            },
            'check:on': function() {
              return _this._checkOn(id);
            },
            'check:off': function() {
              return _this._checkOff(id);
            }
          });
          if (!$.support.opacity && $label.length) {
            return $label.click(function(ev) {
              ev.stopPropagation();
              $check.trigger('click');
            });
          }
        });
      };

      Checks.prototype._checkOn = function(id) {
        var map;
        map = this.elemMaps[id];
        map.$view.addClass(this.conf.checkedClass);
        map.$check.prop('checked', 'checked');
      };

      Checks.prototype._checkOff = function(id) {
        var map;
        map = this.elemMaps[id];
        map.$view.removeClass(this.conf.checkedClass);
        map.$check.prop('checked', '');
      };

      Checks.prototype._callAPI = function(api, args) {
        if (typeof this[api] !== 'function') {
          throw new Error(api + ' does not exist of ' + this.namespace + ' methods.');
        } else if (/^_/.test(api) && typeof this[api] === 'function') {
          throw new Error('Method begins with an underscore are not exposed.');
        }
        return this[api](args);
      };

      Checks.prototype.enable = function() {};

      Checks.prototype.enableAll = function() {};

      Checks.prototype.disable = function() {};

      Checks.prototype.disableAll = function() {};

      Checks.prototype.destroy = function() {};

      return Checks;

    })();
    Checkbox = (function(_super) {

      __extends(Checkbox, _super);

      function Checkbox($elems, conf) {
        this.namespace = 'Checkbox';
        if (!(this instanceof Checkbox)) return new Checkbox($elems, conf);
        return this.init($elems, conf);
      }

      Checkbox.prototype.checkOn = function(id) {
        this._checkOn(id);
      };

      Checkbox.prototype.checkOff = function(id) {
        this._checkOff(id);
      };

      Checkbox.prototype.checkOnAll = function() {
        $.each(this.elemMaps, function(key, val) {
          return val.$check.trigger('check:on');
        });
      };

      Checkbox.prototype.checkOffAll = function() {
        $.each(this.elemMaps, function(key, val) {
          return val.$check.trigger('check:off');
        });
      };

      return Checkbox;

    })(Checks);
    Radio = (function(_super) {

      __extends(Radio, _super);

      function Radio($elems, conf) {
        this.namespace = 'Radio';
        if (!(this instanceof Radio)) return new Radio($elems, conf);
        return this.init($elems, conf);
      }

      Radio.prototype.conf = {
        type: 'radio',
        uiClass: 'ui_radio',
        labelClass: 'ui_radio_label',
        checkedClass: 'ui_checked',
        disabledClass: 'ui_radio_disabled'
      };

      Radio.prototype.checkOn = function() {};

      Radio.prototype.checkOff = function() {};

      return Radio;

    })(Checks);
    $.fn.checkbox = function(a, b) {
      var checkbox;
      checkbox = this.data('checkbox');
      if (checkbox) {
        return checkbox._callAPI(a, b);
      } else {
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
        radio = Radio(this, a);
        this.data('radio', radio);
        return this;
      }
    };
  })(jQuery, this, this.document);

}).call(this);
