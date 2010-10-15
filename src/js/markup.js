/*
 * markup.js - a Markup Parser written in JavaScript
 *
 * author:    Eric Bréchemier <codequarterly@eric.brechemier.name>
 * license:   Creative Commons Attribution 3.0 Unported
 *            http://creativecommons.org/licenses/by/3.0/
 * version:   2010-10-15
 */
(function(window,document,undefined){

  var EOL = ["\u000D\u000A","\u000D","\u000A"],
      TAB = ["\u0009","        "];


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
      if (child) {
        parent.appendChild( child );
      }
    }
    return parent;
  }

  // Function: applyTemplates(templates, input, start, end)
  // The simple template engine used for parsing.
  //
  // Each rule function is applied in turn, until one returns true (match).
  // As a consequence, the position of each rule in the list corresponds to its
  // relative priority (highest first).
  //
  // Parameters:
  //   templates - array of functions, the set of template rules to apply
  //   input - string, the source text
  //   start - index, 0-based, the start index of input to consider, included
  //   end - index, 0-based, the end index of input to consider, excluded
  //   output - DOM Element, parent for the insertion of generated elements
  //
  // Returns:
  //   boolean: true if a rule matched, false otherwise.
  function applyTemplates(templates, input, start, end, output){
    
    var i, length, out;

    for (i=0, length=templates.length; i<length; i++){
      if ( templates[i](templates, input, start, end, output) ){
        return true;
      }
    }
    return false;
  }

  function blankLine(templates, input, start, end, output) {

    var i, length, nextEol;

    for (i=0, length=EOL.length; i<length; i++){
      nextEol = input.indexOf(EOL[i]);
      if (nextEol){
        // TODO: replace eol with space
        return true;
      }
    }
    return false;
  }

  function paragraph(templates, input, start, end, output) {
    
    var p = element("p",{});
    output.appendChild(p);
    applyTemplates([text], input, start, end, p);
    return true;
  }

  function lineBreak(templates, input, start, end, output) {

    var i, length, nextEol;

    for (i=0, length=EOL.length; i<length; i++){
      nextEol = input.indexOf(EOL[i]);
      if (nextEol){
        // TODO: replace eol with space
        return true;
      }
    }
    return false;
  }

  function text(templates, input, start, end, output) {
    
    output.appendChild(
      document.createTextNode( input.slice(start,end) )
    );
    return true;
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

    // The parser is designed as a template engine: a set of rules are defined
    // as functions which take an input string and start/end index and an output
    // which is a parent DOM element for insertion of generated elements.
    //
    // This parsing follows a recursive descent approach, and the call stack
    // during executing will reflect the hierarchy of the generated abstract
    // parse tree.

    var templates = [paragraph, text],
        body = element('div',{className:'body'});

    applyTemplates(
      templates,
      input, 0, input.length,
      body
    );
    return body;
  }

  // Public API
  window.markup = {
    parse: parse
  };

}(window,document));
