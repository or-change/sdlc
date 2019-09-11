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
	}
}
```

## plugins

Register plugin to SDLC core, and you can extend route and webpack in plugin install function
(广度 扩展点确定，深度 前端扩展)

1.备好前端开发环境
2.确定插件，以及开始实验()
3.开始连接插件

