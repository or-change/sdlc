<template>
	<div 
		class="stage-track-tree"
		ref="tree-body"
	>
		<table class="tree-table">
			<thead class="tree-table-header">
				<tr class="tree-table-header-row">
					<th class="tree-table-header-cell">树状图</th>
					<th class="tree-table-header-cell">流程</th>
					<th class="tree-table-header-cell">阶段</th>
					<th class="tree-table-header-cell">版本</th>
					<!-- <th class="tree-table-header-cell">信息</th> -->
					<th class="tree-table-header-cell">开始日期</th>
				</tr>
			</thead>
			<tbody class="tree-table-body">
				<tr
					v-for="(data, index) in treeDataList"
					:key="index" 
					:class="{
						'tree-table-body-row': true,
						'trace-active': data.hash === active
					}"
					@click="setTraceActive(data.hash, 'tree')"
				>
					<td class="tree-table-body-cell">
						<div 
							v-for="(grid, index) in data.gridList"
							:key="index"
							class="tree-body-cell-node"
						>
							<div :class="{
								'tree-point': grid.point
							}"></div>
							<div :class="{
								'tree-up': grid.up
							}"></div>
							<div :class="{
								'tree-right': grid.right
							}"></div>
							<div :class="{
								'tree-down': grid.down
							}"></div>
							<div :class="{
								'tree-left': grid.left
							}"></div>
							<div :class="{
								'tree-turn': grid.turn
							}"></div>
						</div>
					</td>
					<td class="tree-table-body-cell">{{ data.flow }}</td>
					<td class="tree-table-body-cell">{{ data.stage }}</td>
					<td class="tree-table-body-cell">{{ data.version }}</td>
					<!-- <td class="tree-table-body-cell">{{ data.message }}</td> -->
					<td class="tree-table-body-cell">{{ data.date | dateFormat }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	props: {
		traceData: Array,
		active: String,
		traceChanger: String
	},
	data() {
		return {
			treeDataList: []
		};
	},
	watch: {
		active(val) {
			if (this.traceChanger === 'wrap') {
				const treeRow = this.treeDataList.findIndex(ele => {
					return ele.hash === val;
				});

				this.$refs['tree-body'].scrollTop = 44 * (treeRow - 2);
			}
		},
		traceData() {
			this.getDataList();
		}
	},
	mounted() {
		this.getDataList();
	},
	methods: {
		setTraceActive(hash, name) {
			if (hash !== '') {
				this.$emit('update:active', hash);
				this.$emit('update:traceChanger', name);
			}
		},
		getDataList() {
			let clone = this.traceData.slice(0);
			let depth = 0;
			let gridList = [];

			clone.sort(function(a, b) {
				return Date.parse(b.date) - Date.parse(a.date);
			});

			clone.forEach(trace => {
				if (trace.depth === undefined) {
					trace['depth'] = depth++;
					clone = this.setParentDepth(clone, trace.parent, trace.depth);
				}
			});

			clone.forEach(trace => {
				depth = trace.depth > depth ? trace.depth : depth;
			});

			for (let i = 0; i <= depth; i++) {
				gridList.push({});
			}
			// 绘制格及点
			this.treeDataList = clone.map(trace => {
				return {
					hash: trace.hash,
					gridList: gridList.map((grid, index) => {
						return grid = {
							point: index === trace.depth,
							up: false,
							right: false,
							down: false,
							left: false,
							turn: false
						};
					}),
					stage: trace.stage,
					version: trace.version,
					message: trace.message,
					date: trace.date,
					flow: trace.flow,
				};
			});
			// 绘制线
			clone.forEach((data, index) => {
				if (data.parent !== null) {
					const parent = this.getParentByHash(clone, data.parent);
					
					// 纵向
					for (let i = index; i <= parent.index; i++) {
						if (i === index) {
							this.treeDataList[i].gridList[data.depth].down = true;
						} else if (i === parent.index) {
							if (data.depth === parent.depth) {
								this.treeDataList[i].gridList[data.depth].up = true;							
							}
						} else {
							this.treeDataList[i].gridList[data.depth].down = true;
							this.treeDataList[i].gridList[data.depth].up = true;							
						}
					}

					// 横向
					if (data.depth !== parent.depth) {
						for (let i = parent.depth; i <= data.depth; i++) {
							if (i === parent.depth) {
								this.treeDataList[parent.index].gridList[i].right = true;
							} else if (i === data.depth) {
								// this.treeDataList[parent.index].gridList[i].left = true;
								this.treeDataList[parent.index].gridList[i].turn = true;
							} else {
								this.treeDataList[parent.index].gridList[i].right = true;
								this.treeDataList[parent.index].gridList[i].left = true;
							}
						}
					}
				}
			});
		},
		setParentDepth(data, parentHash, depth) {
			data.forEach(trace => {
				if (trace.hash === parentHash) {
					if (trace.depth === undefined) {
						trace['depth'] = depth;
						if (trace.parent !== null) {
							this.setParentDepth(data, trace.parent, depth);
						}
					}
				}
			});
			return data;
		},
		getParentByHash(data, parentHash) {
			let parent;
			data.forEach((trace, index) => {
				if (trace.hash === parentHash) {
					parent = {
						depth: trace.depth,
						index: index
					};
				}
			});
			return parent;
		},
	}
};
</script>

<style>

</style>
