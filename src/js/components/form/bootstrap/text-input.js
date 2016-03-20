var React = require('react');

var TextInput = React.createClass({

  render: function () {
    return (
      <div className="form-group">
        <label htmlFor={this.props.field}>{this.props.title}</label>
        <input type="input" className="form-control" id={this.props.field} placeholder={this.props.placeholder}/>
      </div>
    );
  }
});

module.exports = TextInput;