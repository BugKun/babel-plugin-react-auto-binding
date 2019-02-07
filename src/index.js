function hasThis(path) {
    let existence = false;

    path.traverse({
        ThisExpression(path) {
            existence = true; 
            path.stop();
        }
    });

    return existence;
}

function isReactClass(path) {
    const superClass = path.node.superClass;
    if (superClass) {
        if (superClass.name === 'Component' || superClass.name === 'PureComponent') {
            return true
        } else if (superClass.object && superClass.object.name === 'React') {
            if (superClass.property && (superClass.property.name === 'Component' || superClass.property.name === 'PureComponent')) {
                return true
            }
        }
    }
    return false
}


module.exports = ({
    types: babelTypes,
    template
}) => {
    const superTemplate = template(`super(props);`)();

    return {
        visitor: {
            ClassDeclaration(path) {
                if (!isReactClass(path)) return;

                const funcList = path.get('body.body'),
                    {
                        ClassMethod,
                        BlockStatement,
                        Identifier,
                    } = babelTypes;

                let bindList = [],
                    constructorIndex = undefined;

                for (let i = 0; i < funcList.length; i++) {
                    const item = funcList[i],
                        itemNode = item.node;

                    if (item.isClassMethod()) {
                        if (itemNode.kind === 'method') {
                            const funcName = itemNode.key.name;
                            if (hasThis(item) && funcName !== 'render')
                                bindList.push(
                                    template(`this.${funcName} = this.${funcName}.bind(this)`)()
                                );
                        }
                        if (itemNode.kind === 'constructor') {
                            constructorIndex = i;
                        }
                    }
                }

                if (bindList.length > 0) {
                    if (constructorIndex > -1) {
                        funcList[constructorIndex]
                            .get('body')
                            .pushContainer(
                                'body',
                                bindList
                            )
                    } else {
                        path.get('body').pushContainer(
                            'body',
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
