/*global QUnit*/

sap.ui.define([
	"comnewcustqr/newcustqr/controller/CreateNewCust.controller"
], function (Controller) {
	"use strict";

	QUnit.module("CreateNewCust Controller");

	QUnit.test("I should test the CreateNewCust controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
