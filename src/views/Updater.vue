<script setup>
import { onBeforeMount, onUnmounted, ref } from "vue"
import Button from "@/components/Button"

const percent = ref(0)
const status = ref("fetching")
const states = ref({
	fetching: {
		text: "Looking for an update...",
		showSpinner: true,
		showBar: false,
		showDownloadBtn: false,
	},
	available: {
		text: "New version found....",
		showSpinner: true,
		showBar: false,
		showDownloadBtn: false,
	},
	downloading: {
		text: "Downloading the update...",
		showSpinner: false,
		showBar: true,
		showDownloadBtn: false,
	},
	downloaded: {
		text: "Update ready to be installed.",
		showSpinner: false,
		showBar: false,
		showDownloadBtn: true,
	},
	uptodate: {
		text: "Already up to date.",
		showSpinner: false,
		showBar: false,
		showDownloadBtn: false,
	},
	error: {
		text: "Unable to find an update.",
		showSpinner: false,
		showBar: false,
		showDownloadBtn: false,
	},
})

const quitAndInstall = () => {
	window.unlighter.execModuleMethod({ module: "Updater", method: "quitAndInstall" })
}

const closeUpdateWindow = () => {
	window.unlighter.execModuleMethod({ module: "Updater", method: "closeWindow" })
}

onBeforeMount(() => {
	window.unlighter.on("update-status", (e, updateData) => {
		percent.value = updateData.percent
		status.value = updateData.status
	})
})

onUnmounted(() => {
	window.unlighter.removeListener("update-status")
})
</script>

<template>
	<div class="content">
		<div v-if="states[status].showBar" class="progressbar-container">
			<div class="progressbar" :style="{ width: percent + '%' }"></div>
		</div>

		<p>{{ states[status].text }}</p>

		<div class="infos">
			<Button
				v-if="states[status].showDownloadBtn"
				iconPath="svg/download.svg"
				small
				@click="quitAndInstall"
			/>
			<img
				v-if="states[status].showSpinner"
				src="@/assets/svg/spinner.svg"
				class="spin"
			/>
			<p v-if="states[status].showBar" class="percent">{{ Math.round(percent) }}%</p>
			<div class="close" @click="closeUpdateWindow">
				<img src="@/assets/svg/close.svg" />
			</div>
		</div>
	</div>
</template>

<style lang="sass" scoped>
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
		z-index: 10
		.spin
			height: 12px
			transform: rotate(0deg)
			animation: spin 1.5s linear 0s infinite none
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
	width: 0%
	transition: width 0.6s ease
	background-color: $secondary
	&-container
		position: absolute
		top: 0
		left: 0
		bottom: 0
		right: 0
		margin-left: 5%
		&::before
			content: ''
			position: absolute
			top: 0
			left: -5%
			bottom: 0
			width: 5%
			background-color: $secondary

@keyframes spin
	0%
		transform: rotate(0deg)
	100%
		transform: rotate(360deg)
</style>
