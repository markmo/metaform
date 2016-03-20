var React = require('react');
var mui = require('material-ui');
var Checkbox = mui.Checkbox;

var Bool = React.createClass({

  render: function () {
    return (
      <div className="mm-checkbox-control">
        <div className="mm-checkbox-label">{this.props.title}</div>
        <Checkbox type="text" name={this.props.field}/>
      </div>
    );
  }
});

module.exports = Bool;