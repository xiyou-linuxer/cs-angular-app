'use strict';

module.exports = function (app) {

  exports.index = function* () {
    let category = parseInt(this.query.category, 10);

    let query = {};
    if (category || category === 0) {
      query.category = category;
    }

    let ret = yield this.services.message.getByQuery(this, query);
    let messages = ret.data;

    let data = {
      category: category,
      messages: messages
    };

    yield this.render('message/index', {
      data: data
    });
  };

  exports.create = function* () {
    yield this.render('message/edit');
  };

  exports.show = function* () {
    let id = parseInt(this.params.id) || 0;
    let user = this.session.grant.user;

    let message = yield this.services.message.getById(this, id);

    if (!message) {
      return this.status = 404;
    }

    if (message.author_id !== user.id && user.group !== 1) {
      return this.status = 404;
    }

    yield this.render('message/show', {
      message: message
    });
  };

  exports.update = function* () {
    let id = parseInt(this.params.id) || 0;
    let user = this.session.grant.user;

    let message = yield this.services.message.getById(this, id);

    if (!message) {
      return this.status = 404;
    }

    // 已发送或者无权限
    if (message.status !== 0 || (message.author_id !== user.id && user.group !== 1)) {
      return this.status = 404;
    }

    yield this.render('message/edit', {
      message: message
    });
  };

  return exports;
};
