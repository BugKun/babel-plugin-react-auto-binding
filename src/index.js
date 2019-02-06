function hasThis(node) {
    if(node && typeof node === 'object') {
        if(node.type === 'ThisExpression') {
            return true;
        }else {
            let existence = false;
            for(let i in node) {
                existence = hasThis(node[i]);
                if(existence) {
                    return true;
                }
            }
        }
    }else {
        return false;
    }
}

function isReactClass(path) {
    const superClass = path.node.superClass;
    if(superClass){
        if(superClass.name === 'Component' || superClass.name === 'PureComponent') {
            return true
        }else if(superClass.object && superClass.object.name === 'React') {
            if(superClass.property && (superClass.property.name === 'Component' || superClass.property.name === 'PureComponent')) {
                return true
            }
        }
        return false
    }
}


module.exports = ({ types: babelTypes, template }) => {
    const superTemplate = template(`super(props);`)();


    return {
        visitor: {
            ClassDeclaration(path) {
                if(!isReactClass(path)) return;
                const funcList = path.node.body.body,
                    {
                        ClassMethod,
                        BlockStatement,
                        Identifier,
                    } = babelTypes;
                let bindList = [], constructorIndex = undefined;
                for(let i = 0; i < funcList.length; i++) {
                    if(funcList[i].type === 'ClassMethod') {
                        if(funcList[i].kind === 'method') {
                            const funcName = funcList[i].key.name;
                            if(hasThis(funcList[i]) && funcName !== 'render')
                                bindList.push(template(`this.${funcName} = this.${funcName}.bind(this)`)());
                        }
                        if(funcList[i].kind === 'constructor') {
                            constructorIndex = i;
                        }
                    }
                }
    
                if(bindList.length > 0 ) {
                    if(constructorIndex > -1) {
                        funcList[constructorIndex].body.body.push(...bindList)
                    }else {
                        funcList.push(
                            ClassMethod(
                                'constructor',
                                Identifier('constructor'),
                                [
                                    Identifier('props')
                                ],
                                BlockStatement([
                                    superTemplate,
                                    ...bindList
                                ])
                            )
                        )
                    }
                }
            }
        }
    }
};
