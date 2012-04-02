(($, window, document) ->

  class Checks
    constructor: ($elems, conf) ->
      @namespace = 'Checks'
      if not (@ instanceof Checks)
        return new Checks $elems, conf
      return @init $elems, conf

    conf: 
      type          : 'checkbox',
      uiClass       : 'ui_check',
      labelClass    : 'ui_check_label',
      checkedClass  : 'ui_checked',
      disabledClass : 'ui_check_disabled'

    elemMaps: {}

    init: ($elems, conf) ->
      @conf = $.extend @conf, conf

      $.each $elems, (i, elem) =>
        check = @_matching(elem)
        $check = check.$check
        $label = check.$label
        $view = check.$view
        if $label
          $label.addClass(@conf.labelClass)
        $check.hide().after($view)
        return
      console.log @elemMaps
      @_eventify()
      return

    _view: (check) ->
      $view = $('<span></span>').addClass(@conf.uiClass)
      if check.disabled
        $view.addClass(@conf.disabledClass)
      if check.checked
        $view.addClass(@conf.checkedClass)
      return $view

    _matching: (check) ->
      id = check.id
      @elemMaps[id] =
        id: id,
        $check: $(check),
        $view: @_view(check),
        $label: $('label[for=' + id + ']'),
        state: check.checked,
        disabled: check.disabled
      return @elemMaps[id]

    _eventify: ->
      # each checks
      $.each @elemMaps, (key, val) =>
        id = val.id
        $check = val.$check
        $label = val.$label
        $view = val.$view
        disabled = val.disabled

        # binding events
        $check.bind
          'click': (ev) =>
            ev.stopPropagation()
            if disabled
              return
            $check.trigger('check:toggle')
            return
          'check:toggle': (ev) =>
            if not $view.hasClass(@conf.checkedClass)
              @_checkOn(id)
            else
              @_checkOff(id)
            return
          'check:on': =>
            @_checkOn(id)
          'check:off': =>
            @_checkOff(id)

        # for less than IE8
        if not $.support.opacity and $label.length
          $label.click (ev) ->
            ev.stopPropagation()
            $check.trigger('click')
            return

      return

    _checkOn: (id) ->
      map = @elemMaps[id]
      map.$view.addClass(@conf.checkedClass)
      map.$check.prop('checked', 'checked')
      #map.$check.trigger('check:on')
      return

    _checkOff: (id) ->
      map = @elemMaps[id]
      map.$view.removeClass(@conf.checkedClass)
      map.$check.prop('checked', '')
      #map.$check.trigger('check:off')
      return

    _callAPI: (api, args) ->
      if typeof @[api] isnt 'function'
        throw new Error(api + ' does not exist of ' + @namespace + ' methods.')
      else if /^_/.test(api) and typeof @[api] is 'function'
        throw new Error('Method begins with an underscore are not exposed.')
      return @[api](args)

    enable: ->
    enableAll: ->
    disable: ->
    disableAll: ->

    destroy: ->

  class Checkbox extends Checks
    constructor: ($elems, conf) ->
      @namespace = 'Checkbox'
      if not (@ instanceof Checkbox)
        return new Checkbox($elems, conf)
      return @init($elems, conf)

    checkOn: (id) ->
      @_checkOn(id)
      return
    checkOff: (id) ->
      @_checkOff(id)
      return

    checkOnAll: ->
      $.each @elemMaps, (key, val) ->
        val.$check.trigger('check:on')
      return
    checkOffAll: ->
      $.each @elemMaps, (key, val) ->
        val.$check.trigger('check:off')
      return

  class Radio extends Checks
    constructor: ($elems, conf) ->
      @namespace = 'Radio'
      if not (@ instanceof Radio)
        return new Radio($elems, conf)
      return @init($elems, conf)

    conf: 
      type          : 'radio',
      uiClass       : 'ui_radio',
      labelClass    : 'ui_radio_label',
      checkedClass  : 'ui_checked',
      disabledClass : 'ui_radio_disabled'

    checkOn: ->
    checkOff: ->

  $.fn.checkbox = (a, b) ->
    checkbox = @data('checkbox')

    if checkbox
      return checkbox._callAPI(a, b)
    else
      checkbox = Checkbox(@, a)
      @data('checkbox', checkbox)
      return @

  $.fn.radio = (a, b) ->
    radio = @data('radio')

    if radio
      return radio._callAPI(a, b)
    else
      radio = Radio(this, a)
      @data('radio', radio)
      return @
  return

) jQuery, @, @document
