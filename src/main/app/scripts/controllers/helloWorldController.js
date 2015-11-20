'use strict';

function HelloWorldController() {
  this.greeting = 'Hello World!';
  this.rows = [{
      "name": "node1",
      "columns": [
        {
          "name": "node1.1"
        },
        {
          "name": "node1.2"
        }
      ],
    }, {
      "name": "node2",
      "columns": [
        {
          "name": "node2.1"
        },
        {
          "name": "node2.2"
        }
      ],
    }, {
      "name": "node3",
      "columns": [
        {
          "name": "node3.1"
        }
      ],
    }, {
      "name": "node4",
      "columns": [
        {
          "name": "node4.1"
        }
      ],
    }];
}

export default {
  fob: HelloWorldController,
  name: 'HelloWorldController'
};
