<script>
	import PostsList from '$lib/components/PostList.svelte';

	/** @type {any} */
	export let data;
</script>

<div class="h-screen">
	<h1 class="text-center text-xl font-bold tracking-tight">
		Writing on Java hacks, DevOps adventures and culinary experiments 👨‍💻
	</h1>

	<div class="flex flex-col flex-grow gap-2 items-center justify-center pt-10">
		<PostsList posts={data.posts} />
	</div>
</div>