var React = require('react');
var AppActions = require('../../actions/app-actions');
var FormStore = require('../../stores/form-store');
var FormStoreWatchMixin = require('../../mixins/form-store-watch-mixin');
var serialize = require('form-serialize');
var bootstrap = require('bootstrap');
var fuelux = require('fuelux');
var _ = require('../../helpers/functional');
window.$ = window.jQuery = require('jquery');

var ds1url = window.apiBaseURL || '/api';

var valueFunctions = [];

// TODO
// assumes there is only one custom metadata section
var hasCustom = false;

var Form = React.createClass({

  mixins: [FormStoreWatchMixin(getFormSchema)],

  componentWillMount: function () {
    AppActions.getFormSchema(this.props.name);
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    // var shouldUpdate = !this.props.async && nextProps.value !== this.currentValue;
    // this.currentValue = nextProps.value;
    // return shouldUpdate;
    return !this.props.async;
  },

  // componentDidMount: function () {
  //   $('.checkbox').checkbox();
  // },

  handleSubmit: function (event) {
    event.preventDefault();
    var form = this.refs[this.props.name + '-form'].getDOMNode();
    //var str = serialize(form, {hash: true}); // url encoded
    var serialized = serialize(form, {hash: true});

    var obj = {};
    var key;
    var properties;
    var spec = this.state.schema;
    var schema = spec.schema;
    if ('properties' in schema) {
      properties = schema.properties;
    } else {
      properties = schema;
    }

    // initialize the object to update the server model for empty form fields
    for (key in properties) {
      if (properties[key].type === 'array' &&
          key in spec.form &&
          'type' in spec.form[key] &&
          spec.form[key].type === 'multiselect')
      {
        obj[key] = [];
      } else {
        obj[key] = null;
      }
    }

    // convert booleans
    for (key in serialized) {
      var val = serialized[key];
      if (val === 'on') {
        obj[key] = true;
      } else {
        obj[key] = val;
      }
    }
    for (var i = 0; i < valueFunctions.length; i++) {
      //obj = Object.assign({}, obj, valueFunctions[i](obj));
      obj = $.extend({}, obj, valueFunctions[i](obj));
    }
    if (hasCustom) {
      var customFields = this.refs.custom.getFields();
      var temp = {};
      for (i = 0; i < customFields.length; i++) {
        key = customFields[i];
        temp[key] = obj[key];
        delete obj[key];
      }
      obj['custom_metadata'] = temp;
    }

    var save = true;
    if (typeof(this.props.onPreSubmit) === 'function') {
      save = this.props.onPreSubmit(obj);
    }

    if (save) {
      var item = this.props.value;
      if ('_links' in item) {
        AppActions.updateEntity(item._links.self.href, obj);
      } else {
        AppActions.createEntity(this.props.name, obj);
      }
      if (typeof(this.props.onSubmitted) === 'function') {
        this.props.onSubmitted(obj);
      }
    }
  },

  handleSelectPopulated: function () {
    this.setState({disabled: false});
  },

  render: function () {
    var schema = this.state.schema;
    var formType = this.props.formType || 'horizontal';
    var value = this.props.value || {};
    var fields = createElements(schema, formType, value, this.props.filterParam, this.handleSelectPopulated, this.state.disabled);
    var submitButton;
    if (this.state.disabled) {
      submitButton = (
        <button ref="submitBtn" type="button" className="btn btn-default" disabled>Save</button>
      );
    } else {
      submitButton = (
        <button ref="submitBtn" type="button" className="btn btn-default"
                onClick={this.handleSubmit} data-loading-text="Updating..."
                autoComplete="off">Save</button>
      );
    }
    if (formType === 'horizontal') {
      return (
        <form id={this.props.name + '-form'} ref={this.props.name + '-form'} role="form" className="form-horizontal">
          {fields}
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              {submitButton}
            </div>
          </div>
        </form>
      );
    } else {
      return (
        <form id={this.props.name + '-form'} ref={this.props.name + '-form'} role="form">
          {fields}
          {submitButton}
        </form>
      );
    }
  }
});

function getFormSchema() {
  return {schema: FormStore.getFormSchema(), disabled: true};
}

function createElements(schema, formType, value, filterParam, handleSelectPopulated, disabled) {
  var properties;
  var i;
  if ('schema' in schema) {
    if ('properties' in schema.schema) {
      properties = schema.schema.properties;
    } else {
      properties = schema.schema;
    }

    var formOptions = schema.form || {};

    // TODO
    // The form options array was intended to communicate field order
    // as JSON object keys are unordered, as per the spec.
    // Enhance to use form options index to order fields, if given.
    if (formOptions && formOptions.constructor === Array) {
      var opts = {};
      for (i = 0; i < formOptions.length; i++) {
        var opt = formOptions[i];
        var key = opt.key;
        delete opt.key;
        opts[key] = opt;
      }
      formOptions = opts;
    }

    var tabbedLayout;
    if (formOptions && (tabbedLayout = formOptions.tabbedLayout)) {
      var tabs = [], tab;
      var panes = [], pane;
      var li, fields, fieldname;
      for (i = 0; i < tabbedLayout.length; i++) {
        tab = tabbedLayout[i];
        fields = [];
        for (var j = 0; j < tab.fields.length; j++) {
          fieldname = tab.fields[j];
          fields.push(createField(formType, value, formOptions, fieldname, properties[fieldname], filterParam, handleSelectPopulated, disabled));
        }
        if (i == 0) {
          li = (
            <li role="presentation" className="active">
              <a href={'#' + tab.id} aria-controls={tab.id} role="tab" data-toggle="tab">{tab.title}</a>
            </li>
          );
          pane = (
            <div role="tabpanel" className="tab-pane active" id={tab.id}>
              {fields}
            </div>
          );
        } else {
          li = (
            <li role="presentation">
              <a href={'#' + tab.id} aria-controls={tab.id} role="tab" data-toggle="tab">{tab.title}</a>
            </li>
          );
          pane = (
            <div role="tabpanel" className="tab-pane" id={tab.id}>
              {fields}
            </div>
          );
        }
        tabs.push(li);
        panes.push(pane);
      }
      return (
        <div>
          <ul className="nav nav-tabs" role="tablist">
            {tabs}
          </ul>
          <div className="tab-content">
            {panes}
          </div>
        </div>
      );
    } else {
      return _.mapObject(function (k, v) {
        return createField(formType, value, formOptions, k, v, filterParam, handleSelectPopulated, disabled);
      }, properties);
    }
  } else {
    return createLabel('Loading...');
  }
}

function createField(formType, value, formOptions, k, v, filterParam, handleSelectPopulated, disabled) {
  var opts = $.extend({}, {key: k, field: k, value: value[k], formType: formType, filterParam: filterParam, selectPopulatedAction: handleSelectPopulated, disabled: disabled}, v);
  if (formOptions && (k in formOptions)) {
    opts = $.extend({}, opts, formOptions[k]);
  }
  if (v.type === 'string' && !('enum' in v)) {
    if (opts.escape) {
      opts.value = encodeURI(opts.value);
    }
    if (opts.type === 'textarea') {
      return createTextarea(opts);
    }
    return createTextInput(opts);

  } else if (v.type === 'integer') {
    return createTextInput(opts);

  } else if (v.type === 'array' || 'enum' in v) {
    if (opts.type === 'pillbox') {
      return createPillbox(opts);
    }
    if (opts.type === 'repeater') {
      return createRepeater(opts);
    }
    if (!v.hasOwnProperty('enum')) {
      opts.value = value[k + 'Id'];
    }
    return createSelect(opts);

  } else if (v.type === 'boolean') {
    return createBool(opts);

  } else if (v.type === 'object') {
    return createCustom(opts);
  }
}

function createLabel(text) {
  return React.createElement('label', null, text);
}

function createTextInput(opts) {
  var TextInput = require('./text-input');
  return React.createElement(TextInput, opts);
}

function createTextarea(opts) {
  var Textarea = require('./textarea');
  return React.createElement(Textarea, opts);
}

function createPillbox(opts) {
  var field = opts.field;
  var Pillbox = require('./pillbox');
  valueFunctions.push(function () {
    var obj = {};
    obj[field] = $('#' + field).pillbox('items').map(function (obj) {
        return obj.text;
      });
    return obj;
  });
  return React.createElement(Pillbox, opts);
}

function createBool(opts) {
  var Bool = require('./bool');
  return React.createElement(Bool, opts);
}

function createSelect(opts) {
  var field = opts.field;
  var Select = require('./select');
  if (opts.type === 'multiselect') {
    opts.multi = true;
    valueFunctions.push(function (data) {
      var obj = {};
      if (data && data[field]) {
        if (typeof data[field] === 'string') {
          obj[field] = data[field].split(',');
        } else {
          obj[field] = data[field];
        }
      } else {
        obj[field] = null;
      }
      return obj;
    });
  } else {
    opts.multi = false;
  }
  return React.createElement(Select, opts);
}

// TODO
function createRepeater(opts) {
  var Repeater = require('./repeater');
  valueFunctions.push(function () {
    return {
      customerIdMappings: [
        {
          pk: {
            customerIdType: ds1url + '/customer-id-types/662',
            eventType: ds1url + '/event-types/42'
          },
          customerIdExpression: "#this['Customer_ID_Siebel']"
        }
      ]
    };
  });
  return React.createElement(Repeater, opts);
}

function createCustom(opts) {
  var Custom = require('./custom');
  // TODO
  // assumes there is only one custom metadata section
  opts['ref'] = 'custom';
  hasCustom = true;
  return React.createElement(Custom, opts);
}

module.exports = Form;
