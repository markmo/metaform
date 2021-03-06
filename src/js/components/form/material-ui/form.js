var React = require('react');
var merge = require('react/lib/merge');
var mui = require('material-ui');
var RaisedButton = mui.RaisedButton;
var FormStore = require('../../stores/form-store');
var FormStoreWatchMixin = require('../../mixins/form-store-watch-mixin');
var fn = require('../../helpers/functional');
var AppActions = require('../../actions/app-actions');
var serialize = require('form-serialize');

function getFormSchema() {
  return {schema: FormStore.getFormSchema()};
}

function createElements(schema) {
  if (schema.hasOwnProperty('schema')) {
    var properties = schema.schema.properties;
    return fn.mapObject(function (k, v) {
      if (v.type === 'string') {
        var TextInput = require('./text-input');
        var opts = merge({field: k}, v);
        opts = merge(opts, schema.form[k]);
        return React.createElement(TextInput, opts);
      } else if (v.type === 'array') {
        var Select = require('./select');
        var opts = merge({field: k}, v);
        opts = merge(opts, schema.form[k]);
        return React.createElement(Select, opts);
      } else if (v.type === 'boolean') {
        var Bool = require('./bool');
        var opts = merge({field: k}, v);
        opts = merge(opts, schema.form[k]);
        return React.createElement(Bool, opts);
      }
    }, properties);
  } else {
    return React.createElement('label', null, 'Loading...');
  }
}

var Form = React.createClass({

  mixins: [FormStoreWatchMixin(getFormSchema)],

  componentWillMount: function () {
    AppActions.getFormSchema(this.props.name);
  },

  handleSubmit: function (event) {
    event.preventDefault();
    var form = this.refs.form1.getDOMNode();
    //var str = serialize(form, {hash: true}); // url encoded
    var obj = serialize(form, {hash: true});
    // however doesn't include dropdown values
    alert(JSON.stringify(obj));
    return false;
  },

  render: function () {
    var schema = this.state.schema;
    var fields = createElements(schema);
    return (
      <form ref="form1" role="form">
        {fields}
        <RaisedButton label="Submit" primary={true} onClick={this.handleSubmit}/>
      </form>
    );
  }
});

module.exports = Form;