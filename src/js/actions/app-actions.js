var Fluxy = require('fluxy');
var AppConstants = require('../constants/app-constants');
var FormsService = require('../services/forms-service');

var AppActions = Fluxy.createActions({

  serviceActions: {

    getFormSchema: [AppConstants.GET_FORM_SCHEMA, function (name) {
      return FormsService.getFormSchema(name);
    }],

    createEntity: [AppConstants.CREATE_ENTITY, function (type, data) {
      return FormsService.createEntity(type, data);
    }],

    updateEntity: [AppConstants.UPDATE_ENTITY, function (link, data) {
      return FormsService.updateEntity(link, data);
    }],

    deleteEntities: [AppConstants.DELETE_ENTITIES, function (links) {
      return FormsService.deleteEntities(links);
    }],

    getEntity: [AppConstants.GET_ENTITY, function (type, id) {
      return FormsService.getEntity(type, id);
    }],

    saveValue: [AppConstants.SAVE_VALUE, function (type, id, field, value) {
      return FormsService.saveValue(type, id, field, value);
    }],

    getSelectOptions: [AppConstants.GET_SELECT_OPTIONS, function (source, q, async) {
      return FormsService.getSelectOptions(source, q, async);
    }],

    getPillboxOptions: [AppConstants.GET_PILLBOX_OPTIONS, function (source, callback) {
      return FormsService.getPillboxOptions(source);
    }],

    fetchPage: [AppConstants.FETCH_PAGE, function (entity, sourceTemplate, filter, filterParam, view, page, pageSize, sortBy, order, q) {
      return FormsService.fetchPage(entity, sourceTemplate, filter, filterParam, view, page, pageSize, sortBy, order, q);
    }]
  },

  alert: function (message) {
    this.dispatchAction(AppConstants.ALERT, message);
  }
});

module.exports = AppActions;