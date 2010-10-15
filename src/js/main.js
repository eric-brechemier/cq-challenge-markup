/*
 * main.js - main script for the Markup Parser using a simple XHTML front-end
 *
 * author:    Eric Bréchemier <codequarterly@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   2010-10-15
 */
(function(window,document,undefined){

  // Function: $(id): DOM element
  // An alias for document.getElementById().
  //
  // Parameter:
  //   id - string, the identifier of a DOM element
  //
  // Returns:
  //   object, the corresponding DOM element, or null if not found
  function $(id){
    return document.getElementById(id);
  };

  // Set the handler on Parse button
  $('parse').onclick = function(){
    $('output').innerHTML = markup.parse( $('input').value ); 
  };

}(window,document));
