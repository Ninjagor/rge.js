start = _ code:(statements / _) _ {
    return { 
      "type": "Program",
      "body": code
    };
}

statements = _ head:(js_statement / reassignment_statement / assignment_statement / if_statement / print_statement / expression_statement / function_declaration / function_call) _ tail:(!";" _ (js_statement / reassignment_statement / assignment_statement / if_statement / print_statement / expression_statement / function_declaration / function_call))* {
    return [head].concat(tail.map(function(element) {
        return element[2];
    })); 
}

expression_statement = expression:expression _ ";" {
    return  {
      "type": "ExpressionStatement",
      "expression": expression
    };
}

assignment_statement = "var" _ variable:name _ "=" _ expression:(expression) _ ";" {
    return {
        "type": "AssignmentStatement",
        "Identifier": variable,
        "Value": expression
    }
}

reassignment_statement = variable:name _ "=" _ expression:(expression) _ ";" {
    return {
        "type": "ReassignmentStatement",
        "Identifier": variable,
        "Value": expression
    }
}

js_statement = "js!" _ expression:string _  ";" {
	return {
    	"type": "JavaScriptStatement",
        "code": expression
    }
}

if_statement = "if" _ expression:(comparison / expression) _ "then" body:(statements / _) _ "end" {
   return {
     "type": "IfStatement",
     "test": expression,
     "consequent": {
        "type": "BlockStatement",
        "body": body
     },
     "alternate": null
   };
}

print_statement = "print" _ "(" _ expression:(expression / "") _")" _ ";" {
    return {
        "type": "PrintStatement",
        "value": expression
    }
}

function_declaration = "function" _ name:identifier _ "(" _ params:parameters_list _ ")" _ body:statements _ "end" _ ";" {
    return {
        "type": "FunctionDeclaration",
        "name": name,
        "parameters": params,
        "body": body
    }
}

function_call = name:identifier _ "(" _ args:arguments_list _ ")" _ ";" {
    return {
        "type": "FunctionCall",
        "name": name,
        "arguments": args
    }
}

parameters_list = head:(identifier / "") tail:(!"," _ identifier)* {
    return [head].concat(tail.map(function(element) {
        return element[2];
    }));
}

arguments_list = head:(expression / "") tail:(!"," _ expression)* {
    return [head].concat(tail.map(function(element) {
        return element[2];
    }));
}

expression = expression:(variable / literal / boolean / arithmetic) { return expression; }

literal = value:(string / integer / boolean) {
   return {"type": "Literal", "value": value };
}

boolean 
  = "True" { return true; }
    / "False" { return false; }

variable = !keywords variable:name {
  return {
    "type": "Identifier",
    "name": variable
  }
}

identifier = !keywords name:name {
    return {
        "type": "Identifier",
        "name": name
    }
}

keywords = "var" / "if" / "then" / "end" / "print" / "function"

name = [A-Z_$a-z][A-Z_a-z0-9]* { return text(); }

comparison = _ left:expression _ "==" _ right:expression _ {
   return {
        "type": "BinaryExpression",
        "operator": "==",
        "left": left,
        "right": right
   };
}

string = "\"" ([^"] / "\\\\\"")*  "\"" {
  return JSON.parse(text());
}

arithmetic
  = head:term tail:(_ ("+" / "-") _ term)* {
      return tail.reduce(function(result, element) {
          return {
            "type": "BinaryExpression",
            "operator": element[1],
            "left": result,
            "right": element[3]
          };
      }, head);
    }

term
  = head:factor tail:(_ ("*" / "/") _ factor)* {
      return tail.reduce(function(result, element) {
          return {
            "type": "BinaryExpression",
            "operator": element[1],
            "left": result,
            "right": element[3]
          };
      }, head);
    }

factor
  = "(" _ expr:arithmetic _ ")" { return expr; }
  / literal

integer "integer"
  = _ [0-9]+ { return parseInt(text(), 10); }


_ "whitespace"
  = [ \t\n\r]* {
   return [];
}