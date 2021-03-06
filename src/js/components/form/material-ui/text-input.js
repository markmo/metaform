var React = require('react');
var mui = require('material-ui');
var Input = mui.Input;

var TextInput = React.createClass({

  render: function () {
    return (
      <Input type="text" name={this.props.field} description={this.props.description} placeholder={this.props.title}/>
    );
  }
});

module.exports = TextInput;