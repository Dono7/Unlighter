<template>
	<a :href="href" @click.prevent="openUrl">{{label}}</a>
</template>

<script>
export default {
	props: {
		label: { type: String, required: false, default: ''},
		href: { type: String, required: false, default: '#'},
	},
	setup(props) {
		const openUrl = () => {
			if(props.href) {
				window.unlighter.openUrl(props.href)
			}
		}

		return { openUrl }
	}
}
</script>
