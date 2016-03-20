var React = require('react');
var StringHelper = require('../helpers/string');

var Truncated = React.createClass({

  getInitialState: function () {
    return {
      truncated: true
    };
  },

  toggleMore: function (event) {
    event.preventDefault();
    this.setState({truncated: !this.state.truncated});
  },

  render: function () {
    var size = this.props.size || 240;
    var text = this.props.text || '';
    if (text.length > size) {
      if (this.state.truncated) {
        return (
          <div>
            {StringHelper.truncate(text, size)}<a href="#" onClick={this.toggleMore}>&hellip;</a>
          </div>
        );
      } else {
        return (
          <div>{text} <a href="#" onClick={this.toggleMore}>&lt;</a></div>
        );
      }
    } else {
      return (
        <div>{text}</div>
      );
    }
  }
});

module.exports = Truncated;