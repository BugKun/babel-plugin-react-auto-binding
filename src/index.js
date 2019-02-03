function hasThis(node) {
    if(node && typeof node === 'object') {
        if(node.type === 'ThisExpression') {
            return true;
        }else {
            let has = false;
            for(let i in node) {
                has = hasThis(node[i]);
                if(has) {
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


module.exports = ({ types: babelTypes, template }) => ({
    visitor: {
        ClassDeclaration(path) {
            if(!isReactClass(path)) return;
            const func = path.node.body.body,
                {
                    ClassMethod,
                    BlockStatement,
                    Identifier,
                } = babelTypes;
            let bind = [], constructorIndex = undefined;
            for(let i = 0; i < func.length; i++) {
                if(func[i].type === 'ClassMethod') {
                    if(func[i].kind === 'method') {
                        const funcName = func[i].key.name;
                        if(hasThis(func[i]) && funcName !== 'render')
                            bind.push(template(`this.${funcName} = this.${funcName}.bind(this)`)());
                    }
                    if(func[i].kind === 'constructor') {
                        constructorIndex = i;
                    }
                }
            }

            if(bind.length > 0 ) {
                if(constructorIndex > -1) {
                    func[constructorIndex].body.body.push(...bind)
                }else {
                    func.push(
                        ClassMethod(
                            'constructor',
                            Identifier('constructor'),
                            [Identifier('props')],
                            BlockStatement([
                                template(`super(props);`)(),
                                ...bind
                            ])
                        )
                    )
                }
            }
        }
    }
});
