## Synopsis
![ScreenShot](http://genesismission.4t.com/Physics/particle_physics/anti-neutron.gif)


  Antineutrons.js enables you to create application on web platforms using javascript technology with react like
coding structure and styling.

## Code Example
use jquery-latest cdn

https://code.jquery.com/jquery-1.11.3.min.js
<html>
<head>
</head>
<body>
<div id="main"></div>
<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
	<script type="text/javascript" src="antineutrons.js"></script>
	<script type="text/javascript">
		var Example = createClass( {
		    render: [
	        '<div>',
	          '<h1>antineutrons</h1>',
	          '<img src="http://genesismission.4t.com/Physics/particle_physics/anti-neutron.gif">',
	          '<ul class="items"></ul>',
	        '</div>'
		    ],

		    mountComponent: function () {
	        this.data = [
	          {
	          	title: 'Antineutrons.js',
	          	year: 1996,
	          	completed: false
	          }
	        ];
		    },

		    updateInitialState: function () {
		        this.searchComponent( 'ul.items' ).newIntent( this.data, ExampleItem, this );
		    }

		} );

		var ExampleItem = createClass( {

		    render: [
	        '<li>',
	          '<strong class="title"></strong>',
	        '</li>'
		    ],

		    mountComponent: function ( todo ) {
	          this.todo = todo;
	          this.onState( 'click', this.toggle );
		    },

		    updateInitialState: function () {
	          this.component.mergeComponent( this.data.title );
	          this.component.componentClass( { completed: this.data.completed } );
		    },

		    toggle: function () {
	          this.data.completed = !this.data.completed;
	          this.todo.update();
		    }

		} );
		Example.renderComponent('#main');
	</script>

</body>
</html>

## Motivation
  Just practicing javascript and stuff.

## Installation

include jquery cdn

No Installation

## API Reference

No API Reference

## Tests
use xampp server for testing.

## Contributors
@armangian
https://twitter.com/pluseks

## License
No License
