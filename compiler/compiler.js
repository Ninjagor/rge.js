export function compile(ast) {
    let code = ``;
    for (let i = 0; i < ast.body.length; i++) {
        let current = ast.body[i];
        if (current.type == "PrintStatement") {
            if (current.value.type == "Identifier") {
                code += `console.log(${current.value.name});`
            } else {
                code += `console.log("${current.value.value}");`
            }
        } else if (current.type == "AssignmentStatement") {
            if (current.Value.type == "Identifier") {
                code += `var ${current.Identifier} = ${current.Value.value ? current.Value.value : current.Value.name};`
            } else {
                code += `var ${current.Identifier} = ${JSON.stringify(current.Value.value ? current.Value.value : current.Value.name)};`
            }
        } else if (current.type == "ReassignmentStatement") {
            if (current.Value.type == "Identifier") {
                code += `${current.Identifier} = ${current.Value.value ? current.Value.value : current.Value.name};`
            } else {
                code += `${current.Identifier} = ${JSON.stringify(current.Value.value ? current.Value.value : current.Value.name)};`
            }
        } else if (current.type == "FunctionDeclaration") {
            code += `function ${current.name.name}() {`
            const compiled_function_code = compile({
                type: 'Program',
                body: current.body
            });
            code += compiled_function_code;
            code += `}`
        } else if (current.type == "JavaScriptStatement") {
            code += `${current.code} \n`
        } else if (current.type == "FunctionCall") {
            code += `${current.name.name}();`
        }
    }
    return code;
}

export function evalBytecode(code) {
    eval(code);
}