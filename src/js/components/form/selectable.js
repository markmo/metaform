var React = require('react');
var Placard = require('./placard');
var Label = require('./label');
var List = require('./list');

var Selectable = React.createClass({

  getInitialState: function () {
    if (this.props.enum) {
      return {
        editing: false,
        value: this.props.value,
        label: this.props.value
      }
    } else {
      return {
        editing: false,
        value: null,
        label: 'Loading...'
      }
    }
  },

  handleClick: function () {
    if (!this.state.editing) {
      this.setState({editing: true});
    }
  },

  handleAccept: function (newValue) {
    var label;
    if (this.props.enum) {
      label = newValue;
    } else {
      label = this.refs.list1.getLabel(newValue);
    }
    this.setState({
      editing: false,
      value: newValue,
      label: label
    });
    if (typeof(this.props.onAccept) === 'function') {
      this.props.onAccept(newValue);
    }
  },

  handleCancel: function (event) {
    this.setState({editing: false});
  },

  getListValue: function () {
    return this.refs.list1.getValue();
  },

  handleListLoad: function () {
    if (!this.props.enum) {
      var value = this.refs.list1.idToValue(value);
      this.setState({
        value: value,
        label: this.refs.list1.getLabel(value)
      });
    }
  },

  render: function () {
    return (
      <Placard {...this.props} onClick={this.handleClick} onAccept={this.handleAccept} onCancel={this.handleCancel} getValue={this.getListValue}>
        <input ref={this.props.field + '-input'} className="form-control placard-field glass" type="text"
               id={this.props.field} value={this.state.label} readOnly={true}
               style={{display: (this.state.editing ? 'none' : 'block')}}/>
        <div style={{display: (this.state.editing ? 'block' : 'none')}}>
          <List ref="list1" {...this.props} value={this.state.value} noContainer={true} onLoad={this.handleListLoad}/>
        </div>
      </Placard>
    );
  }
});

module.exports = Selectable;