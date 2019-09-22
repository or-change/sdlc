# sdlc

## How to use

```
const { server, webpack } = new SDLC(options);
```

## options
```
{
	store: { type: 'object' },
	server: {
		type: 'object',
		properties: {
			authenticate: { type: 'function' },
			session: { type: 'object' }
		}
	},
	plugins: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				id: { type: 'string' },
				name: { type: 'string' },
				description: { type: 'string' },
				install: { type: 'function' }
			}
		}
	},
	log: {
		type: 'object',
		properties: {
			access: {
				label: '',
				preventLevels: {
					type: 'array'
				}
				file: {
					type: 'object',
					properties: {
						pathname: { type: 'string' },
						size: { type: 'number' },
						number: { type: 'number' }
					}
				}
			},
			model: {
				label: '',
				preventLevels: {
					type: 'array'
				}
				file: {
					type: 'object',
					properties: {
						pathname: { type: 'string' },
						size: { type: 'number' },
						number: { type: 'number' }
					}
				}
			},
			authentication: {
				label: '',
				preventLevels: {
					type: 'array'
				}
				file: {
					type: 'object',
					properties: {
						pathname: { type: 'string' },
						size: { type: 'number' },
						number: { type: 'number' }
					}
				}
			},
			exception: {
				label: '',
				preventLevels: {
					type: 'array'
				}
				file: {
					type: 'object',
					properties: {
						pathname: { type: 'string' },
						size: { type: 'number' },
						number: { type: 'number' }
					}
				}
			}
		}
	},
	app: {
		extend: {
			type: string
		}
	}
}
```

## plugins

### install(pluginId, pluginFactory)
pluginId should be registered;

pluginFactory Function
argument object
{
	Function appendRoutes(routes Array),
	Function addNavItem({
		*path String, *lable: { main String, sub String }
	}),
	Function addAccountItem({
		*path String, *lable: { main String, sub String }, *component
	}),
	Function addAdminItem({
		*path String, *lable: { main String, sub String }, *component
	}),
	Function addTopicItem({
		*id String, *path String, *lable: { main String, sub String }, *component,
		extend Function(argument Function),
		target: {
			id String, pluginId String, install Function
		}
	})
}
### compile

## Assemble

Provide a Function

argument Object

{
	Function appendRoutes(routes Array),
	Function setAuthenticationPage(component Object),
	Function setFooter(component Object),
	Function setHome(path string),
	Function getItems(type [nav, account, admin]),
	Function getTopics(type [nav, account, admin]),
	Function setOrder(order Array),
}

阶段：

src:
可以扩展模型层，插件管理器添加接口，给addModel；
事件注册表
exceptionLog 是否抛，判断环境

app:
默认的数据作为插件角色；
label必须是i18n key;
extend i18n;
所有都给 id, pluginId
给组装层plugin扩展实例；
改变normalize
topics add ownerOnly