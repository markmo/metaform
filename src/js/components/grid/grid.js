var React = require('react');
var AppActions = require('../../actions/app-actions');
var FormStore = require('../../stores/form-store');
var FormStoreWatchMixin = require('../../mixins/form-store-watch-mixin');
var pluralize = require('pluralize');
var Paginator = require('./paginator');
var ModalForm = require('../form/modal-form');
var ConfirmButton = require('../form/confirm-button');
var StringUtils = require('../../helpers/string');
window.$ = window.jQuery = require('jquery');

var ds1url = window.apiBaseURL || '/api';

function getPageResults() {
  var pageResults = FormStore.getPageResults();
  return {
    totalEntries: pageResults.totalEntries || 0,
    rows: pageResults.rows || []
  };
}

var Grid = React.createClass({

  mixins: [FormStoreWatchMixin(getPageResults)],

  getInitialState: function () {
    var sortBy, order;
    if (this.props.sortBy) {
      sortBy = this.props.sortBy;
    } else {
      if ('nameColumn' in this.props) {
        if (this.props.computedColumns && this.props.nameColumn in this.props.computedColumns) {
          sortBy = this.props.computedColumns[this.props.nameColumn].sortBy;
        } else {
          sortBy = this.props.nameColumn;
        }
      } else {
        sortBy = 'name';
      }
    }
    order = this.props.order || 'asc';
    return {
      page: 1,
      pageSize: 10,
      sortBy: sortBy,
      order: order,
      item: {},
      currentIndex: -1
    };
  },

  computeTotalPages: function () {
    var totalEntries = this.state.totalEntries;
    var pageSize = this.state.pageSize;
    var totalPages = parseInt(totalEntries / pageSize, 10) || 1;
    if (totalPages * pageSize < totalEntries) {
      totalPages += 1;
    }
    return totalPages;
  },

  handlePageChange: function (direction) {
    var page;
    switch (direction) {
      case 'first':
        page = 1;
        break;

      case 'prev':
        page = this.state.page - 1;
        break;

      case 'next':
        page = this.state.page + 1;
        break;

      case 'last':
        page = this.computeTotalPages();
    }
    this.setState({page: page});
    this.fetchPage(this.props, page, this.state.sortBy, this.state.order);
  },

  handlePageSizeChange: function (pageSize) {
    this.setState({pageSize: pageSize});
    this.fetchPage(this.props, this.state.page, this.state.sortBy, this.state.order);
  },

  sort: function (field) {
    var sortBy = this.state.sortBy;
    var order = this.state.order;
    if (sortBy === field) {
      if (order === 'asc') {
        order = 'desc';
      } else {
        order = 'asc';
      }
    } else {
      sortBy = field;
      order = 'asc';
    }
    this.setState({
      sortBy: sortBy,
      order: order
    });
    this.fetchPage(this.props, this.state.page, sortBy, order);
  },

  fetchPage: function (props, page, sortBy, order, q) {
    AppActions.fetchPage(
      props.entity,
      props.source,
      props.filter,
      props.filterParam,
      props.view,
      page,
      this.state.pageSize,
      sortBy,
      order,
      q);
  },

  componentDidMount: function () {
    this.fetchPage(this.props, this.state.page, this.state.sortBy, this.state.order);
    if (this.props.filter) {
      var self = this;
      $(this.refs.filter1.getDOMNode()).on('searched.fu.search', function () {
        var q = $(this).find('input').val();
        self.fetchPage(self.props, 1, self.state.sortBy, self.state.order, q);
      }).on('cleared.fu.search', function () {
        self.fetchPage(self.props, 1, self.state.sortBy, self.state.order);
      });
    }
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.entity !== this.props.entity) {
      var sortBy, order;
      if (nextProps.sortBy) {
        sortBy = nextProps.sortBy;
      } else {
        if ('nameColumn' in nextProps) {
          if (nextProps.computedColumns && nextProps.nameColumn in nextProps.computedColumns) {
            sortBy = nextProps.computedColumns[nextProps.nameColumn].sortBy;
          } else {
            sortBy = nextProps.nameColumn;
          }
        } else {
          sortBy = 'name';
        }
      }
      order = nextProps.order || 'asc';
      this.setState({
        rows: [],
        page: 1,
        pageSize: 10,
        totalEntries: 0,
        sortBy: sortBy,
        order: order,
        item: {},
        currentIndex: -1
      });
      this.fetchPage(nextProps, 1, sortBy, order);
    }
  },

  createItem: function () {
    this._createModal({});
  },

  editItem: function (i) {
    this.setState({currentIndex: i});
    var item = this.state.rows[i];
    this._createModal(item);
  },

  deleteItems: function () {
    var self = this;
    var rows = this.state.rows;
    var remaining = [];
    var deletions = [];
    var $checkboxes = $('.item-delete').each(function (i, item) {
      if (item.checked) {
        var url = rows[i]._links.self.href;
        url = url.replace(new RegExp('{.*}', 'g'), '');
        deletions.push(url);
      } else {
        remaining.push(rows[i]);
      }
    });
    AppActions.deleteEntities(deletions).then(function () {
      $checkboxes.prop('checked', false);
      self.setState({rows: remaining});
      setTimeout(function () {self.refresh()}, 200);
    });
  },

  handleSubmission: function (obj) {

    // workaround as Spring Data REST does not provide a link/identifier for associated entities.
    // TODO
    // this must be refactored to use the Store
    // setTimeout(function () {
    //   this.fetchPage(this.props, this.state.page, this.state.sortBy, this.state.order);
    // }.bind(this), 200);
    setTimeout(this.refresh, 2000);

    // var currentIndex = this.state.currentIndex;
    // var rows = this.state.rows.slice(0);
    // if (currentIndex < 0) {
    //   rows.unshift(obj);
    //   this.setState({rows: rows});
    // } else {
    //   rows.splice(currentIndex, 1, obj);
    //   this.setState({
    //     rows: rows,
    //     currentIndex: -1
    //   });
    // }
  },

  refresh: function () {
    this.fetchPage(this.props, this.state.page, this.state.sortBy, this.state.order);
  },

  render: function () {
    var nameColumn = this.props.nameColumn || 'name';
    var title = this.props.title || StringUtils.readable(this.props.entity);
    var projection = this.props.projection;
    var addButton = (
      <button className="btn btn-default btn-success" onClick={this.createItem}>
        <span className="glyphicon glyphicon-plus glyphicon-white" aria-hidden="true"></span>
        <span> New {title}&hellip;</span>
      </button>
    );
    var filterCtrl = (
      <div className="search input-group" role="search" ref="filter1" data-initialize="search">
        <input type="search" className="form-control" placeholder={'Filter by ' + this.props.nameColumn}/>
        <span className="input-group-btn">
          <button className="btn btn-default" type="button">
            <span className="glyphicon glyphicon-search"></span>
            <span className="sr-only">Filter</span>
          </button>
        </span>
      </div>
    );
    var actionColumns = (
      <th colSpan="2" className="action-columns"></th>
    );
    var editColumn = function (row, i) {
      var actions = this.props.computedColumns && this.props.computedColumns.actions;
      if (actions) {
        return (
          <td key={'edit-' + row.id} className="action-edit">
            <div className="dropdown">
              <a href="#" id={'actions_' + i} data-target="#" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
                Actions
                <span className="caret"></span>
              </a>
              <ul className="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby={'actions_' + i}>
                <li role="presentation" className="dropdown-header">
                  {row[nameColumn]}
                </li>
                <li role="presentation">
                  <a href="#" role="menuitem" tabIndex="-1" onClick={this.editItem.bind(this, i)}>
                    <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                    Edit item
                  </a>
                </li>
                {actions.map(function (action, j) {
                  var a = action(row);
                  if (React.isValidElement(a)) {
                    return a;
                  }
                  return (
                    <li key={j} role="presentation">
                      <a href="#" role="menuitem" tabIndex="-1" onClick={a.onClick}>
                        <span className={a.iconClassName} aria-hidden="true"></span>
                        {a.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </td>
        );
      } else {
        return (
          <td key={'edit-' + row.id} className="action-edit">
            <a href="#" className="item-edit" alt="Edit item" title="Edit item" onClick={this.editItem.bind(this, i)}>
              <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
            </a>
          </td>
        );
      }
    }.bind(this);
    var deleteColumn = function (row) {
      return (
        <td key={'delete-' + row.id} className="action-delete"><input className="item-delete" type="checkbox" alt="Check to delete" title="Check to delete"/></td>
      )
    };
    // var deleteButton = (
    //   <td className="action-delete">
    //     <button className="btn btn-danger" onClick={this.deleteItems}>
    //       <span className="glyphicon glyphicon-remove glyphicon-white" aria-hidden="true"></span>
    //       Delete
    //     </button>
    //   </td>
    // );
    var deleteButton = (
      <td className="action-delete">
        <ConfirmButton title="Delete" onAccept={this.deleteItems}/>
      </td>
    );
    return (
      <div className="grid">
        <h1 dangerouslySetInnerHTML={{__html: this.props.parent ? this.props.parent + ' > ' + pluralize(title) : pluralize(title)}}/>
        <div className="grid-controls clearfix">
          <div>{this.props.editable ? addButton : null}</div>
          <div className="filter-control">{this.props.filter ? filterCtrl : null}</div>
          <div className="refresh-btn">
            <button className="btn btn-default" onClick={this.refresh}>
              <i className="fa fa-refresh"></i>
            </button>
          </div>
        </div>
        <div ref="modal"></div>
        <table className="table table-hover">
          <thead>
          <tr>
            {this.props.projection.map(function (column, i) {
              var header = StringUtils.readable(column);
              var className;
              var sortBy;
              if (this.props.computedColumns && column in this.props.computedColumns) {
                sortBy = this.props.computedColumns[column].sortBy;
              } else {
                sortBy = column;
              }
              if (this.state.sortBy === sortBy) {
                if (this.state.order === 'asc') {
                  className = 'sort-asc';
                } else {
                  className = 'sort-desc';
                }
                return (
                  <th key={'header' + i} className={className}><a href="#" onClick={this.sort.bind(this, sortBy)}>{header}</a></th>
                );
              } else {
                return (
                  <th key={'header' + i}><a href="#" onClick={this.sort.bind(this, sortBy)}>{header}</a></th>
                );
              }
            }, this)}
            {this.props.editable ? actionColumns : null}
          </tr>
          </thead>
          <tbody>
          {this.state.rows.map(function (row, i) {
            return (
              <tr key={row.id}>
                {this.props.projection.map(function (column, j) {
                  var value;
                  if (this.props.computedColumns && column in this.props.computedColumns) {
                    value = this.props.computedColumns[column].compute(row);
                  } else {
                    value = row[column];
                  }
                  if (this.props.editable && column === nameColumn) {
                    return (
                      <td key={j}><a href="#" onClick={this.editItem.bind(this, i)}>{value}</a></td>
                    );
                  } else {
                    return (
                      <td key={j}>{value}</td>
                    );
                  }
                }.bind(this))}
                {this.props.editable ? editColumn(row, i) : null}
                {this.props.editable ? deleteColumn(row) : null}
              </tr>
            );
          }, this)}
          </tbody>
          <tfoot>
          <tr>
            <td colSpan={this.props.projection.length + (this.props.editable ? 1 : 0)} className="pagination-cell">
              <Paginator page={this.state.page} pageSize={this.state.pageSize} totalEntries={this.state.totalEntries}
                         onPageChange={this.handlePageChange} onPageSizeChange={this.handlePageSizeChange}/>
            </td>
            {this.props.editable ? deleteButton : null}
          </tr>
          </tfoot>
        </table>
      </div>
    );
  },

  _createModal: function (item) {
    this.setState({item: item});
    //var container = this.refs.modal.getDOMNode();
    var container = document.getElementById('modals');
    if (!container) {
      container = this.refs.modal.getDOMNode();
    }
    var entity = this.props.entity;
    var title = this.props.title || StringUtils.readable(entity);
    React.render(
      React.createElement(ModalForm, {
        title: title,
        name: entity,
        value: item,
        autoshow: true,
        filterParam: this.props.filterParam,
        onHidden: function () {
          React.unmountComponentAtNode(container);
        },
        onSubmitted: this.handleSubmission
      }), container);
  }
});

module.exports = Grid;
