var React = require('react');
var AppActions = require('../../actions/app-actions');
var FormStore = require('../../stores/form-store');
var FormStoreWatchMixin = require('../../mixins/form-store-watch-mixin');
var d = require('../../helpers/dom');

var List = React.createClass({

  getInitialState: function () {
    var key = getKeyForSource(this.props.source);
    return {menuItems: FormStore.getSelectOptions(key)};
  },

  componentWillMount: function () {
    if (!('async' in this.props)) {
      FormStore.addWatch(this._onChange);
    }
  },

  componentWillUnmount: function () {
    if (!('async' in this.props)) {
      FormStore.removeWatch(this._onChange);
    }
  },

  _onChange: function () {
    if (this.isMounted()) {
      var key = getKeyForSource(this.props.source);
      this.setState({menuItems: FormStore.getSelectOptions(key)});
      if (typeof(this.props.onLoad) === 'function') {
        this.props.onLoad();
      }
    }
  },

  componentDidMount: function () {
    if (!('enum' in this.props || 'async' in this.props)) {
      AppActions.getSelectOptions(this.props.source);
    }
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return !('async' in this.props);
  },

  getValue: function () {
    var el = this.refs.select1.getDOMNode();
    if (this.props.multi) {
      var selectedOptions = [];
      for (var i = 0; i < el.options.length; i++) {
        if (el.options[i].selected === true) {
          selectedOptions.push(el.options[i].value);
        }
      }
      return selectedOptions.join();
    }
    return el.options[el.selectedIndex].value;
  },

  idToValue: function (id) {
    if (id) {
      if (this.props.multi) {
        var ids = id.split(',');
        var value = [];
        for (var i = 0; i < ids.length; i++) {
          value.push(getLink(ids[i], this.state.menuItems));
        }
        return value.join();
      }
      return getLink(id, this.state.menuItems);
    }
    return null;
  },

  getLabel: function (value) {
    if (value == null || !value.length) return null;
    var itemMap = this._getItemMap();
    if (this.props.multi) {
      var values = value.split(',');
      var labels = [];
      for (var i = 0; i < values.length; i++) {
        labels.push(itemMap[values[i]]);
      }
      var label = labels.join(', ');
      return label.length ? label : null;
    }
    return itemMap[value];
  },

  _getItemMap: function () {
    var items = this.state.menuItems;
    var itemMap = {};
    if (items && items.length) {
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        itemMap[it.value] = it.label;
      }
    }
    return itemMap;
  },

  unselectAll: function () {
    var el = this.refs.select1.getDOMNode();
    for (var i = 0; i < el.options.length; i++) {
      el.options[i].selected = false;
    }
  },

  render: function () {
    var items;
    var value = null;
    var multi = this.props.multi;
    var size = this.props.size || 4;
    if ('enum' in this.props) {
      items = this.props.enum.map(function (element) {
        return {
          value: element,
          label: element
        };
      });
      value = this.props.value;
    } else if (!('async' in this.props)) {
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

    var select, control;
    select = (
      <select ref="select1" multiple={multi} size={size} onChange={this.props.onChange}>
        {items.map(function (item) {
          return (
            <option value={item.value}>{item.label}</option>
          );
        })}
      </select>
    );
    if (this.props.noContainer) {
      return select;
    }
    var labelGridColumns = this.props.labelGridColumns || 2;
    var controlGridColumns = 12 - labelGridColumns;
    if (this.props.formType === 'horizontal') {
      control = (
        <div className={'col-sm-' + controlGridColumns}>
          {select}
        </div>
      );
    } else {
      control = select;
    }
    return (
      <div className={d.classNames('form-group', this.props.className)}>
        <label htmlFor={this.props.field} className={'col-sm-' + labelGridColumns + ' control-label'}>{this.props.title}</label>
        {control}
      </div>
    );
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

module.exports = List;
