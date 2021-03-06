var React = require('react');
var AppActions = require('../../actions/app-actions');
var FormStore = require('../../stores/form-store');
var FormStoreWatchMixin = require('../../mixins/form-store-watch-mixin');
var Rselect = require('react-select');
var d = require('../../helpers/dom');

var Select = React.createClass({

  getInitialState: function () {
    var key = getKeyForSource(this.props.source);
    return {menuItems: FormStore.getSelectOptions(key)};
  },

  componentWillMount: function () {
    if (!this.props.async) {
      FormStore.addWatch(this._onChange);
    }
  },

  componentWillUnmount: function () {
    if (!this.props.async) {
      FormStore.removeWatch(this._onChange);
    }
  },

  _onChange: function () {
    if (this.isMounted()) {
      var key = getKeyForSource(this.props.source);
      this.setState({menuItems: FormStore.getSelectOptions(key)});
      this.props.selectPopulatedAction();
    }
  },

  componentDidMount: function () {
    if (!this.props.enum && !this.props.async) {
      var source = this.props.source.replace('$filterParam', this.props.filterParam);
      AppActions.getSelectOptions(source);
    }
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return !this.props.async;
  },

  getAsyncOptions: function (input, callback) {
    var source = this.props.source;
    var link = source + this.props.async;
    AppActions.getSelectOptions(link, input, true).then(function () {
        var key = getKeyForSource(source);
        var options = FormStore.getSelectOptions(key);
        callback(null, {options: options});

      }).catch(function (err) {
        AppActions.alert({error: err, message: err});
      });
  },

  render: function () {
    var items;
    var value = null;
    var multi = !!(this.props.multi);
    if (this.props.enum) {
      items = this.props.enum.map(function (elem) {
        return {
          value: elem,
          label: elem
        };
      });
      value = this.props.value;
    } else if (!this.props.async) {
      items = this.state.menuItems;
      if (this.props.value) {
        if (multi && items.length > 1) {
          value = this.props.value.split(',').map(function (v) {
            return getLink(v, items);
          });
        } else {
          value = getLink(this.props.value, items);
        }
      }
    }

    var select;
    if (this.props.async) {
      select = (
        <Rselect name={this.props.field} asyncOptions={this.getAsyncOptions} multi={multi} onChange={this.props.onChange}/>
      );
    } else {
      select = (
        <Rselect name={this.props.field} options={items} value={value} multi={multi} onChange={this.props.onChange}/>
      );
    }
    if (this.props.noContainer) {
      return select;
    }
    var labelGridColumns = this.props.labelGridColumns || 2;
    var controlGridColumns = 12 - labelGridColumns;
    if (this.props.formType === 'horizontal') {
      return (
        <div className={d.classNames('form-group', this.props.className)}>
          <label htmlFor={this.props.field} className={'col-sm-' + labelGridColumns + ' control-label'}>{this.props.title}</label>
          <div className={'col-sm-' + controlGridColumns}>
            {select}
          </div>
        </div>
      );
    } else {
      return (
        <div className={d.classNames('form-group', this.props.className)}>
          <label htmlFor={this.props.field}>{this.props.title}</label>
          {select}
        </div>
      );
    }
  }
});

function getKeyForSource(source) {
  if (source) {
    var match = source.match(/[^\/]+\/([^\/]+)(\/.*)?/);
    return match[1];
  }
  return source;
}

function getLink(id, menuItems) {
  if (id == null) return null;
  var link, match;
  for (var i = 0; i < menuItems.length; i++) {
    link = menuItems[i].value;
    match = /\/(\d+)$/.exec(link);
    if (match && match[1] == id) {
      return link;
    }
  }
  return null;
}

module.exports = Select;
