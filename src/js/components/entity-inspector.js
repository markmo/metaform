var React = require('react');
var AppActions = require('../actions/app-actions');
var FormStore = require('../stores/form-store');
var FormStoreWatchMixin = require('../mixins/form-store-watch-mixin');
var Readonly = require('./form/readonly');
var pluralize = require('pluralize');
var StringHelper = require('../helpers/string');

var EntityInspector = React.createClass({

  mixins: [FormStoreWatchMixin(getItem)],

  componentWillMount: function () {
    AppActions.getEntity(this.props.type, this.props.id);
  },

  handleChange: function (field, newValue) {
    AppActions.saveValue(this.props.type, this.props.id, field, newValue);
  },

  render: function () {
    var title = this.props.title || this.state.item.name || StringHelper.readable(this.props.type);
    return (
      <div>
        <h1>{title}</h1>
        <Readonly name={pluralize(this.props.type, 1)} noChange={false} value={this.state.item} onChange={this.handleChange}/>
      </div>
    );
  }
});

function getItem() {
  return {item: FormStore.getItem()};
}

module.exports = EntityInspector;