<template>
	<div class="stage-track-wrap">
		<div class="wrap-header" ref="wrap-header">
			<table class="wrap-table">
				<thead class="wrap-table-header">
					<tr class="wrap-table-header-row">
						<th :class="{
							'wrap-table-header-cell': true,
							'wrap-table-header-cell-full':  stageList.length < 4
						}"></th>
						<th
							v-for="(header, index) in stageList"
							:key="index"
							:class="{
								'wrap-table-header-cell': true,
								'wrap-table-header-cell-full':  stageList.length < 4
							}"
						>{{ header }}</th>
					</tr>
				</thead>
			</table>
		</div>

		<!-- 固定侧边 -->
		<div class="wrap-side">
			<div class="wrap-side-header">
				<table class="wrap-table">
					<thead class="wrap-table-header">
						<tr class="wrap-table-header-row">
							<th :class="{
								'wrap-table-header-cell': true,
								'wrap-side-cell-one': stageList.length === 1,
								'wrap-side-cell-two': stageList.length === 2,
								'wrap-side-cell-three': stageList.length === 3
							}">&nbsp;</th>
						</tr>
					</thead>
				</table>
			</div>
			<div class="wrap-side-body" ref="wrap-side" v-if="versionList.length !== 0">
				<table class="wrap-table">
					<tbody class="wrap-table-body">
						<tr	
							v-for="(trace, index) in wrapDataList"
							:key="index"
							class="wrap-table-body-row"
						>
							<td :class="{
								'wrap-table-body-cell': true,
								'wrap-side-cell-one': stageList.length === 1,
								'wrap-side-cell-two': stageList.length === 2,
								'wrap-side-cell-three': stageList.length === 3
							}">
								<!-- {{ versionList.find(version => version.id === trace.version).semver }} -->
								{{ trace.version }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- 内容 -->
		<div 
			class="wrap-body" 
			ref="wrap-body"
			@mousedown="wrapBodyDragBegin($event)"
			@mouseup="wrapBodyDragOver"
			@mouseleave="wrapBodyDragOver"
		>
			<table class="wrap-table">
				<tbody class="wrap-table-body">
					<tr
						v-for="(stage, index) in wrapDataList"
						:key="index" 
						class="wrap-table-body-row"
					>
						<td :class="{
							'wrap-table-body-cell': true,
							'wrap-table-body-cell-full': stageList.length < 4,
						}">{{ stage.version }}</td>
						<td
							v-for="(trace, stageIndex) in stage.traceList" 
							:key="trace.hash+stageIndex"
							:class="{
								'wrap-table-body-cell': true,
								'wrap-cell-hover': true,
								'wrap-table-body-cell-full': stageList.length < 4,
								'own-trace': trace.hash !== '',
								'trace-active': trace.hash === active.traceActive && trace.hash !== ''
							}"
							@click="setTraceActive(trace.hash, 'wrap')"
							@contextmenu.prevent="showPopover(trace.hash)"
							:id="`wrap-body-cell-${trace.hash}`"
						>
							<b-popover
								v-if="trace.hash !== ''"
								:ref="`popover-${trace.hash}`" :target="`wrap-body-cell-${trace.hash}`" 
								title="详情:" disabled
							>
								<b-form-textarea
									rows="5" no-resize size="sm"
									readonly class="mb-2"
									:value="trace.abstract"
								></b-form-textarea>
								<b-button
									block
									size="sm"
									variant="primary"
									@click="showEvolutionModal(trace.hash)"
								><i
									class="fas fa-plus mr-2"
								/>演进</b-button>
							</b-popover>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<b-modal ref="evolution-modal" hide-footer scrollable title="演进">
			<TraceEvolution
				:traceList="traceList"
				:traceActive="traceActive"
				:flowSelected="flowSelected"
				:versionSelector="versionSelector"
				:promoted="tracePromoted"
				:evolutionStageSelector="evolutionStageSelector"
				@queryTraceList="queryTraceList"
			></TraceEvolution>
		</b-modal>
	</div>
</template>

<script>
import TraceEvolution from './TraceEvolution';

export default {
	model: {
		prop: 'active',
		event: 'change'
	},
	props: {
		traceList: Array,
		flowList: Array,
		flowSelected: String,
		versionSelector: Array,
		trackStageList: Array,
		traceData: Array,
		stageList: Array,
		versionList: Array,
		active: Object,
	},
	components: {
		TraceEvolution
	},
	data() {
		return {
			wrapDataList: [],
			mousePosition: {},
			traceActive: null,
			evolutionStageSelector: [],
			tracePromoted: true
		};
	},
	watch: {
		traceData() {
			this.getDataList();
		},
		versionList() {
			this.wrapDataSort();
		},
		'active.traceActive'(val) {
			if (this.active.traceChanger === 'tree') {
				const trace = this.traceData.find(ele => {
					return ele.hash === val;
				});

				const wrapRow = this.wrapDataList.findIndex(data => {
					return data.version === trace.version;
				});

				const wrapCol = this.stageList.findIndex(stage => {
					return stage === trace.stage;
				});

				this.$refs['wrap-body'].scrollTop = 29 * (wrapRow - 2);
				this.$refs['wrap-body'].scrollLeft = 120 * (wrapCol - 1) - 75;
			}
			this.syncWrapHeaderAndSide();
		}
	},
	mounted() {
		this.getDataList();
	},
	methods: {
		wrapBodyDragBegin(event) {
			window.addEventListener('mousemove', this.onDrag);
			this.mousePosition['x'] = event.pageX;
			this.mousePosition['y'] = event.pageY;
		},
		wrapBodyDragOver() {
			window.removeEventListener('mousemove', this.onDrag);
			this.mousePosition = {};
		},
		onDrag(event) {
			this.$refs['wrap-body'].scrollLeft = this.$refs['wrap-body'].scrollLeft + (this.mousePosition['x'] - event.pageX);
			this.$refs['wrap-body'].scrollTop = this.$refs['wrap-body'].scrollTop + (this.mousePosition['y'] - event.pageY);
			this.syncWrapHeaderAndSide();
			this.mousePosition['x'] = event.pageX;
			this.mousePosition['y'] = event.pageY;
		},
		syncWrapHeaderAndSide() {
			this.$refs['wrap-header'].scrollLeft = this.$refs['wrap-body'].scrollLeft;
			this.$refs['wrap-side'].scrollTop = this.$refs['wrap-body'].scrollTop;
		},
		getDataList() {
			this.wrapDataList = [];
			
			this.traceData.forEach(trace => {
				const stageVersionIndex = this.wrapDataList.findIndex(wrapTrace => {
					return wrapTrace.version === trace.version;
				});
				
				if (stageVersionIndex !== -1) {
					const traceRow = this.wrapDataList[stageVersionIndex].traceList[
						this.stageList.findIndex(wrapStage => {
							return wrapStage === trace.stage;
						})
					];
					traceRow.hash = trace.hash;
					traceRow.abstract = trace.abstract;
				} else {
					this.wrapDataList.push({
						version: trace.version,
						traceList: this.stageList.map(stage => {
							if (stage === trace.stage) {
								return {
									hash: trace.hash,
									abstract: trace.abstract,
									stage: stage
								};
							} else {
								return {
									hash: '',
									abstract: trace.abstract,
									stage: stage
								};
							}
						})
					});
				}
			});

			if (this.versionList.length !== 0) {
				this.wrapDataSort();
			}
		},
		wrapDataSort() {
			this.wrapDataList.map(wrap => {
				const version = this.versionList.find(version => version.id === wrap.version);

				if (version !== undefined) {
					wrap.version = version.semver;
				}
			});

			this.wrapDataList.sort((wrapA, wrapB) => {
				return wrapB.version.replace(/\./g, '') - wrapA.version.replace(/\./g, '');
			});
		},
		setTraceActive(hash, name) {
			if (hash !== '') {
				this.$emit('change', {
					traceActive: hash,
					traceChanger: name
				});
			}
		},
		showEvolutionModal(traceId) {
			this.traceActive = traceId;
			const activeTrace = this.traceList.find(trace => trace.id === traceId);
			const selectedFlow = this.flowList.find(flow => flow.id === this.flowSelected);

			this.evolutionStageSelector = selectedFlow.evolution[activeTrace.stageId]
				.map((evo, index) => {
					if (evo) {
						return {
							value: index,
							text: this.trackStageList[index]
						};
					} else {
						return null;
					}
				}).filter(evo => evo !== null);
			this.$refs[`popover-${traceId}`][0].doClose();
			this.tracePromoted = selectedFlow.stageList[activeTrace.stageId].promoted;

			this.$refs['evolution-modal'].show();
		},
		queryTraceList() {
			this.$refs['evolution-modal'].hide();
			this.$emit('queryTraceList');
		},
		showPopover(id) {
			if (id) {
				this.wrapDataList.forEach(data => {
					data.traceList.forEach(trace => {
						if (trace.hash.length !== 0) {
							this.$refs[`popover-${trace.hash}`][0].doClose();
						}
					});
				});
				const ref = this.$refs[`popover-${id}`][0];
				ref.localShow ? ref.doClose() : ref.doOpen();
			}
		}
	},
};
</script>
