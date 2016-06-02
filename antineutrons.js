;( function ( root, factory ) {

	if ( typeof define === 'function' && define.amd ) {
		define( [], function () { return factory; } );
	} else if ( typeof module === 'object' && module.exports ) {
		module.exports = factory;
	} else {
		factory( root.$ );
	}

} )

( this, function ( $ ) {

	$.mainComponentonentId = $.mainComponentonentId || 0;

	var extend = $.extend, isArray = $.isArray, each = $.each;
		createClass = function ( settings ) {
			var callCompnentState = function ( el, env, data ) {
				$.mainComponent.call( this, el, env, data );
			};

			callCompnentState.prototype = Object.create( $.mainComponent.prototype );
			callCompnentState.prototype.factory = callCompnentState;
			extend( callCompnentState, $.mainComponent );
			var convertElement = settings.render;
			var elementComponent = convertElement;
			var render = elementComponent;


			callCompnentState.render = $( isArray( render ) ? render.join( '\n' ) : render )[ 0 ];
			callCompnentState.identify = settings.identify;
			callCompnentState.id = settings.id || ++$.mainComponentonentId;
			var proto = extend( callCompnentState.prototype, settings );
			delete proto.render;
			delete proto.identify;
			delete proto.id;
			return callCompnentState;
	};

	$.mainComponent = function ( el, env, data ) {
		this.el = el;
		this.component = $( el );

		this.mountComponent( env );
		this.setState( data );
	};

	extend( $.mainComponent, {

		renderComponent: function ( container, env, data ) {
			var comp = this.createComponent( env, data );
			comp.component.appendTo( container );
			return comp;
		},

		createComponent: function ( env, data ) {
			return this.mountComponent( this.render ? this.render.cloneNode( true ) : null, env, data );
		},

		mountComponent: function ( el, env, data ) {

			var component = $( el ).eq( 0 );
			el = component[ 0 ];
			if ( !el ) return new this( null, env, data );
			var comps = el.createClassComps = el.createClassComps || {};
			var comp = comps[ this.id ];

			if ( comp ) return comp;
			try {
				if ( !data ) data = JSON.parse( component.attr( deliverAttr + this.id ) || null );
			} catch ( ex ) {
				console.warn( ex );
			}
			comp = comps[ this.id ] = new this( el, env, data );
			return comp;

		},

		unmountComponent: function ( el ) {
			el =  $( el )[ 0 ];
			if ( el && el.createClassComps ) {
				var comp = el.createClassComps[ this.id ];
				if ( comp ) {
					comp.unmountComponent();
					delete el.createClassComps[ this.id ];
				}
			}
		},

		inflictComponent: function ( env, data ) {
			return this.createComponent( env, data ).component.inflictComponent( true );
		}

	} );

	extend( $.mainComponent.prototype, {

		mountComponent: function () {},

		updateInitialState: function () {},

		unmountComponent: function () {},

		fetchData: function () {

		},

		setState: function ( data ) {
			if ( data ) this.data = data;
			this.updateInitialState();
			return this;
		},

		onState: function () {
			var comp = this;
			var args = [].map.call( arguments, function ( arg ) {
				return typeof arg === 'function' ? arg.bind( comp ) : arg;
			} );

			comp.component.on.apply( comp.component, args );
			return comp;

		},

		searchComponent: function () {
			return this.component.find.apply( this.component, arguments );
		}

	} );

	extend( $.fn, {

		mountComponent: function ( factory, env, data ) {
			return this.each( function () {
				factory.mountComponent( this, funcValue( env, this ), funcValue( data, this ) );
			} );

		},

		updateInitialState: function ( factory, data ) {

			return this.comps( factory, function () {
				this.set( funcValue( data, this ) );
			} );

		},

		unmountComponent: function ( factory ) {

			return this.comps( factory, function () {
				this.factory.unmountComponent( this.el );
			} );

		},

		comps: function ( factory, fn ) {

			if ( factory && fn ) {

				var id = factory.id;
				return this.each( function () {
					var comp = this.createClassComps && this.createClassComps[ id ];
					if ( comp ) fn.call( comp );
				} );

			}

			fn = fn || factory;

			return this.each( function () {
				each( this.createClassComps || {}, fn );
			} );

		},

		newIntent: function ( items, factory, env ) {

			var container = this[ 0 ];
			if ( !container ) return;
			var children = container.children;
			var map = container.createClassMap = container.createClassMap || {};
			var identify = factory.identify;
			var index = 0;

			var comps = items.map( function ( item ) {

				var key = identify ? identify( item ) : index + 1;
				if ( !key ) throw new Error( 'Invalid key in loop' );
				var comp = map[ key ];

				if ( comp ) {
					comp._sort = Math.abs( index - comp._index );
					comp.set( item );
				} else {
					comp = factory.createComponent( env, item );
					map[ key ] = comp;
					comp._sort = -index;
				}

				comp._index = index;
				comp.el.createClassKeep = true;
				comp.el.createClassKey = key;

				++index;

				return comp;

			} );

			index = 0;
			while ( index < children.length ) {

				var child = children[ index ];

				if ( !child.createClassKeep ) {
					$( child ).unmountComponent();
					container.removeChild( child );
					if ( child.createClassKey ) delete map[ child.createClassKey ];
				} else {
					++index;
				}

			}

			comps.slice( 0 ).sort( function ( a, b ) {

				return b._sort - a._sort || b._index - a._index;

			} ).forEach( function ( comp ) {
				var el = comp.el;
				var other = children[ comp._index ];

				if ( !other ) {
					container.appendChild( el );
				} else if ( el !== other ) {
					container.insertBefore( el, other );
				}

				el.createClassKeep = false;

			} );

			return comps;

		},

		nest: function ( item, factory, env ) {

			if ( item ) return this.newIntent( [ item ], factory, env )[ 0 ];
			this.newIntent( [], factory, env );

		},

		componentClass: function ( classes ) {

			return this.each( function () {

				var el = this, component = $( el );

				each( classes, function ( name, condition ) {
					component.toggleClass( name, !!funcValue( condition, el ) );
				} );

			} );

		},

		mergeComponent: function ( data, selectors ) {

			if ( data === null || data === undefined ) data = '';

			if ( typeof data !== 'object' ) {

				return this.each( function () {

					var value = funcValue( data, this ) + '';

					switch ( this.tagName ) {
					case 'INPUT':
					case 'TEXTAREA':
					case 'SELECT':
						break;

					case 'IMG':
						if ( this.src !== value ) this.src = value;
						break;

					default:
						if ( this.createClassHTML !== value ) {
							this.innerHTML = this.createClassHTML = value;
						}
					}

				} );

			}

			selectors = selectors || {};
			var $set = this;

			each( data, function ( name, value ) {
				var selector = selectors[ name ] || ( '.' + name );
				$set.find( selector ).weld( value );
			} );

			return this;

		},

		values: function ( data, defaults ) {

			function parse( name ) {
				return name.replace( /\]/g, '' ).split( /\[/g );
			}

			function tryInt( name ) {
				return name.match( /^\d+$/ ) ? parseInt( name, 10 ) : name;
			}

			var $controls = this.filter( '[name]' ).add( this.find( '[name]' ) );
			if ( data === undefined ) {

				data = {};
				$controls.serializeArray().forEach( function ( entry ) {

					var path = parse( entry.name );
					var name = path[ 0 ];
					var current = data;

					for ( var i = 0, l = path.length - 1; i < l; ++i ) {
						var part = path[ i ];
						name = path[ i + 1 ];
						var container = name.match( /^\d*$/ ) ? [] : {};
						current = current[ part ] = current[ part ] || container;
					}

					if ( name === '' ) {
						current.push( entry.value );
					} else {
						current[ tryInt( name ) ] = entry.value;
					}

				} );

				return data;

			}
			var valueProp = 'value';
			var checkedProp = 'checked';
			var selectedProp = 'selected';

			if ( defaults ) {
				valueProp = 'defaultValue';
				checkedProp = 'defaultChecked';
				selectedProp = 'defaultSelected';
			}

			$controls.each( function () {

				var value = data;
				parse( this.name ).forEach( function ( part ) {
					if ( value && part !== '' ) value = value[ tryInt( part ) ];
				} );

				var $control = $( this );
				var tagName = this.tagName;
				var type = tagName === 'INPUT' ? this.type : tagName;

				if ( value === undefined || value === null ) value = '';

				switch ( type ) {
				case 'SELECT':
					var multiple = this.multiple && isArray( value );

					$control.children().each( function () {
						this[ selectedProp ] = multiple ?
							value.indexOf( this.getAttribute( 'value' ) ) >= 0 :
							value == this.getAttribute( 'value' );
					} );

					break;

				case 'TEXTAREA':
					value += '';
					if ( this[ valueProp ] !== value ) this[ valueProp ] = value;
					if ( defaults ) $control.weld( value ); // Support: IE
					break;

				case 'radio':
					this[ checkedProp ] = value == this.getAttribute( 'value' );
					break;

				case 'checkbox':
					this[ checkedProp ] = isArray( value ) ?
						value.indexOf( this.getAttribute( 'value' ) ) >= 0 :
						!!value;
					break;

				case 'button':
				case 'file':
				case 'image':
				case 'reset':
				case 'submit':
					break;

				default:
					value += '';
					if ( this[ valueProp ] !== value ) this[ valueProp ] = value;
				}

			} );

			return this;

		},

		reset: function () {

			this.each( function () {

				switch ( this.tagName ) {
				case 'FORM':
					this.reset();
					break;

				case 'INPUT':
					if ( this.type === 'checkbox' || this.type === 'radio' ) {
						this.checked = this.defaultChecked;
					} else {
						this.value = this.defaultValue;
					}

					break;

				case 'TEXTAREA':
					this.value = this.defaultValue;
					break;

				case 'OPTION':
					this.selected = this.defaultSelected;
					break;

				case 'SELECT':
					$( this ).children().reset();
					break;
				}

			} );

			return this;

		},

		deliver: function ( html ) {

			this.comps( function () {
				var id = this.factory.id;
				if ( typeof id === 'string' ) {
					this.component.attr( deliverAttr + id, JSON.stringify( this.data ) );
				}
			} );
			return html ? $( '<div></div>' ).append( this[ 0 ] ).html() : this;

		}

	} );

	var deliverAttr = 'data-createClass-';

	function funcValue( value, context ) {
		return typeof value === 'function' ? value.call( context ) : value;
	}

	return $;

} );
