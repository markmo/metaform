var React = require('react');
var ReactAsync = require('react-async')
var fn = require('../../helpers/functional');
var request = require('superagent');
window.$ = window.jQuery = require('jquery');

var ds1url = window.apiBaseURL || '/api';

var fieldnames = [];

var Custom = React.createClass({

  mixins: [ReactAsync.Mixin],

  getInitialStateAsync: function (callback) {
    var source = this.props.source.replace('$ds1url', ds1url);
    request
      .get(source)
      .end(function (res) {
        if (res.ok) {
          callback(null, res.body);
        }
      }.bind(this));
  },

  getFields: function () {
    return fieldnames;
  },

  render: function () {
    var formType = this.props.formType || 'horizontal';
    var fields = _createElements(this.state, formType);
    return (
      <div>
        {fields}
      </div>
    );
  }
});

function _createElements(schema, formType) {
  var properties;
  if ('schema' in schema) {
    if ('properties' in schema.schema) {
      properties = schema.schema.properties;
    } else {
      properties = schema.schema;
    }

    var formOptions = schema.form;
    // TODO
    // The form options array was intended to communicate field order
    // as JSON object keys are unordered, as per the spec.
    // Enhance to use form options index to order fields, if given.
    if (formOptions && formOptions.constructor === Array) {
      var opts = {};
      for (var i = 0; i < formOptions.length; i++) {
        var opt = formOptions[i];
        var field = opt.key;
        delete opt.key;
        opts[field] = opt;
      }
      formOptions = opts;
    }

    fieldnames = [];

    return fn.mapObject(function (k, v) {
      fieldnames.push(k);
      //var opts = Object.assign({}, {field: k, formType: formType}, v);
      var opts = $.extend({}, {field: k, formType: formType}, v);
      if (formOptions && k in formOptions) {
        //opts = Object.assign({}, opts, formOptions[k]);
        opts = $.extend({}, opts, formOptions[k]);
      }
      if (v.type === 'string' && !('enum' in v)) {
        if (opts.type === 'textarea') {
          var Textarea = require('./textarea');
          return React.createElement(Textarea, opts);
        }
        var TextInput = require('./text-input');
        return React.createElement(TextInput, opts);
      } else if (v.type === 'array' || 'enum' in v) {
        if (opts.type === 'pillbox') {
          var Pillbox = require('./pillbox');
          valueFunctions.push(function () {
            var obj = {};
            obj[k] = $('#' + k).pillbox('items').map(function (obj) {
                return obj.text;
              });
            return obj;
          });
          return React.createElement(Pillbox, opts);
        }
        var Select = require('./select');
        return React.createElement(Select, opts);
      } else if (v.type === 'boolean') {
        var Bool = require('./bool');
        return React.createElement(Bool, opts);
      }
    }, properties);
  } else {
    return React.createElement('label', null, 'Loading...');
  }
}

module.exports = Custom;