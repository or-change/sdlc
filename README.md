# sdlc

plugins:

basicCredential: 实现用户名密码credential(authenticate)
git: 拉取项目最新版clone
poster: 用户定义如何响应系统消息（系统状态的变化）
register: 用户自主注册(credential) 不确定，组装层选择配合的credential
jila: 问题追踪（交互信息）

plugin manage:

<!-- 1> product emiter 路由的日志（插件使用）--   模型层 抛事件 路由 抛事件（选择哪些） 是否可以扩展？？（内部日志插件，外部product事件） poster \/ 部分 -->
<!-- 2> 路由扩展																																																													\/ -->
<!-- 3> 前端扩展 (webpack数组)																																																						\/ -->
4> 扩展点类型，source（sourceService）其他插件使用 参数：options, 结果：blob (source.helper),
<!-- 5> injection扩展 -->
6> issuse ??

<!-- trace回滚（delete）add router for filter trace of project -->
<!-- session可配置 -->

project 多发行 管理（plugin）
				分支
后端：
flow update功能（更新flow的name, stage的name， plugin 和delete stage）
更改model stage的promoted,initializable提升，变成数组类型

<!-- private true -->
plugin 
后端和前端做映射（后端注册的时候同时提供前端插件信息）改进后端插件注册管理器行为


plugin: new injection extend old injection(改进)