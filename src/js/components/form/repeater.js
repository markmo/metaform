var React = require('react');
var AppActions = require('../../actions/app-actions');
var FormStore = require('../../stores/form-store');
var FormStoreWatchMixin = require('../../mixins/form-store-watch-mixin');
var fn = require('../../helpers/functional');
var serialize = require('form-serialize');
window.$ = window.jQuery = require('jquery');

var url = window.apiBaseURL || '/api';

function getFormSchema() {
  return {schema: FormStore.getFormSchema()};
}

var Repeater = React.createClass({

  mixins: [FormStoreWatchMixin(getFormSchema)],

  getInitialState: function () {
    return {k: 1, rows: []};
  },

  componentDidMount: function () {
    AppActions.getFormSchema(this.props.schema);
  },

  addItem: function (event) {
    event.preventDefault();
    this.setState({k: this.state.k + 1});
  },

  deleteItem: function (event, i) {
    event.preventDefault();
    alert('delete item ' + i);
  },

  render: function () {
    var self = this;
    var deleteButton = function (i) {
      return (
        <div className="form-group clearfix">
          <button className="btn btn-small btn-error pull-right" onClick={self.deleteItem.bind(self, event, i)}>
            <span className="glyphicon glyphicon-minus glyphicon-white" aria-hidden="true"></span>
          </button>
        </div>
      );
    };
    var schema = this.state.schema;
    var fields;
    if (schema) {
      var formType = this.props.formType || 'horizontal';
      var value = this.props.value || {};
      fields = _createElements(schema, formType, value);
    } else {
      fields = <div className="form-group"><label>Loading...</label></div>;
    }
    var rows = [];
    for (var i = 0; i < this.state.k; i++) {
      rows.push(
        <div>
          <div className="form-group">
            {fields}
            {i > 0 ? deleteButton(i) : null}
          </div>
        </div>
      );
    }
    return (
      <div>
        {rows}
        <div className="form-group">
          <button className="btn btn-small btn-success" onClick={this.addItem}>
            <span className="glyphicon glyphicon-plus glyphicon-white" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    );
  }
});

function _createElements(schema, formType, value) {
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
        var key = opt.key;
        delete opt.key;
        opts[key] = opt;
      }
      formOptions = opts;
    }

    return fn.mapObject(function (k, v) {
      //var opts = Object.assign({}, {key: k, field: k, value: value[k], formType: formType}, v);
      var opts = $.extend({}, {key: k, field: k, value: value[k], formType: formType}, v);
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
      } else if (v.type === 'integer') {
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
        if (!v.hasOwnProperty('enum')) {
          opts.value = value[k + 'Id'];
        }
        var Select = require('./select');
        if (opts.type === 'multiselect') {
          opts.multi = true;
          valueFunctions.push(function (data) {
            var obj = {};
            if (data && data[k]) {
              if (typeof data[k] === 'string') {
                obj[k] = data[k].split(',');
              } else {
                obj[k] = data[k];
              }
            } else {
              obj[k] = null;
            }
            return obj;
          });
        } else {
          opts.multi = false;
        }
        return React.createElement(Select, opts);
      } else if (v.type === 'boolean') {
        var Bool = require('./bool');
        return React.createElement(Bool, opts);
      } else if (v.type === 'object') {
        var Custom = require('./custom');
        // TODO
        // assumes there is only one custom metadata section
        opts['ref'] = 'custom';
        hasCustom = true;
        return React.createElement(Custom, opts);
      }
    }, properties);
  } else {
    return React.createElement('label', null, 'Loading...');
  }
}

module.exports = Repeater;
