/*
 * markup.js - a Markup Parser written in JavaScript
 *
 * author:    Eric Br�chemier <codequarterly@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   2010-10-15
 */
(function(window,document,undefined){

  // Function: element(name,[attributes,childNodes...]): DOM Element
  // Create a new element with given name, attributes and children.
  //
  // params:
  //   name - (string) (!nil) name of the new element to be created
  //   attributes - (object) (!nil) name/value pairs of attributes
  //                for the new element
  //   ... - (list of DOM elements and/or strings) (optional) 
  //         remaining args are added as children elements and text nodes
  //
  // Example:
  //   element('ul',{},
  //     element('li',{},
  //       element('a',{href:"#first"},"first link")
  //     ),
  //     element('li',{},
  //       element('a',{href:"#second"},"second link")
  //     ),
  //     element('li',{},
  //       element('a',{href:"#third"},"third link")
  //     )
  //   );
  //
  // Warnings: in IE
  //   - attributes in uppercase can prevent new object from loading
  //     properly in IE: 'SRC' for IFrame is not converted to 'src'
  //     using this method. The lowercase version should be specified
  //     in calls to this method. A later version of the code may also 
  //     convert received values in lowercase just in case.
  //
  //   - setting the 'class' attribute does not update the className
  //     property as expected. A later version of this code might set
  //     the className property directly when the attribute name is 'class'.
  //
  //   - setting the 'style' attribute does not work either. A later version
  //     of this code might set the style property directly.
  //
  //   - some elements cannot be added as child of others, e.g.
  //     'embed' as child of 'object'. They are silently ignored here.
  function element(name,attributes) {
     
    var parent = document.createElement(name);
    if (!attributes) {
      return parent;
    }
     
    for (var attribute in attributes) {
      if ( attributes.hasOwnProperty(attribute) ) {
        parent.setAttribute( attribute, attributes[attribute] );
      }
    }
    
    if (parent.canHaveChildren===false) {
      // avoid error in IE: children forbidden
      return parent;
    }
     
    for (var i=2; i<arguments.length; i++) {
      var child = arguments[i];
      if (typeof child === 'string') {
        child = document.createTextNode(child);
      }
      parent.appendChild( child );
    }
    return parent;
  }

  // Function: parse(input): DOM element
  // Parse markup input and generate parsed markup (XHTML).
  //
  // The abstract syntax tree generated by this parser is the direct mapping
  // to XHTML described in the specification, with the root body replaced with
  // a div with class 'body' to allow its insertion as part of an existing
  // XHTML document for preview.
  //
  // Parameter:
  //   input - string, the markup source text
  //
  // Returns:
  //   DOM Element, the abstract syntax tree, in XHTML format
  function parse(input){
    return element('div',{className:'body'},"FIXED");
  }

  // Public API
  window.markup = {
    parse: parse
  };

}(window,document));