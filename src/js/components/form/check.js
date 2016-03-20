var React = require('react');
var Placard = require('./placard');
var Label = require('./label');
var Bool = require('./bool');

var Check = React.createClass({

  getInitialState: function () {
    return {
      editing: false,
      value: this.props.value,
      label: this.props.value ? 'Yes' : 'No'
    }
  },

  handleClick: function () {
    if (!this.state.editing) {
      this.setState({editing: true});
    }
  },

  handleAccept: function (newValue) {
    this.setState({
      editing: false,
      value: newValue,
      label: newValue ? 'Yes' : 'No'
    });
    if (typeof(this.props.onAccept) === 'function') {
      this.props.onAccept(newValue);
    }
  },

  handleCancel: function (event) {
    this.setState({editing: false});
  },

  getValue: function () {
    return this.refs.bool1.getValue();
  },

  render: function () {
    return (
      <Placard {...this.props} onClick={this.handleClick} onAccept={this.handleAccept} onCancel={this.handleCancel} getValue={this.getValue}>
        <input ref={this.props.field + '-input'} className="form-control placard-field glass" type="text"
               id={this.props.field} value={this.state.label} readOnly={true}
               style={{display: (this.state.editing ? 'none' : 'block')}}/>
        <div style={{display: (this.state.editing ? 'block' : 'none')}}>
          <Bool ref="bool1" {...this.props} value={this.state.value} title="" noContainer={true}/>
        </div>
      </Placard>
    );
  }
});

module.exports = Check;