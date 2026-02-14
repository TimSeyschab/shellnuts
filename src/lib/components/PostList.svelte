<script lang="ts">
	import { resolve } from '$app/paths';

	let { posts } = $props();
</script>

{#each posts as post (post.slug)}
	<a
		class="card w-full border border-base-300 bg-base-100 shadow-md transition-all hover:shadow-xl hover:border-primary/40"
		href={resolve(`/post/${post.slug}`)}
		aria-label={`Read article: ${post.title}`}
	>
		<div class="card-body gap-4 p-6 md:p-8">
			<div class="flex flex-wrap items-center gap-2">
				<span class="badge badge-outline">{post.date}</span>
			</div>
			<h2 class="card-title text-2xl leading-tight md:text-3xl">{post.title}</h2>
			<p class="text-base-content/80 text-base md:text-lg">{post.preview.text}</p>
		</div>
	</a>
{/each}
