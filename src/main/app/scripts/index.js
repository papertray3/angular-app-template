'use strict';

var bulk = require('bulk-require');
var plural = require('pluralize');
/* replacing with angular ui bootstrap

require('bootstrap');
*/
var angular = require('angular');

require('angular-ui-bootstrap');
require('angular-ui-router');
require('angular-ui-tree');

var requires = [
                  'ui.bootstrap',
                  'ui.router',
                  'ui.tree'
                ];

/* get all objects below the current directory and load them into
 * the appropriate part of the application. New modules will be created
 * for each directory.subdirectory all prefixed with 'app' and added to the requires
 * variable above. code should be split up into functional sections (i.e. controllers, services, etc.)
 *
 * Each object should export the following:
 * {
 * 	exclude: true|false (optional, defaults to false)
 *  type: config|controller|service|factory|provider|directive|... others (required, the function name to call on the angular object)
 *  name: <name of thing> (optional in the case of config or run)
 *  fob: function or object
 * }
 */

//don't name any *.js file with any of the following:
const ignores = ['exclude', 'type', 'name', 'fob'];

/**
 *
 * @param top - best guess as to what the thing is (makes the 'type' optional)
 * @param moduleName
 * @param objectName
 * @param object
 */
function addModule(top, moduleName, objectName, object) {


	if (object.fob && (object.exclude === undefined || object.exclude === false)) {
		var mod;
		try {
			mod = angular.module(moduleName);
		} catch (e) {
			mod = angular.module(moduleName, []);
			requires.push(moduleName);
		}

		var type = object.type ? object.type : top;

		if (type === 'config' || type === 'run') {
			mod[type](object.fob);
		} else {
			mod[type](object.name, object.fob);
		}
	}

	for (var prop in object) {
		if (object.hasOwnProperty(prop) && ignores.indexOf(prop) === -1) {
			addModule(top, moduleName + '.' + objectName, prop, object[prop]);
		}
	}

}

const modules = bulk(__dirname, ['./**/!(*index|*.spec).js']);

//top level...expecting an object of objects
for (var prop in modules) {
	if (modules.hasOwnProperty(prop)) {
		var modName = 'app.' + prop;
		var topLevelMod = modules[prop];
		for (var modKey in topLevelMod) {
			if (topLevelMod.hasOwnProperty(modKey)) {
				addModule(plural(prop,1), modName, modKey, topLevelMod[modKey]);
			}
		}
	}
}

window.app = angular.module('app', requires);
angular.bootstrap(document.body, ['app']);
