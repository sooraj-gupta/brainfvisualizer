var vm = new Vue({
	el: "#vueapp",
	data: {
		bfarray: [],
		arrsize: 2,
		cursor: 0,
	},
	methods: {
		onResize: function(){
			this.arrsize = parseInt( document.querySelector("#main-view").offsetWidth/40 );
		},
		setselected: function(){
			document.querySelector( "#bf-array td.selected" ).classList.remove( "selected" );
			document.getElementById( 'bf-array' ).children[0].children[ this.cursor ].classList.add('selected');
		},
		reset: function()
		{
			window.addEventListener('resize', this.onResize);
			for ( var i = 0; i < this.arrsize; i++ )
			{
				this.$set( this.bfarray, i, 0 );
			}
			this.cursor = 0;
			this.setselected();
		}
	},
	created: function()
	{
		window.addEventListener('resize', this.onResize);
		for ( var i = 0; i < this.arrsize; i++ )
		{
			this.bfarray.push( 0 );
		}
	},
	watch:{
		arrsize: function( newValue, oldValue ){	
			for ( var i = 0; i < this.newValue; i++ )
			{
				console.log( 0 );
			}
		}
	},
	computed: {
	},
	components:{
		"main-nav" : {
			props: ['title'],
			template: `
			<div id = 'main-nav'>
				<div>
					<h1>{{ title }}</h1>
				</div>
			</div>
			`
		},
		"main-view": {
			props:[],
			template:
			`<center><section id = "main-view"><slot></slot></section></center>`
		},
		
		
		"bf-array": {
			props: [ 'array','arrsize' ],
			mounted: function()
			{	
				document.getElementById( 'bf-array' ).children[0].children[0].classList.add('selected');
			},
			template: `
			<table id = 'bf-array'>
				<tr>
					<td v-for='a in arrsize'>{{ array[ a-1 ] }}</td>
				</tr>
				<tr>
					<td v-for='i in arrsize' :key ='i'>{{i-1}}</td>
				</tr>
			</table>
			`,
			watch: {
				arrsize: function( newValue, oldValue )
				{
					for( var i = 0; i < newValue; i++)
					{
						if( this.array[i] == undefined )
						{
							this.array[i] = 0;
						}
					}
				},
				array: function( newValue, oldValue ){
					
				}
			},
			methods: {
			}
		},
		"reg-button":{
			props:['function'],
			template:`
				<button class = 'reg-button'><slot></slot></button>
			`
		},
		
		"editor":{
			template: `
			<div id = "editor">
			</div>
			`
		},
		slider:{
			template:`
				<div class = 'slider'>
					<span><slot></slot></span><input type = 'range' min = '10' max = '1000' value = "100"/>
				</div>
			`
		},
		bfoutput:{
			template: `
				<div id = 'output'>
					<h3>Output:</h3>
					<div></div>
				</div>
			`
		}
		
	}
});

var code = ""
var i = 0;
var braces = [
];
var skip = false;
var found = true;
var running = false;
function readCode( code ){	
	
	if( !skip ){
		if( code.charAt(i) == '+')
		{
			vm.$set( vm.bfarray, vm.cursor, (vm.bfarray[ vm.cursor ] + 1 ) % 256 );
		}
		else if( code.charAt(i) == '>')
		{
			vm.cursor++
			if( vm.cursor >= vm.arrsize ) 
			{
				error("Memory Error " + vm.cursor )
				stop();
				return;
			}
			else vm.setselected();
		}
		else if( code.charAt(i) == '-')
		{
			vm.$set( vm.bfarray, vm.cursor, ( ( vm.bfarray[ vm.cursor ] - 1 ) >= 0 ?( vm.bfarray[ vm.cursor ] - 1 ) : 255 ) );
		}
		else if( code.charAt(i) == '<')
		{
			vm.cursor--
			if( vm.cursor < 0 ) 
			{
				error("Memory Error " + vm.cursor )
				stop();
				return;
			}
			else vm.setselected();
		}
		else if( code.charAt(i) == '.' )
		{
			document.querySelector( "#output div").innerHTML += String.fromCharCode(vm.bfarray[ vm.cursor ]);
		}
		else if( code.charAt(i) == '[' )
		{
			if( vm.bfarray[ vm.cursor ] != 0 )
			{
				braces.push(i);
			}
			else
				skip = true;
		}
		else
		{
			found = false;
		}
	}
	if ( code.charAt(i) == ']' && !found )
	{
		skip = false;
		console.log( vm.bfarray[ vm.cursor ] )
		if( vm.bfarray[ vm.cursor ] != 0 )
		{
			i = braces[ braces.length - 1];
		}
		else
		{
			braces.pop();
		}
	}
	else if ( !found ){
		i++;
		readCode( window.code );
		return;
	}
	i++;
	if( i == code.length || code.length == 0 ) stop();
	else
		setTimeout( () => { readCode( window.code )}, document.querySelector( "#delay" ).querySelector( "input").value );
}

function error( err )
{
	var el = document.querySelector( "#output div");
	el.innerHTML = err;
	el.classList.add( "error" );
}


document.querySelector( "#run" ).onclick = function(){
	code = editor.getValue();
	i = 0;
	vm.reset();
	this.disabled = true;
	document.querySelector( "#stop" ).disabled = false;
	document.querySelector( "#output div").innerHTML = "";
	document.querySelector( "#output div").classList.remove( 'error' );
	running = true;;
	setTimeout( () => { readCode( window.code )}, document.querySelector( "#delay" ).querySelector( "input").value );	
}

function stop()
{
	document.querySelector( "#run" ).disabled = false;
	document.querySelector( "#stop" ).disabled = true;	
	running = false;
}

document.querySelector( "#delay" ).onchange = function(){
	console.log( this.querySelector( "input").value );
}
document.querySelector( "#stop" ).onclick = function(){
	stop();
}

vm.onResize();