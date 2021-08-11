<template>
	<div class="content">
		<p>{{states[status].text}}</p>

		<div class="infos">
			<Button v-if="states[status].showDownloadBtn" iconClass="fas fa-download" small/>
			<i v-if="states[status].showSpinner" class="fas fa-spinner fa-pulse"></i>
			<p v-if="states[status].showBar" class="percent">{{Math.round(percent)}}%</p>
			<div class="close"  @click="closeUpdateWindow">
				<img src="@/assets/close.svg">
			</div>
		</div>
	</div>
</template>

<script>
import { computed, onBeforeMount, onUnmounted, ref } from 'vue'
import Button from '@/components/Button'

export default {
	components: { Button },
	setup() {
		const percent = ref(0)
		const text = ref('Looking for an update')
		const iconClass = ref('icon')
		const status = ref('fetching')
		const states = ref({
			fetching: {
				text: 'Looking for an update...',
				showSpinner: true,
				showBar: false,
				showDownloadBtn: false,
			},
			available: {
				text: 'New version found....',
				showSpinner: true,
				showBar: false,
				showDownloadBtn: false,
			},
			downloading: {
				text: 'Downloading the update...',
				showSpinner: false,
				showBar: true,
				showDownloadBtn: false,
			},
			downloaded: {
				text: 'Ready to be installed.',
				showSpinner: false,
				showBar: false,
				showDownloadBtn: true,
			},
			uptodate: {
				text: 'Already up to date.',
				showSpinner: false,
				showBar: false,
				showDownloadBtn: false,
			},
			error: {
				text: 'Unable to find an update.',
				showSpinner: false,
				showBar: false,
				showDownloadBtn: false,
			},
		})

		const closeUpdateWindow = () => {
			window.unlighter.execModuleMethod({module: 'updater', method: 'closeWindow'})
		}

		onBeforeMount(() => {
			window.unlighter.on('update-status', (e, updateData) => {
				percent.value = updateData.percent
				status.value = updateData.status
			})
		})

		onUnmounted(() => {
			window.unlighter.removeListener('update-status')
		})

		return { percent, text, iconClass, states, status, closeUpdateWindow }
	}
}
</script>

<style lang="sass">
.content
	display: flex
	justify-content: space-between
	align-items: center
	height: 100vh
	padding: 0 10px 0 30px
	font-weight: 500
	font-size: 12px
	user-select: none
	.infos
		display: flex
		align-items: center
		.close
			display: flex
			justify-content: center
			align-items: center
			height: 40px
			width: 40px
			margin-left: 10px
			cursor: pointer
			transition: all 0.15s
			&:hover
				background-color: rgba(255,100,100,0.20)
.progressbar
	position: absolute
	top: 0
	left: 0
	bottom: 0
	width: 25%
	background-color: #fff
	&-container
		position: absolute
		top: 0
		left: 0
		bottom: 0
		right: 0
		opacity: 0.15
		padding-left: 5%
		&::before
			content: ''
			position: absolute
			top: 0
			left: 0
			bottom: 0
			width: 5%
			background-color: #fff


</style>