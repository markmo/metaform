var React = require('react');
var AppActions = require('../../actions/app-actions');
var fuelux = require('fuelux');
window.$ = window.jQuery = require('jquery');
var bootstrap = require('bootstrap');

var ds1url = window.apiBaseURL || '/api';

var Pillbox = React.createClass({

  componentDidMount: function () {
    var source = this.props.source.replace('$ds1url', ds1url);
    var self = this;
    $('#' + this.props.field).pillbox({
      onKeyDown: function (event, callback) {
        // potential bug in fuelux
        // event.value is text entered as at previous keydown
        // leave as feature for now. first char will show all options
        var items;
        var src;
        var text = event.value && event.value.trim();
        if ('enum' in self.props) {
          if (text) {
            items = self.props.enum.filter(function (element) {
              return element.indexOf(text) === 0;
            });
          } else {
            items = self.props.enum;
          }
          return items.map(function (element) {
            return {
              text: element,
              value: element,
              attr: {},
              data: {}
            };
          })
        }
        if (text) {
          src = source + '/' + text;
        } else {
          src = source;
        }
        AppActions.getPillboxOptions(src).then(function (res) {
          callback(res);
        });
      }
    });
  },

  render: function () {
    var pillbox = (
      <div className="fuelux">
        <div className="pillbox" data-initialize="pillbox" id={this.props.field}>
          <ul className="clearfix pill-group">
            <li className="pillbox-input-wrap btn-group">
              <a className="pillbox-more">and <span className="pillbox-more-count"></span> more...</a>
              <input type="text" className="form-control dropdown-toggle pillbox-add-item" placeholder="add item"/>
              <button type="button" className="dropdown-toggle sr-only">
                <span className="caret"></span>
                <span className="sr-only">Toggle Dropdown</span>
              </button>
              <ul className="suggest dropdown-menu" role="menu" data-toggle="dropdown" data-flip="auto"></ul>
            </li>
          </ul>
        </div>
      </div>
    );
    if (this.props.noContainer) {
      return pillbox;
    }
    var labelGridColumns = this.props.labelGridColumns || 2;
    var controlGridColumns = 12 - labelGridColumns;
    var control;
    if (this.props.formType === 'horizontal') {
      control = (
        <div className={'col-sm-' + controlGridColumns}>
          {pillbox}
        </div>
      );
    } else {
      control = pillbox;
    }
    return (
      <div className="form-group">
        <label htmlFor={this.props.field} className={'col-sm-' + labelGridColumns + ' control-label'}>{this.props.title}</label>
        {control}
      </div>
    );
  }
});

module.exports = Pillbox;